import type {DinoHandle} from '@ssr/dinossr';
import type {Data} from '@src/types.ts';
import {replace} from '@src/shared.ts';

export const pattern = '.js';
export const order = 999;

export const GET: DinoHandle<Data> = async ({response, platform}) => {
  if (!(response instanceof Response) || !response.ok) {
    return response;
  }
  let body = await response.text();
  body = replace(body, '%DEPLOY_HASH%', platform.deployHash, true);
  response = new Response(body, response);
  response.headers.set('content-type', 'application/javascript; charset=utf-8');
  response.headers.set('content-length', body.length.toString());

  return response;
};
