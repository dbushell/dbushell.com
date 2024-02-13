import * as path from 'path';
import {serveDir, serveFile} from 'file_server';

const rootDir = path.resolve(Deno.cwd(), 'build');

export default Deno.serve({
  handler: async (request: Request) => {
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
