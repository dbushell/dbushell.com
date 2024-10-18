import type { HyperHandle } from "@dbushell/hyperserve";
import { authorized } from "@src/shared.ts";
import { manifest } from "@src/manifest.ts";

export const pattern = "/:slug/";

const ignore = ["blog"];

export const GET: HyperHandle = ({ request, match }) => {
  if (!authorized(request)) {
    return new Response(null, { status: 401 });
  }
  const slug = match.pathname.groups.slug;
  if (ignore.includes(slug!)) {
    return;
  }
  const data = manifest.routes[`/${slug}/`];
  if (data) {
    const latest = manifest.latest.map((props) => ({ ...props, body: "" }));
    return Response.json({
      ...data,
      latest,
    });
  }
  return new Response(null, { status: 400 });
};
