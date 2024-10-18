import type { HyperHandle } from "@dbushell/hyperserve";
import { authorized } from "@src/shared.ts";
import { manifest } from "@src/manifest.ts";

export const pattern = "/:year(\\d+)/:month(\\d+)/:day(\\d+)/:slug/";

export const GET: HyperHandle = ({ request, match }) => {
  if (!authorized(request)) {
    return new Response(null, { status: 401 });
  }
  const { year, month, day, slug } = match.pathname.groups;
  const href = `/${year}/${month}/${day}/${slug}/`;
  if (Object.hasOwn(manifest.routes, href)) {
    const latest = manifest.latest.map((props) => ({ ...props, body: "" }));
    return Response.json({
      ...manifest.routes[href],
      latest,
    });
  }
  return new Response(null, { status: 400 });
};
