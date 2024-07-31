import type {DinoHandle} from '@ssr/dinossr';
import type {Data} from '@src/types.ts';
import {authorized} from '@src/shared.ts';
import {manifest} from '@src/manifest.ts';

export const pattern = '/';

export const GET: DinoHandle<Data> = ({request}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  return Response.json({
    latest: manifest.latest
  });
};
