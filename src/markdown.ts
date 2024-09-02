import {encodeBase64} from '@std/encoding';
import * as shiki from 'shiki';
import {transformerRenderWhitespace} from '@shikijs/transformers';
import {hmmarkdown, hmmtypography, defaultOptions} from '@dbushell/hmmarkdown';
// import {hmmarkdown, hmmtypography, defaultOptions} from '../../packages/hmmarkdown/mod.ts';
export {hmmtypography};

export const cssMap = new Map<string, string>();
const styleAttr = /style=(["'])(.*?)\1/g;

/** Strip `<code>` inline styles and map to class */
const stripStyles = (code: string) => {
  return code.replace(styleAttr, (...args: Array<string>) => {
    if (!cssMap.has(args[2])) {
      cssMap.set(args[2], `syntax-${cssMap.size}`);
    }
    return `class="${cssMap.get(args[2])}"`;
  });
};

/** Get code syntax CSS and CSP hash */
export const syntaxCSS = async () => {
  let css = [...cssMap.entries()].map(([k, v]) => `.${v}{${k};}`).join('');
  css = `@layer syntax{${css}}`;
  const hash = encodeBase64(
    new Uint8Array(await crypto.subtle.digest('sha-256', new TextEncoder().encode(css)))
  );
  return {css, hash};
};

const transformers = [transformerRenderWhitespace()];

defaultOptions.blockFilters = {
  image: (props) => {
    const href = props.attributes.src;
    const url = href[0] === '/' ? new URL(href, 'https://dbushell.com') : new URL(href);
    props.attributes.src = url.href;
    props.attributes.decoding = 'async';
    props.attributes.fetchpriority = 'low';
    props.attributes.loading = 'lazy';
    if (props.attributes._parentTag !== 'figure') {
      props.before = `<figure class="Image">`;
      props.after = `</figure>`;
    }
    return Promise.resolve();
  },
  preformatted: async (props) => {
    const lang = props.attributes['data-lang'];
    let {code} = props;
    // Handle plaintext
    if (!lang || ['plain', 'text', 'txt'].includes(lang)) {
      const lines = (code as string).split('\n');
      code = '';
      for (const line of lines) {
        code += `<span class="line">${line}</span>\n`;
      }
      props.code = code;
      props.attributes['data-lang'] = 'text';
      return;
    }
    if (!Object.hasOwn(shiki.bundledLanguages, lang)) {
      console.log(`⚠ Unknown lang: ${lang}`);
      return;
    }
    code = await shiki.codeToHtml(code, {
      lang,
      theme: 'dracula',
      colorReplacements: {
        '#6272a4': '#a3b5eb', // Grey
        '#ff79c6': '#ff93ce', // Pink
        '#bd93f9': '#caa7ff' // Purple
      },
      transformers
    });
    // Remove default Shiki wrapper
    code = stripStyles(code);
    code = code.replace(/^<pre[^>]*?><code>/, '');
    code = code.replace(/<\/code><\/pre>$/, '');
    props.code = code;
  }
};

defaultOptions.inlineFilters = {
  anchor: (props) => {
    const href = props.attributes.href;
    const url = /^[\/|#]/.test(href) ? new URL(href, 'https://dbushell.com') : new URL(href);
    const excludePaths = ['/tip/', '/mastodon/'];
    props.attributes.href = href[0] === '#' ? url.hash : url.href;
    if (url.hostname !== 'dbushell.com' || excludePaths.includes(url.pathname)) {
      props.attributes.rel = 'noopener noreferrer';
      props.attributes.target = '_blank';
    }
    return Promise.resolve();
  }
};

const markdown = (md: string): Promise<string> => {
  return hmmarkdown(md, defaultOptions);
};

export default markdown;
