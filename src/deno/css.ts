import * as path from 'path';
import * as base64 from 'base64';
import * as io from 'io';
import postcss from 'postcss';
import postcssNesting from 'postcss-nesting';
import cssnano from 'cssnano';
import cssNanoLite from 'cssnano-preset-lite';

const pwd = path.dirname(new URL(import.meta.url).pathname);
const cssPath = path.resolve(pwd, `../css/_stylesheet.css`);

export const process = async (buildDir: string) => {
  console.log('✧ Processing CSS');

  const cssDir = path.dirname(cssPath);
  const cssFile = await Deno.open(cssPath);
  let css = '';
  for await (const line of io.readLines(cssFile)) {
    const match = line.match(/^@import ['|"](.+?)['|"];\s*?$/);
    if (match) {
      css += `/* ${line} */\n`;
      css += await Deno.readTextFile(path.resolve(cssDir, match[1]));
    } else {
      css += `${line}\n`;
    }
  }
  cssFile.close();

  const postcssConfig = {from: undefined};
  const cssnanoConfig: cssnano.Options = {preset: [cssNanoLite, {}]};

  const preprocess = (css: string): Promise<string> => {
    return new Promise((resolve) => {
      postcss([postcssNesting, cssnano(cssnanoConfig)])
        .process(css, postcssConfig)
        .then((result: {css: string}) => {
          resolve(result.css);
        });
    });
  };

  css = await preprocess(css);

  // Remove excess whitespace
  css = css.replaceAll(/,\s*?\n\s*?/gm, ',');
  css = css.trim();

  const cssHash = base64.encode(
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
