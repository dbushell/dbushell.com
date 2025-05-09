import { encodeBase64 } from "@std/encoding";
import { escape, unescape } from "@dbushell/hyperless";
import { DHono, DRoute } from "@src/types.ts";

const style = `
body {
  display: block;
  padding: 0;
}
#card {
  align-content: center;
  background-color: oklch(var(--db-green));
  background-image: url('/assets/images/masthead-pattern.svg');
  background-size: calc((300 / 16) * 1rem) auto;
  block-size: 630px;
  inline-size: 1200px;
  padding: 0 40px;
}
#image {
  inline-size: auto;
  block-size: 200px;
  margin: -20px auto 30px auto;
}
#heading {
  color: oklch(var(--db-blue));
  font-family: Komika, sans-serif;
  font-size: 110px;
  font-weight: 600px;
  line-height: 1;
  margin: 0;
  overflow-wrap: break-word;
  paint-order: stroke fill;
  position: relative;
  text-align: center;
  text-wrap: balance;
  -webkit-text-stroke: 6px oklch(var(--db-light));

  & .Hyphen {
    display: inline-block;
    transform: translateX(20%) translateY(5%);
  }
}
`;

const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
%STYLES%
<style>${style}</style>
</head>
<body>
  <div id="card">
    <img id="image" src="/assets/images/dbushell-logotype.svg">
    <h1 id="heading">%TITLE%</h1>
  </div>
</body>
</html>
`;

const style_hash = encodeBase64(
  new Uint8Array(
    await crypto.subtle.digest("sha-256", new TextEncoder().encode(style)),
  ),
);

export const middleware = (hono: DHono, route: DRoute) => {
  hono.get(route.pattern, (ctx) => {
    let body = template;
    let title = new URL(ctx.req.url).searchParams.get("title") ??
      "dbushell.com";
    title = escape(unescape(title));
    title = title.replaceAll("-", '<span class="Hyphen">-</span>');
    body = body.replaceAll("%TITLE%", () => title);
    const bytes = new TextEncoder().encode(body);
    ctx.header("content-type", "text/html; charset=utf-8");
    ctx.header("content-length", String(bytes.byteLength));
    ctx.header("x-style-src", `'sha256-${style_hash}'`, {
      append: true,
    });
    return ctx.body(bytes);
  });
};
