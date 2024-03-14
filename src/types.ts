export interface FrontProps {
  title: string;
  slug: string;
  date?: string;
  description?: string;
  features?: string[];
}

export interface Props {
  href: string;
  title: string;
  body: string;
  excerpt: string;
  container: string;
  changefreq: 'weekly' | 'monthly';
  priority: '1.0' | '0.9' | '0.8' | '0.7' | '0.6' | '0.5';
  features?: string[];
  date?: Date;
  description?: string;
  latest?: Props[];
  articles?: Props[];
  next?: string;
  prev?: string;
  src?: string;
}

export interface Manifest {
  latest: Props[];
  routes: {
    [key: string]: Props;
  };
  styles: Array<{css: string; hash: string}>;
}
