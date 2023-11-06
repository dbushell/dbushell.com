import * as data from './data.ts';
import * as svelte from './svelte.ts';
import type {Props, Manifest} from './types.ts';

export const title = 'David Bushell – Freelance Web Design (UK)';

export const version = '10.0.2';

export const generator = `deno ${Deno.version.deno} | svelte ${
  svelte.version
} | ${new Date().toLocaleString('en-GB')} | ${Deno.build.os}/${
  Deno.build.arch
}`;

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
  const manifest: Manifest = {
    meta: {
      title,
      version,
      generator
    },
    routes: {},
    latest: []
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

  return manifest;
};
