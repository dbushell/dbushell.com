import {authorized} from '@src/shared.ts';
import {manifest} from '@src/manifest.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/';

export const get: DinoHandle = ({request}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  return Response.json({
    latest: manifest.latest
  });
};
