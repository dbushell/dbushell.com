import * as path from 'path';
import {encodeBase64} from 'base64';
import {TextLineStream} from 'streams';

const pwd = path.dirname(new URL(import.meta.url).pathname);
const cssPath = path.resolve(pwd, `../css/_stylesheet.css`);

export const process = async (buildDir: string) => {
  console.log('✧ Processing CSS');

  const cssDir = path.dirname(cssPath);
  const cssFile = await Deno.open(cssPath);
  const cssLines = cssFile.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  let css = '';
  for await (const line of cssLines) {
    const match = line.match(/^@import ['|"](.+?)['|"];\s*?$/);
    if (match) {
      css += `/* ${line} */\n`;
      css += await Deno.readTextFile(path.resolve(cssDir, match[1]));
    } else {
      css += `${line}\n`;
    }
  }

  // Remove excess whitespace
  css = css.replaceAll(/\s+/g, ' ').trim();

  const cssHash = encodeBase64(
    new Uint8Array(
      await crypto.subtle.digest('sha-256', new TextEncoder().encode(css))
    )
  );

  // Save to public directory
  const publicPath = path.resolve(buildDir, `assets/css/main.min.css`);
  await Promise.all([
    Deno.writeTextFile(publicPath, css),
    Deno.writeTextFile(publicPath.replace(/\.css$/, '.txt'), cssHash)
  ]);
  console.log(`✦ Processed CSS`);
};
