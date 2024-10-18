import type { HyperHandle } from "@dbushell/hyperserve";
import { authorized } from "@src/shared.ts";
import { manifest } from "@src/manifest.ts";

export const pattern = "/:slug/";

export const GET: HyperHandle = ({ request, match }) => {
  if (!authorized(request)) {
    return new Response(null, { status: 401 });
  }
  const slug = match.pathname.groups.slug;
  const data = manifest.routes[`/showcase/${slug}/`];
  if (data) {
    const latest = manifest.latest.map((props) => ({ ...props, body: "" }));
    return Response.json({
      ...data,
      latest,
    });
  }
  return new Response(null, { status: 400 });
};
