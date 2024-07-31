import type {DinoHandle} from '@ssr/dinossr';
import type {Data} from '@src/types.ts';
import {authorized} from '@src/shared.ts';
import {manifest} from '@src/manifest.ts';

export const pattern = '/:slug/';

const ignore = ['blog'];

export const GET: DinoHandle<Data> = ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const slug = match.pathname.groups.slug;
  if (ignore.includes(slug!)) {
    return;
  }
  const data = manifest.routes[`/${slug}/`];
  if (data) {
    return Response.json({
      ...data,
      latest: manifest.latest
    });
  }
  return new Response(null, {status: 400});
};
