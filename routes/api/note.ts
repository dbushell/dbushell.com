import { DHono, DRoute } from "@src/types.ts";
import { manifest } from "@src/content/manifest.ts";

const dateParts = (date: Date): Record<string, string> => {
  const ISO = date.toISOString();
  const D = date.getDate().toString();
  const dddd = date.toLocaleString("en-GB", { weekday: "long" });
  const dd = date.toLocaleString("en-GB", { weekday: "short" });
  const MMMM = date.toLocaleString("en-GB", { month: "long" });
  const MMM = date.toLocaleString("en-GB", { month: "short" });
  const YYYY = date.getFullYear().toString();
  const HH = date.getUTCHours().toString().padStart(2, "0");
  const mm = date.getUTCMinutes().toString().padStart(2, "0");
  return { ISO, D, dddd, dd, MMMM, MMM, YYYY, HH, mm };
};

export const middleware = (hono: DHono, route: DRoute) => {
  const pattern = route.pattern.replace(/\/$/, "");
  hono.get(`${pattern}/:slug{\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}Z}/`, (ctx) => {
    const { slug } = ctx.req.param();
    const props = manifest.notes.find((props) =>
      props.href.endsWith(`/${slug}/`)
    );
    if (props === undefined) {
      return ctx.notFound();
    }
    const { HH, mm, dd, D, MMM, YYYY } = dateParts(props!.date);
    return ctx.json({
      ...props,
      latest: manifest.latest,
      title: `Notes – ${HH}:${mm} ${dd} ${D} ${MMM} ${YYYY}`,
    });
  });
};
