import type { Hyperserve } from "@dbushell/hyperserve";
import * as fs from "@std/fs";
import * as path from "@std/path";
import { assert } from "jsr:@std/assert";
import { Queue } from "@dbushell/carriageway";
import * as pagefind from "npm:pagefind@1.2.0";

performance.mark("b-start");

import { manifest } from "@src/manifest.ts";

const buildPath = path.resolve(Deno.cwd(), "build");
const staticPath = path.resolve(Deno.cwd(), "public");
const cachePath = path.join(Deno.cwd(), ".cache");

if (!(await fs.exists(cachePath))) {
  fs.ensureDir(cachePath);
}

const extra = [
  "/sitemap.xml",
  "/rss.xml",
  "/notes/rss.xml",
  "/_headers",
  "/sw.js",
  "/assets/scripts/head.js",
  "/assets/scripts/contact.js",
];

const fetchQueue = new Queue({ concurrency: 10 });

const searchExt = [".pf_fragment", ".pf_index", ".pf_meta", ".pagefind"];
const searchFiles = ["pagefind-entry.json", "pagefind.js"];

const search = async () => {
  performance.mark("s-start");

  // Setup Pagefind
  const { index } = await pagefind.createIndex({
    excludeSelectors: [".Box--cta"],
    rootSelector: "main",
  });
  assert(index, "Failed to create index");

  // Only index blog posts
  const dir = await index.addDirectory({
    glob: "<[0-9]:4>/**/*.html",
    path: "build",
  });

  if (dir.errors.length) console.error(dir.errors);
  assert(dir.errors.length === 0, "Index directory error");

  const data = await index.getFiles();

  if (data.errors.length) console.error(data.errors);
  assert(data.errors.length === 0, "Index files error");

  // Setup search directory
  const searchPath = path.join(buildPath, "_search");
  try {
    await Deno.remove(searchPath);
  } catch { /* Ignore */ }
  await fs.ensureDir(searchPath);

  for (const file of data.files) {
    // Skip junk
    if (searchExt.includes(path.extname(file.path)) === false) {
      if (searchFiles.includes(file.path) === false) {
        continue;
      }
    }
    // Write file
    const filePath = path.join(searchPath, file.path);
    await fs.ensureFile(filePath);
    await Deno.writeFile(filePath, file.content);
  }

  await pagefind.close();

  performance.mark("s-end");
  const { duration } = performance.measure("s", "s-start", "s-end");
  console.log(`Indexed ${dir.page_count} pages in ${duration.toFixed(2)}ms`);
};

export const build = async (server: Hyperserve) => {
  const now = performance.now();
  console.log("Building...");

  // Clear build directory and copy static files
  await fs.emptyDir(buildPath);
  await fs.copy(staticPath, buildPath, { overwrite: true });

  // Add manifest routes and islands
  const routePaths = Object.keys(manifest.routes);
  for (const path of routePaths) {
    if (/^\/\d{4}(\/|-)\d{2}\1\d{2}/.test(path)) {
      routePaths.push(`/llms${path}`);
    }
  }
  manifest.notes.forEach((note) => {
    routePaths.push(note.href);
  });
  routePaths.push(...extra);

  const tasks: Array<Promise<unknown>> = [];
  let taskDone = 0;

  // Open stdout writer and hide cursor
  const writer = Deno.stdout.writable.getWriter();
  const encoder = new TextEncoder();
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode("\x1b[?25l"));
  }

  const taskEnd = async (key: string) => {
    taskDone++;
    if (!Deno.stdout.isTerminal()) {
      return;
    }
    const elapsed = (performance.now() - now).toFixed(2).padStart(7, " ");
    const total = tasks.length.toString();
    const done = taskDone.toString().padStart(total.length, "0");
    key = key.slice(0, Deno.consoleSize().columns - 30);
    const message =
      `\r→ ${done}/${total} ${elapsed}ms \x1b[2m${key}\x1b[0m \x1b[0K`;
    await writer.write(encoder.encode(message));
  };

  for (const key of routePaths) {
    tasks.push(
      fetchQueue.append(key, async () => {
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
        await fs.ensureFile(routePath);
        const url = new URL(key, "http://127.0.0.1:8000");
        const request = new Request(url);
        request.headers.set(
          "authorization",
          `Bearer ${Deno.env.get("SSR_API_KEY")}`,
        );
        // const response = await fetch(request);
        const response = await server.router.handle(request, {
          info: {
            completed: Promise.resolve(),
            remoteAddr: {
              transport: "tcp",
              hostname: "127.0.0.1",
              port: 8000,
            },
          },
          cookies: new Map(),
          deployHash: server.deployHash,
          platformProps: {},
        });
        if (response.status !== 200 || !response.body) {
          console.log(response);
          throw new Error(`[${response.status}] ${response.url}`);
        }
        if (extra.includes(key)) {
          await Deno.remove(routePath).catch(() => {});
        }
        await Deno.writeFile(routePath, response.body!);
        await taskEnd(key);
      }),
    );
  }
  await Promise.all(tasks);

  // Clear progress and show cursor
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode("\r\x1b[0K\x1b[?25h"));
  }
  writer.releaseLock();
  const ms = (performance.now() - now).toFixed(2);
  console.log(`Built ${tasks.length} routes in ${ms}ms`);

  await search();

  performance.mark("b-end");

  const { duration } = performance.measure("b", "b-start", "b-end");
  console.log(`Total ${duration.toFixed(2)}ms`);
};
