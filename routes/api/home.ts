import type { HyperHandle } from "@dbushell/hyperserve";
import { authorized } from "@src/shared.ts";
import { manifest } from "@src/manifest.ts";

export const pattern = "/";

export const GET: HyperHandle = ({ request }) => {
  if (!authorized(request)) {
    return new Response(null, { status: 401 });
  }
  const latest = manifest.latest.map((props) => ({ ...props, body: "" }));
  return Response.json({
    latest,
  });
};
