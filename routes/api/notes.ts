import type { HyperHandle } from "@dbushell/hyperserve";
import { authorized } from "@src/shared.ts";
import { manifest } from "@src/manifest.ts";

export const pattern = "/:page(\\d+)/";

export const GET: HyperHandle = ({ request, match }) => {
  if (!authorized(request)) {
    return new Response(null, { status: 401 });
  }
  const page = match.pathname.groups.page;
  let href = "";
  if (page === "1") {
    href = "/notes/";
  } else {
    href = `/notes/page/${[page]}/`;
  }
  const data = manifest.routes[href];
  if (data) {
    const latest = manifest.latest.map((props) => ({ ...props, body: "" }));
    return Response.json({
      ...data,
      latest,
    });
  }
  return new Response(null, { status: 400 });
};
