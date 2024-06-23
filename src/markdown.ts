import {encodeBase64} from 'base64';
import type {MarkedExtension, Renderer, RendererObject, Tokens} from 'marked';
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
    new Uint8Array(await crypto.subtle.digest('sha-256', new TextEncoder().encode(css)))
  );
  return {css, hash};
};

marked.use();

marked.use(
  markedHeaderIds({
    prefix: ''
  })
);

marked.use(markedSmartypants());

marked.use({
  async: true,
  useNewRenderer: true,
  async walkTokens(token) {
    if (token.type === 'html') {
      const match = /(<div\s[^>]*>)(.+?)(<\/div>\s*)/s.exec(token.text);
      if (match) {
        token.text = await markdown(match[2]);
        token.text = `${match[1]}${token.text}${match[3]}`;
        return;
      }
    }
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
    code(args: Tokens.Code) {
      return args.text;
    }
  }
});

const renderer: RendererObject = {
  html({text}: Tokens.HTML | Tokens.Tag) {
    const img = /(<img[^>]+?src=")([^"]+?)("[^>]*?>)/gs.exec(text);
    if (img) {
      // Add full URL to source
      const src = new URL(img[2], 'https://dbushell.com');
      text = replace(text, img[0], `${img[1]}${src}${img[3]}`);
      // Add additional img attributes
      text = replace(text, '<img', '<img loading="lazy" decoding="async" fetchpriority="low"');
    }
    // Wrap images in figure
    if (/^<img[^>]+?>\s*$/gs.test(text)) {
      text = `<figure class="Image">\n${text}\n</figure>\n`;
    }
    return text;
  },

  paragraph(this: Renderer, token: Tokens.Paragraph) {
    const text = this.parser.parseInline(token.tokens).trim();
    // Do not wrap figures in paragraph
    if (text.startsWith('<figure') && text.endsWith('</figure>')) {
      return `${text}\n`;
    }
    if (text.startsWith('💤')) {
      return `<p><small>${text.replace(/^💤/, '').trim()}</small></p>\n`;
    }
    return /^<p[ |>]/.test(text) ? text : `<p>${text}</p>\n`;
  },

  image({text, href}: Tokens.Image) {
    text = typeof text === 'string' ? text : 'no description';
    let url: URL;
    try {
      url = /^[\/|#]/.test(href) ? new URL(href, 'https://dbushell.com') : new URL(href);
    } catch (err) {
      console.warn(`⚠️ Invalid URL: ${href}`);
      throw err;
    }
    return `<figure class="Image">\n<img loading="lazy" decoding="async" fetchpriority="low" src="${url.href}" alt="${text}">\n</figure>\n`;
  },

  link(this: Renderer, {href, title, tokens}: Tokens.Link) {
    const text = this.parser.parseInline(tokens);
    let url: URL;
    try {
      url = /^[\/|#]/.test(href) ? new URL(href, 'https://dbushell.com') : new URL(href);
    } catch (err) {
      console.warn(`⚠️ Invalid URL: ${href}`);
      throw err;
    }
    // Paths to open in new window
    const excludePaths = ['/tip/', '/twitter/', '/mastodon/'];
    let out = '<a';
    if (url.hostname === 'dbushell.com' && !excludePaths.includes(url.pathname)) {
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

const extension: MarkedExtension = {renderer, useNewRenderer: true};

marked.use(extension);

const markdown = async (md: string): Promise<string> => await marked.parse(md);

export default markdown;
