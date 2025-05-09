import * as path from "@std/path";
import * as lcss from "lightningcss";
import { encodeBase64 } from "@std/encoding";

const srcPath = path.join(Deno.cwd(), "public/assets/css/stylesheet.css");

const cssOptions: lcss.BundleOptions<lcss.CustomAtRules> = {
  filename: srcPath,
  minify: true,
  sourceMap: false,
  include: lcss.Features.Nesting,
};

let cssMin: string;
let cssHash: string;

export const rebuildCSS = async (deployHash: string) => {
  const { code } = lcss.bundle(cssOptions);
  cssMin = new TextDecoder().decode(code);
  cssMin = cssMin.replaceAll("%DEPLOY_HASH%", deployHash);
  cssMin = cssMin.replace(/\/\*[\s\S]*?\*\//g, "").trim();
  cssHash = encodeBase64(
    new Uint8Array(
      await crypto.subtle.digest("sha-256", new TextEncoder().encode(cssMin)),
    ),
  );
};

export { cssHash, cssMin };
