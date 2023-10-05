import * as fs from 'fs';
import * as path from 'path';
import * as front_matter from 'front_matter';
import striptags from 'striptags';
import markdown from './markdown.ts';
import type {FrontProps, Props} from './types.ts';

const pwd = path.dirname(new URL(import.meta.url).pathname);

// Generate excerpt from body
export const excerptProp = (body: string): string => {
  let excerpt = body.replace(/<pre[^>]*>.+?<\/pre>/gs, '');
  excerpt = excerpt.replace(/<picture[^>]*>.+?<\/picture>/gs, '');
  excerpt = excerpt.replace(/<figure[^>]*>.+?<\/figure>/gs, '');
  excerpt = striptags(excerpt);
  const words = excerpt.split(' ');
  if (words.length >= 55) {
    excerpt = `${words.slice(0, 55).join(' ')} […]`;
  }
  excerpt = excerpt.trim();
  return excerpt;
};

export const readProps = async (srcPath: string): Promise<Props> => {
  // Parse front matter
  const matter = front_matter.extract<FrontProps>(
    await Deno.readTextFile(srcPath)
  );
  const props: Props = {
    href: `/${matter.attrs.slug}/`,
    title: matter.attrs.title,
    body: matter.body,
    excerpt: '',
    container: 'page',
    changefreq: 'monthly',
    priority: '0.8',
    src: srcPath
  };
  if (/\/showcase\//.test(props.href)) {
    props.priority = '0.7';
  }

  // Pass title and description through Marked for smartypants
  props.title = markdown(props.title);
  props.title = striptags(props.title).trim();

  if (matter.attrs.description) {
    props.description = markdown(matter.attrs.description);
    props.description = striptags(props.description).trim();
  }

  // Pass body through Marked for full HTML
  props.body = markdown(props.body);
  props.excerpt = excerptProp(props.body);

  // Blog date and slug
  if (matter.attrs.date) {
    props.container = 'article';
    props.priority = '0.6';
    props.date = new Date(matter.attrs.date);
    props.href =
      '/' +
      [
        props.date.getFullYear(),
        `${props.date.getMonth() + 1}`.padStart(2, '0'),
        `${props.date.getDate()}`.padStart(2, '0'),
        matter.attrs.slug
      ].join('/') +
      '/';
  }
  return props;
};

export const readGlob = async (glob: string): Promise<Props[]> => {
  const arr: Props[] = [];
  const promises = [];
  for await (const entry of fs.expandGlob(glob)) {
    if (!entry.isFile || !/.md$/.test(entry.name)) {
      continue;
    }
    promises.push(
      readProps(entry.path).then((props) => {
        if (props) arr.push(props);
      })
    );
  }
  await Promise.all(promises);
  return arr;
};

export const readArticles = async (): Promise<Props[]> => {
  console.log('✧ Reading articles');
  const arr = await readGlob(`${pwd}/../data/blog/**/*.md`);
  arr.sort((a, b) =>
    (a.date?.valueOf() ?? 0) < (b.date?.valueOf() ?? 0) ? 1 : -1
  );
  console.log(`✦ Read ${arr.length} articles`);
  return arr;
};

export const readPages = async (): Promise<Props[]> => {
  console.log('✧ Reading pages');
  const [a, b] = await Promise.all([
    readGlob(`${pwd}/../data/pages/*.md`),
    readGlob(`${pwd}/../data/portfolio/*.md`)
  ]);
  const arr = [...a, ...b];
  console.log(`✦ Read ${arr.length} pages`);
  return arr;
};
