import {authorized} from '@src/shared.ts';
import {manifest} from '@src/manifest.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/:slug/';

export const GET: DinoHandle = ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const slug = match.pathname.groups.slug;
  const data = manifest.routes[`/showcase/${slug}/`];
  if (data) {
    return Response.json({
      ...data,
      latest: manifest.latest
    });
  }
  return new Response(null, {status: 400});
};
