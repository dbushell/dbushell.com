import {marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import {markedSmartypants} from 'marked-smartypants';
import {gfmHeadingId as markedHeaderIds} from 'marked-gfm-heading-id';

const prismModule = `https://cdn.skypack.dev/prismjs`;

await import(prismModule);

await import(`${prismModule}/components/prism-jsx.js`);
await import(`${prismModule}/components/prism-markup-templating.js`);
await import(`${prismModule}/components/prism-php.js`);
await import(`${prismModule}/components/prism-diff.js`);
await import(`${prismModule}/components/prism-bash.js`);
await import(`${prismModule}/components/prism-json.js`);
await import(`${prismModule}/components/prism-toml.js`);
await import(`${prismModule}/components/prism-yaml.js`);
await import(`${prismModule}/components/prism-scss.js`);
await import(`${prismModule}/components/prism-sql.js`);
await import(`${prismModule}/components/prism-typescript.js`);
await import(`https://cdn.skypack.dev/prism-svelte`);

// TODO: real types?
declare global {
  const Prism: {
    languages: {[key: string]: string};
    highlight(code: string, language: string): string;
  };
}

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

marked.use(
  markedHighlight({
    langPrefix: 'language-',
    highlight: (code: string, language: string) => {
      if (Object.keys(Prism.languages).includes(language)) {
        code = Prism.highlight(code, Prism.languages[language]);
      } else if (language) {
        console.log(`⚠ Unknown prism "${language}"`);
      }
      return code;
    }
  })
);

const renderer = {
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
    return `<p class="Image"><img src="${href}" loading="lazy" alt="${text}"></p>\n`;
  },

  link(href: string, title: string | null | undefined, text: string) {
    try {
      const url = new URL(href);
      href = url.href;
    } catch {
      // Ignore...
    }
    let out = `<a href="${href}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    if (!/^[\/|#]/.test(href) && !/dbushell\.com/.test(href)) {
      out += ` rel="noopener noreferrer" target="_blank"`;
    }
    out += `>${text}</a>`;
    return out;
  }
};

marked.use({renderer});

const markdown = async (md: string): Promise<string> => await marked.parse(md);

export default markdown;
