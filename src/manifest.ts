import * as data from '@src/data.ts';
import {cssMin, cssHash} from '@src/css.ts';
import {syntaxCSS} from '@src/markdown.ts';
import type {Props, Manifest} from './types.ts';

export const getProps = async (
  url: URL,
  manifest: Manifest
): Promise<Props | undefined> => {
  if (!Object.hasOwn(manifest.routes, url.pathname)) {
    return;
  }
  let props = manifest.routes[url.pathname];
  if (props.src) {
    props = {
      ...props,
      ...(await data.readProps(props.src))
    };
  }
  return props;
};

export const generateManifest = async () => {
  const now = performance.now();
  console.log('Manifesting...');

  const manifest: Manifest = {
    routes: {},
    latest: [],
    styles: [
      {
        css: cssMin,
        hash: cssHash
      }
    ]
  };

  manifest.routes['/'] = {
    container: 'home',
    title: 'Home',
    body: '',
    excerpt: '',
    href: '/',
    changefreq: 'weekly',
    priority: '1.0'
  };

  manifest.routes['/contact/'] = {
    container: 'contact',
    title: 'Contact',
    body: '',
    excerpt: '',
    href: '/contact/',
    changefreq: 'monthly',
    priority: '0.8'
  };

  for (const props of await data.readPages()) {
    manifest.routes[props.href] = props;
  }

  const articleProps = await data.readArticles();
  manifest.latest = articleProps.slice(0, 10);
  for (const props of articleProps) {
    manifest.routes[props.href] = props;
  }

  let index = 0;
  while (articleProps.length > 0) {
    const articles = articleProps.splice(0, 7);
    const href = ++index === 1 ? `/blog/` : `/blog/page/${index}/`;
    const title = `Blog` + (index > 1 ? ` (page ${index})` : ``);
    let next = '';
    if (articleProps.length) {
      next = `/blog/page/${index + 1}/`;
    }
    let prev = '';
    if (index > 1) {
      prev = index === 2 ? '/blog/' : `/blog/page/${index - 1}/`;
    }
    const props: Props = {
      href,
      title,
      articles,
      next,
      prev,
      body: '',
      excerpt: '',
      changefreq: index === 1 ? 'weekly' : 'monthly',
      priority: index === 1 ? '0.9' : '0.5',
      container: 'archive'
    };
    manifest.routes[href] = props;
  }

  manifest.styles.push(await syntaxCSS());

  console.log(`Manifested in ${(performance.now() - now).toFixed(2)}ms`);

  return manifest;
};

let manifest: Manifest;

export const rebuildManifest = async () => {
  manifest = await generateManifest();
};

await rebuildManifest();

export {manifest};
