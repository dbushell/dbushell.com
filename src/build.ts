import * as fs from 'fs';
import * as path from 'path';
import {Queue} from 'carriageway';
import {manifest} from '@src/manifest.ts';
import type {DinoServer} from 'dinossr';

const buildPath = path.resolve(Deno.cwd(), 'build');
const staticPath = path.resolve(Deno.cwd(), 'public');

const extra = ['/sitemap.xml', '/rss.xml', '/_headers', '/sw.js'];

const fetchQueue = new Queue({concurrency: 10});

export const build = async (server: DinoServer) => {
  const now = performance.now();
  console.log('Building...');

  // Clear build directory and copy static files
  await fs.emptyDir(buildPath);
  await fs.copy(staticPath, buildPath, {overwrite: true});

  // Add manifest routes and islands
  const routePaths = Object.keys(manifest.routes);
  server.manifest.islands.forEach((island) => {
    routePaths.push(island.pattern);
  });
  routePaths.push(...extra);

  const tasks: Array<Promise<unknown>> = [];
  let taskDone = 0;

  // Open stdout writer and hide cursor
  const writer = Deno.stdout.writable.getWriter();
  const encoder = new TextEncoder();
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode('\x1b[?25l'));
  }

  const taskEnd = async (key: string) => {
    taskDone++;
    if (!Deno.stdout.isTerminal()) {
      return;
    }
    const elapsed = (performance.now() - now).toFixed(2).padStart(7, ' ');
    const total = tasks.length.toString();
    const done = taskDone.toString().padStart(total.length, '0');
    key = key.slice(0, Deno.consoleSize().columns - 30);
    const message = `\r→ ${done}/${total} ${elapsed}ms \x1b[2m${key}\x1b[0m \x1b[0K`;
    await writer.write(encoder.encode(message));
  };

  for (const key of routePaths) {
    tasks.push(
      fetchQueue.append(key, async () => {
        let routePath = 'index.html';
        if (key === '/404/') {
          routePath = '404.html';
        } else if (key !== '/') {
          routePath = key;
          if (key.endsWith('/')) {
            routePath += 'index.html';
          }
        }
        routePath = path.join(buildPath, routePath);
        await fs.ensureFile(routePath);
        const url = new URL(key, 'http://127.0.0.1:8000');
        const request = new Request(url);
        request.headers.set(
          'authorization',
          `Bearer ${Deno.env.get('SSR_API_KEY')}`
        );
        // const response = await fetch(request);
        const response = await server.router.handle(request, {
          info: {
            remoteAddr: {
              transport: 'tcp',
              hostname: '127.0.0.1',
              port: 8000
            }
          },
          cookies: new Map(),
          publicData: {},
          serverData: {},
          deployHash: server.deployHash
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
      })
    );
  }
  await Promise.all(tasks);

  // Clear progress and show cursor
  if (Deno.stdout.isTerminal()) {
    await writer.write(encoder.encode('\r\x1b[0K\x1b[?25h'));
  }
  writer.releaseLock();
  const ms = (performance.now() - now).toFixed(2);
  console.log(`Built ${tasks.length} routes in ${ms}ms`);
};
