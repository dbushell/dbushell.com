import * as path from 'path';
import * as lcss from 'lightningcss';
import {encodeBase64} from 'base64';

const srcPath = path.join(Deno.cwd(), 'src/css/_stylesheet.css');

const cssOptions: lcss.BundleOptions<lcss.CustomAtRules> = {
  filename: srcPath,
  minify: true,
  sourceMap: false,
  include: lcss.Features.Nesting
};

let cssMin: string;
let cssHash: string;

export const rebuildCSS = async () => {
  const {code} = lcss.bundle(cssOptions);
  cssMin = new TextDecoder().decode(code);
  cssMin = cssMin.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  cssHash = encodeBase64(
    new Uint8Array(
      await crypto.subtle.digest('sha-256', new TextEncoder().encode(cssMin))
    )
  );
};

await rebuildCSS();

export {cssMin, cssHash};
