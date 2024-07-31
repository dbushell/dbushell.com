import type {DinoHandle} from '@ssr/dinossr';
import type {Data} from '@src/types.ts';
import {authorized} from '@src/shared.ts';
import {manifest} from '@src/manifest.ts';

export const pattern = '/:year(\\d+)/:month(\\d+)/:day(\\d+)/:slug/';

export const GET: DinoHandle<Data> = ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const {year, month, day, slug} = match.pathname.groups;
  const href = `/${year}/${month}/${day}/${slug}/`;
  if (Object.hasOwn(manifest.routes, href)) {
    return Response.json({
      ...manifest.routes[href],
      latest: manifest.latest
    });
  }
  return new Response(null, {status: 400});
};
