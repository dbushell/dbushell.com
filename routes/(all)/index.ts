import {appendHeaders, replace, redirect} from '@src/shared.ts';
import type {DinoHandle} from 'dinossr';

// Match all routes
export const pattern = '/*';

// After all other routes
export const order = 999;

export const GET: DinoHandle = async ({request, response, platform}) => {
  const url = new URL(request.url);

  // Redirect to RSS feed
  if (/^\/(rss|feed)\/?$/.test(url.pathname)) {
    return redirect(new URL('/rss.xml', url), 308);
  }
  if (!(response instanceof Response)) {
    return response;
  }

  appendHeaders(
    response,
    platform.serverData.pageHeaders as [string, string][]
  );

  const styles = platform.serverData.styles as Array<{
    css: string;
    hash: string;
  }>;
  let stylesHTML = '';
  for (const {css, hash} of styles) {
    stylesHTML += `<style data-hash="${hash}">${css}</style>\n`;
  }

  if (response.headers.get('content-type')?.includes('text/html')) {
    let body = await response.text();
    body = replace(body, '%DEPLOY_HASH%', platform.deployHash, true);
    body = replace(body, '%STYLES%', stylesHTML);
    response = new Response(body, response);
  }
  return response;
};
