import * as path from 'path';
import * as toml from 'toml';
import {serveDir, serveFile} from 'file_server';
import {getProps} from './manifest.ts';
import {MANIFEST, renderRoute} from './mod.ts';
import type {NetlifyTOMLHeaderValues, NetlifyTOML} from './types.ts';

const baseDir = path.dirname(new URL(import.meta.url).pathname);
const rootDir = path.resolve(baseDir, '../../public');

// Netlify response headers
const netlifyPath = path.resolve(baseDir, '../../netlify.toml');
let netlifyHeaders: NetlifyTOMLHeaderValues | undefined;
let netlifyStat: Deno.FileInfo | undefined;

const getHeaders = async () => {
  const stat = await Deno.stat(netlifyPath);
  if (netlifyStat?.mtime?.getTime() !== stat.mtime?.getTime()) {
    const netlify = toml.parse(
      await Deno.readTextFile(netlifyPath)
    ) as unknown as NetlifyTOML;
    netlifyHeaders = netlify.headers.find(
      (header) => header.for === '/*'
    )?.values;
  }
  return netlifyHeaders;
};

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
      const headers = await getHeaders();
      if (headers) {
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      }
    } catch {
      // Do nothing (probably a 301)
      console.debug(response.status, request.url);
    }
    return response;
  }
});
