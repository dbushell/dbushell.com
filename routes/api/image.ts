import type { HyperHandle } from "@dbushell/hyperserve";

export const pattern = "/";

const template = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
%STYLES%
<style>
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
  font-family: Komika, Raleway, sans-serif;
  font-size: 100px;
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
</style>
</head>
<body>
  <div id="card">
    <img id="image" src="/assets/images/dbushell-logotype.svg">
    <h1 id="heading">%TITLE%</h1>
  </div>
</body>
</html>
`;

import { escape, unescape } from "@dbushell/hyperless";

export const GET: HyperHandle = ({ request }) => {
  let body = template;
  let title = new URL(request.url).searchParams.get("title") ?? "dbushell.com";
  title = escape(unescape(title));
  title = title.replaceAll("-", '<span class="Hyphen">-</span>');
  body = body.replaceAll("%TITLE%", () => title);
  const response = new Response(body);
  response.headers.set(
    "content-type",
    "text/html; charset=utf-8",
  );
  return response;
};
