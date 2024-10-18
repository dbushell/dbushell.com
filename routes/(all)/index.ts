import type { HyperHandle } from "jsr:@dbushell/hyperserve";
import { appendHeaders, redirect } from "@src/shared.ts";

// Match all routes
export const pattern = "/*";

// After all other routes
export const order = 999;

export const GET: HyperHandle = async ({ request, response, platform }) => {
  const url = new URL(request.url);

  // Redirect to RSS feed
  if (/^\/(rss|feed)\/?$/.test(url.pathname)) {
    return redirect(new URL("/rss.xml", url), 308);
  }
  if (!(response instanceof Response)) {
    return response;
  }

  appendHeaders(response, platform.platformProps.pageHeaders);

  return response;
};
