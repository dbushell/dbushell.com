import {encodeBase64} from 'base64';
import {marked} from 'marked';
import {markedSmartypants} from 'marked-smartypants';
import {gfmHeadingId as markedHeaderIds} from 'marked-gfm-heading-id';
import * as shiki from 'shiki';
import {transformerRenderWhitespace} from 'shiki-transformers';
import {replace} from '@src/shared.ts';

const transformers = [transformerRenderWhitespace()];

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
    new Uint8Array(
      await crypto.subtle.digest('sha-256', new TextEncoder().encode(css))
    )
  );
  return {css, hash};
};

// TODO: silence only deprecated warnings
marked.use({
  silent: true
});

marked.use(
  markedHeaderIds({
    prefix: ''
  })
);

marked.use(markedSmartypants());

marked.use({
  async: true,
  async walkTokens(token) {
    if (token.type !== 'code') {
      return;
    }
    if (!token.lang) {
      return token.text;
    }
    if (!Object.hasOwn(shiki.bundledLanguages, token.lang)) {
      console.log(`⚠ Unknown lang: ${token.lang}`);
      return;
    }
    let code = await shiki.codeToHtml(token.text, {
      lang: token.lang,
      theme: 'dracula',
      colorReplacements: {
        '#6272a4': '#a3b5eb', // Grey
        '#ff79c6': '#ff93ce', // Pink
        '#bd93f9': '#caa7ff' // Purple
      },
      transformers
    });
    // Remove default Shiki classes
    code = stripStyles(code);
    code = replace(code, 'class="shiki dracula"', `data-lang="${token.lang}"`);
    code = replace(code, 'class="syntax-0"', '');
    token.escaped = true;
    token.text = code;
  },
  renderer: {
    code(code: string, _infostring: string | undefined, _escaped: boolean) {
      return code;
    }
  }
});

const renderer = {
   html(html: string, block: boolean | undefined) {
    if (!block) return html;
    const img = /(<img[^>]+?src=")([^"]+?)("[^>]*?>)/gs.exec(html);
    if (img) {
      const src = new URL(img[2], 'https://dbushell.com');
      html = replace(html, img[0], `${img[1]}${src}${img[3]}`);
    }
    return html;
  },

  paragraph(text: string) {
    if (text.startsWith('📢')) {
      return `<p class="Large">${text.replace(/^📢/, '').trim()}</p>\n`;
    }
    if (text.startsWith('💤')) {
      return `<p><small>${text.replace(/^💤/, '').trim()}</small></p>\n`;
    }
    if (text.startsWith('🖋️')) {
      return `<p class="Cursive">${text.replace(/^🖋️/, '').trim()}</p>\n`;
    }
    return /^<p[ |>]/.test(text) ? text : `<p>${text}</p>\n`;
  },

  image(href: string, _title: string | null, text: string) {
    text = typeof text === 'string' ? text : 'no description';
    let url: URL;
    try {
      url = /^[\/|#]/.test(href)
        ? new URL(href, 'https://dbushell.com')
        : new URL(href);
    } catch (err) {
      console.warn(`⚠️ Invalid URL: ${href}`);
      throw err;
    }
    return `<p class="Image"><img src="${url.href}" loading="lazy" alt="${text}"></p>\n`;
  },

  link(href: string, title: string | null | undefined, text: string) {
    let url: URL;
    try {
      url = /^[\/|#]/.test(href)
        ? new URL(href, 'https://dbushell.com')
        : new URL(href);
    } catch (err) {
      console.warn(`⚠️ Invalid URL: ${href}`);
      throw err;
    }
    let out = '<a';
    if (url.hostname === 'dbushell.com') {
      out += ` href="${url.href}"`;
    } else {
      out += ` href="${url.href}" rel="noopener noreferrer" target="_blank"`;
    }
    if (title) {
      out += ` title="${title}"`;
    }
    out += `>${text}</a>`;
    return out;
  }
};

marked.use({renderer});

const markdown = async (md: string): Promise<string> => await marked.parse(md);

export default markdown;
