import type {DinoHandle} from 'dinossr';
import type {Data} from '@src/types.ts';
import {authorized} from '@src/shared.ts';
import {manifest} from '@src/manifest.ts';

export const pattern = '/:page(\\d+)/';

export const GET: DinoHandle<Data> = ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const page = match.pathname.groups.page;
  let href = '';
  if (page === '1') {
    href = '/blog/';
  } else {
    href = `/blog/page/${[page]}/`;
  }
  const data = manifest.routes[href];
  if (data) {
    return Response.json({
      ...data,
      latest: manifest.latest
    });
  }
  return new Response(null, {status: 400});
};
