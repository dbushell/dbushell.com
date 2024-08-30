import type {DinoHandle} from '@ssr/dinossr';
import type {Data} from '@src/types.ts';
import {appendHeaders, redirect} from '@src/shared.ts';

// Match all routes
export const pattern = '/*';

// After all other routes
export const order = 999;

export const GET: DinoHandle<Data> = async ({request, response, platform}) => {
  const url = new URL(request.url);

  // Redirect to RSS feed
  if (/^\/(rss|feed)\/?$/.test(url.pathname)) {
    return redirect(new URL('/rss.xml', url), 308);
  }
  if (!(response instanceof Response)) {
    return response;
  }

  appendHeaders(response, platform.serverData.pageHeaders);

  const styles = platform.serverData.styles;
  let stylesHTML = '';
  for (const {css, hash} of styles) {
    stylesHTML += `<style data-hash="${hash}">${css}</style>\n`;
  }

  if (response.headers.get('content-type')?.includes('text/html')) {
    let body = await response.text();
    body = body.replaceAll('%DEPLOY_HASH%', platform.deployHash);
    body = body.replace('%STYLES%', () => stylesHTML);
    response = new Response(body, response);
  }
  return response;
};
