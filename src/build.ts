import * as fs from "@std/fs";
import * as path from "@std/path";
import { assert } from "@std/assert";
import { toText } from "@std/streams";
import { decodeHex } from "@std/encoding";
import { Node, parseHTML, stripTags } from "@dbushell/hyperless";
import type { DConfig, DHono } from "./types.ts";

performance.mark("b-start");

import { manifest } from "./content/manifest.ts";
import no_index from "../data/no-index.json" with { type: "json" };

const buildPath = path.resolve(Deno.cwd(), "build");
const cachePath = path.join(Deno.cwd(), ".cache");

if (!(await fs.exists(cachePath))) {
  fs.ensureDir(cachePath);
}

const extra = [
  "/rss.xml",
  "/notes/rss.xml",
  "/merge/rss.xml",
  "/sitemap.xml",
  "/assets/scripts/head.js",
  "/sw.js",
];

const word_index = new Map<string, {
  count: number;
  pages: {
    hash: string;
    count: number;
  }[];
}>();

const normalizeWords = (input: string): string[] => {
  return input
    .replaceAll(/[’]/g, "")
    .replaceAll(/[-–—,_“”!?\.…]/g, " ")
    .split(/\b/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && /\w+/.test(w))
    .map((w) =>
      w.normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
    );
};

const parseWords = (node: Node, hash: string) => {
  const remove: Node[] = [];
  node.traverse((n) => {
    if (["nav", "aside"].includes(n.tag)) {
      n.detach();
      remove.push(n);
      return false;
    }
  });
  remove.forEach((n) => n.detach());

  const words = normalizeWords(stripTags(node));

  // Count unique words
  const word_count = new Map<string, number>();
  for (const word of words) {
    if (no_index.includes(word)) continue;
    word_count.set(word, (word_count.get(word) ?? 0) + 1);
  }
  // Add to global tally
  for (const [word, count] of word_count.entries()) {
    if (!word_index.has(word)) {
      word_index.set(word, { count: 0, pages: [] });
    }
    const item = word_index.get(word)!;
    item.pages.push({ hash, count });
    item.count += 1;
  }
};

export const build = async (hono: DHono, config: DConfig) => {
  const now = performance.now();
  console.log("Building...");

  // Clear build directory and copy static files
  await fs.emptyDir(buildPath);
  await fs.copy(config.publicDir, buildPath, { overwrite: true });

  // Add manifest routes and islands
  const routePaths = Object.keys(manifest.routes);
  manifest.notes.forEach((note) => {
    routePaths.push(note.href);
  });
  routePaths.push(...extra);

  for (const key of manifest.glossary.keys()) {
    routePaths.push(`/glossary/${key}.json`);
  }

  // Open stdout writer and hide cursor
  const writer = Deno.stdout.writable.getWriter();
  const encoder = new TextEncoder();
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode("\x1b[?25l"));
  }

  let taskDone = 0;
  const taskEnd = async (key: string) => {
    taskDone++;
    if (!Deno.stdout.isTerminal()) {
      return;
    }
    const elapsed = (performance.now() - now).toFixed(2).padStart(7, " ");
    const total = routePaths.length.toString();
    const done = taskDone.toString().padStart(total.length, "0");
    key = key.slice(0, Deno.consoleSize().columns - 30);
    const message =
      `\r→ ${done}/${total} ${elapsed}ms \x1b[2m${key}\x1b[0m \x1b[0K`;
    await writer.write(encoder.encode(message));
  };

  // Fake request params
  // const cookies = new Map();
  const info: Deno.ServeHandlerInfo<Deno.Addr> = {
    completed: Promise.resolve(),
    remoteAddr: {
      transport: "tcp",
      hostname: "127.0.0.1",
      port: 8000,
    },
  };

  const search_pages: string[][] = [];

  for (const key of routePaths) {
    let routePath = "index.html";
    if (key === "/404/") {
      routePath = "404.html";
    } else if (key !== "/") {
      routePath = key;
      if (key.endsWith("/")) {
        routePath += "index.html";
      }
    }
    routePath = path.join(buildPath, routePath);
    const url = new URL(key, "http://127.0.0.1:8000");
    const request = new Request(url);
    request.headers.set(
      "authorization",
      `Bearer ${Deno.env.get("SSR_API_KEY")}`,
    );
    // const response = await fetch(request);
    // const response = await server.router.handle(request, {
    //   info,
    //   deployHash: config.deployHash,
    //   platformProps: {},
    // });
    const response = await hono.fetch(request, {
      info,
      origin: config.origin,
      deployHash: config.deployHash,
      devMode: false,
    });
    if (response.status !== 200 || !response.body) {
      console.log("\n");
      console.log(url.href);
      console.log(response);
      throw new Error(`[${response.status}] ${response.url}`);
    }
    await fs.ensureFile(routePath);
    if (extra.includes(key)) {
      await Deno.remove(routePath).catch(() => {});
    }
    const [tee1, tee2] = response.body.tee();
    await Deno.writeFile(routePath, tee1);

    // Build search index
    if (/^\/\d{4}(\/|-)\d{2}\1\d{2}/.test(key)) {
      const hash = manifest.routes[key].hash;
      assert(hash);
      const text = await toText(tee2);
      let node: Node | null = parseHTML(text);
      node = node.find((n) => n.tag === "main");
      assert(node);
      search_pages.push([hash, key, manifest.routes[key].title]);
      parseWords(node, hash);
    } else {
      await tee2.cancel();
    }

    taskEnd(key);
  }

  // Clear progress and show cursor
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode("\r\x1b[0K\x1b[?25h"));
  }
  writer.releaseLock();
  const ms = (performance.now() - now).toFixed(2);
  console.log(`Built ${taskDone} routes in ${ms}ms`);

  performance.mark("s-start");

  const search_words = word_index.entries().toArray().sort((a, b) =>
    b[1].count - a[1].count
  ).map((w) => {
    return [
      w[0],
      w[1].count,
      [
        ...w[1].pages.toSorted((a, b) => b.count - a.count).map(
          (p) => [p.hash, p.count],
        ),
      ],
    ];
  });
  const enc = (str: string) => encoder.encode(str);

  using file = await Deno.open("data/index.json", {
    truncate: true,
    create: true,
    write: true,
  });

  const buffer = new Uint8Array(1024);
  let offset = 0;

  const flush = async () => {
    await file.write(buffer.subarray(0, offset));
    offset = 0;
  };

  const write = async (bytes: Uint8Array) => {
    if (offset + bytes.length > buffer.length) {
      await flush();
    }
    buffer.set(bytes, offset);
    offset += bytes.length;
  };

  const buf32 = new Uint8Array(4);
  const buf16 = new Uint8Array(2);
  const buf8 = new Uint8Array(1);
  const v32 = new DataView(buf32.buffer);
  const v16 = new DataView(buf16.buffer);
  const v8 = new DataView(buf8.buffer);

  v32.setUint32(0, search_words.length, true);
  await write(buf32);

  for (const w of search_words) {
    const [word, count, pages] = w as [string, number, [string, number][]];
    assert(word.length < 256);
    assert(count < 65_536);
    // Write word length + word
    const word_buf = enc(word);
    v8.setUint8(0, word_buf.byteLength);
    await write(buf8);
    await write(word_buf);
    // Write page count
    v16.setUint16(0, count, true);
    await write(buf16);
    // Write pages
    for (const [p, c] of pages) {
      await write(decodeHex(p));
      assert(c < 256);
      v8.setUint8(0, c);
      await write(buf8);
    }
  }

  v32.setUint32(0, search_pages.length, true);
  await write(buf32);
  for (const [hash, href, title] of search_pages) {
    await write(decodeHex(hash));
    const href_buf = enc(href);
    v8.setUint8(0, href_buf.byteLength);
    await write(buf8);
    await write(href_buf);
    const title_buf = enc(title);
    v8.setUint8(0, title_buf.byteLength);
    await write(buf8);
    await write(title_buf);
  }

  await flush();

  {
    performance.mark("s-end");
    const { duration } = performance.measure("s", "s-start", "s-end");
    console.log(`Search ${duration.toFixed(2)}ms`);
  }

  performance.mark("b-end");
  const { duration } = performance.measure("b", "b-start", "b-end");
  console.log(`Total ${duration.toFixed(2)}ms`);
};
