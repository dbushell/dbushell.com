import type { Hyperserve } from "@dbushell/hyperserve";
import * as fs from "@std/fs";
import * as path from "@std/path";
import { Queue } from "@dbushell/carriageway";

performance.mark("build-start");

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

export const build = async (server: Hyperserve) => {
  const now = performance.now();
  console.log("Building...");

  // Clear build directory and copy static files
  await fs.emptyDir(buildPath);
  await fs.copy(staticPath, buildPath, { overwrite: true });

  // Add manifest routes and islands
  const routePaths = Object.keys(manifest.routes);
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

  performance.mark("build-end");

  console.log(
    `Total ${
      performance.measure("build", "build-start", "build-end").duration.toFixed(
        2,
      )
    }ms`,
  );
};
