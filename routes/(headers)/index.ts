import {authorized, replace} from '@src/shared.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/_headers';
export const order = 9999;

export const GET: DinoHandle = async ({request, response}) => {
  if (!authorized(request)) {
    return null;
  }
  if (!(response instanceof Response) || !response.ok) {
    return response;
  }
  const home = await fetch(new URL('/', request.url));
  await home.body?.cancel();
  const csp =
    home.headers.get('content-security-policy') ?? `default-src 'self'`;
  let body = await response.text();
  body = replace(body, '%CONTENT_SECURITY_POLICY%', csp);
  response = new Response(body, response);
  response.headers.set('content-length', body.length.toString());
  return response;
};
