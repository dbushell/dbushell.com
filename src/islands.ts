import type {DinoHandle} from '@ssr/dinossr';
import type {Data} from '@src/types.ts';
import * as fs from '@std/fs';
import * as path from '@std/path';
import * as esbuild from 'esbuild';
import {replace} from '@src/shared.ts';

export const islands: DinoHandle<Data> = async ({request, platform}) => {
  if (request.method !== 'GET') return;

  const pattern = new URLPattern({pathname: '/assets/scripts/*'});
  const match = pattern.exec(request.url);
  if (!match) return;

  let srcPath = path.join(Deno.cwd(), `src/scripts/${match.pathname.groups[0]!}`);

  srcPath = srcPath.replace('.js', '.ts');

  if (!(await fs.exists(srcPath))) {
    return new Response(null, {status: 404});
  }

  const result = await esbuild.build({
    entryPoints: [srcPath],
    format: 'esm',
    loader: {'.ts': 'ts'},
    target: 'esnext',
    platform: 'browser',
    bundle: true,
    minify: true,
    write: false
  });

  let src = result.outputFiles?.[0]?.text ?? '';

  src = replace(src, '%DEPLOY_HASH%', platform.deployHash, true);

  return new Response(src, {
    headers: {
      'content-type': 'text/javascript; charset=utf-8'
    }
  });
};

esbuild.stop();
