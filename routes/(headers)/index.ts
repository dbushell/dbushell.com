import type { HyperHandle } from "@dbushell/hyperserve";
import { authorized } from "@src/shared.ts";

export const pattern = "/_headers";
export const order = 9999;

export const GET: HyperHandle = async ({ request, response }) => {
  if (!authorized(request)) {
    return null;
  }
  if (!(response instanceof Response) || !response.ok) {
    return response;
  }
  const home = await fetch(new URL("/", request.url));
  await home.body?.cancel();
  const csp = home.headers.get("content-security-policy") ??
    `default-src 'self'`;
  let body = await response.text();
  body = body.replace("%CONTENT_SECURITY_POLICY%", csp);
  response = new Response(body, response);
  response.headers.set("content-length", body.length.toString());
  return response;
};
