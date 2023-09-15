import * as path from 'path';
import {serveDir, serveFile} from 'file_server';
import {getProps} from './manifest.ts';
import {MANIFEST, renderRoute} from './mod.ts';

const baseDir = path.dirname(new URL(import.meta.url).pathname);
const rootDir = path.resolve(baseDir, '../../public');

Deno.serve({
  port: 8080,
  handler: async (request: Request) => {
    const url = new URL(request.url);
    const props = await getProps(url, MANIFEST);
    if (props) {
      await renderRoute(props, true);
    }
    let response = await serveDir(request, {
      fsRoot: rootDir,
      quiet: true
    });
    if (response.status === 404) {
      response = await serveFile(request, path.resolve(rootDir, '404.html'));
    }
    try {
      response.headers.set(
        'cache-control',
        'max-age=0, no-store, no-cache, must-revalidate, proxy-revalidate'
      );
    } catch {
      // Do nothing (probably a 301)
      console.debug(response.status, request.url);
    }
    return response;
  }
});
