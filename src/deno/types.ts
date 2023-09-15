export interface DateProps {
  unix: number;
  ISO: string;
  IMF: string;
  dddd: string;
  ddd: string;
  DD: string;
  D: number;
  MMMM: string;
  MMM: string;
  MM: string;
  M: number;
  YYYY: number;
}

export interface FrontProps {
  title: string;
  slug: string;
  date?: string;
  description?: string;
}

export interface Props {
  href: string;
  title: string;
  body: string;
  excerpt: string;
  container: string;
  changefreq: 'weekly' | 'monthly';
  priority: '1.0' | '0.9' | '0.8' | '0.7' | '0.6' | '0.5';
  date?: DateProps;
  description?: string;
  latest?: Props[];
  articles?: Props[];
  next?: string;
  prev?: string;
  src?: string;
}

export interface Manifest {
  meta: {
    title: string;
    version: string;
    generator: string;
  };
  latest: Props[];
  routes: {
    [key: string]: Props;
  };
}

// https://github.com/sveltejs/svelte/blob/master/packages/svelte/src/runtime/internal/ssr.js#L142C15-L142C258
export interface SSRComponent {
  render: (props?: Record<string, unknown>) => {
    html: string;
  };
}

export interface NetlifyTOMLHeaderValues {
  [key: string]: string;
}

export interface NetlifyTOMLHeader {
  for: string;
  values: NetlifyTOMLHeaderValues;
}

export interface NetlifyTOML {
  headers: NetlifyTOMLHeader[];
}
