import type {Data} from '@src/types.ts';
import * as path from '@std/path';
import {debounce} from '@std/async';
import {DinoSsr} from '@ssr/dinossr';
import {middleware} from '@src/middleware.ts';
import {islands} from '@src/islands.ts';
import {build} from '@src/build.ts';
import {rebuildCSS} from '@src/css.ts';
import {rebuildManifest} from '@src/manifest.ts';
import {replace} from '@src/shared.ts';

// Only required for live Deno server
Deno.env.set('SSR_API_KEY', Deno.env.get('SSR_API_KEY') ?? '1');

const DEV = Deno.args.includes('--dev');
const PROD = Deno.args.includes('--prod');
const BUILD = Deno.args.includes('--build');

if (PROD) {
  const server = (await import('@src/production.ts')).default;
  await server.finished;
  Deno.exit(0);
}

const dir = new URL('./', import.meta.url).pathname;
let dinossr: DinoSsr<Data>;
let controller: AbortController;

const start = async () => {
  controller = new AbortController();

  dinossr = new DinoSsr<Data>(dir, {
    dev: DEV || BUILD,
    static: 'public',
    deployHash: DEV ? 'dev' : undefined,
    serve: {
      signal: controller.signal,
      hostname: '127.0.0.1',
      port: 8000
    }
  });

  await dinossr.init();

  dinossr.router.use(middleware);

  dinossr.router.use(islands);

  dinossr.router.onError = (error, request) => {
    console.log(request.url, error);
    return new Response(null, {status: 500});
  };

  dinossr.router.onNoMatch = async (request, platform) => {
    const url = new URL(request.url);
    if (
      // Avoid infinite loop
      url.pathname === '/404/' ||
      // Ignore non-HTML requests
      !request.headers.get('accept')?.includes('text/html')
    ) {
      return new Response(null, {status: 404});
    }
    // Get 404 page render with headers
    const response = await dinossr.router.handle(
      new Request(new URL('/404/', request.url), request),
      platform
    );
    return new Response(response.body, {status: 404});
  };

  if (DEV) {
    // Rewrite relative URLs for local development
    dinossr.router.get('*', async ({response}) => {
      if (
        response?.ok &&
        response.body &&
        response.headers.get('content-type')?.startsWith('text/html')
      ) {
        let body = await response.text();
        body = replace(body, 'https://dbushell.com/', '/', true);
        return new Response(body, response);
      }
    });
  }
};

await start();

await rebuildCSS(dinossr!.deployHash);
await rebuildManifest();

if (BUILD) {
  await build(dinossr!);
  Deno.exit(0);
}

const watcher = Deno.watchFs(dir);

const events = ['create', 'modify', 'remove'];
const directories = ['components', 'routes', 'server', 'src'];

const update = debounce(async (ev: Deno.FsEvent) => {
  if (controller.signal.aborted) return;
  if (!events.includes(ev.kind)) return;
  let refresh = false;
  let data = false;
  let css = false;
  for (const evpath of ev.paths) {
    const dir = path.dirname(evpath.replace(Deno.cwd(), ''));
    if (!directories.includes(dir.split('/')[1])) continue;
    if (evpath.includes('.min.')) continue;
    if (dir.startsWith('/src/data')) data = true;
    if (dir.startsWith('/src/css')) css = true;
    refresh = true;
  }
  if (!refresh) return;
  controller.abort();
  await dinossr.server.finished;
  if (css) await rebuildCSS(dinossr.deployHash);
  if (css || data) await rebuildManifest();
  start();
}, 1000);

for await (const event of watcher) {
  update(event);
}
