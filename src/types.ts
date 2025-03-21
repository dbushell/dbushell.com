import type { Hyperserve } from "@dbushell/hyperserve";

export type Handle = Parameters<Hyperserve["router"]["use"]>[0];

export interface NoteProps {
  href: string;
  body: string;
  date: Date;
}

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
  changefreq: "daily" | "weekly" | "monthly";
  priority: "1.0" | "0.9" | "0.8" | "0.7" | "0.6" | "0.5";
  hash?: string;
  features?: string[];
  date?: Date;
  description?: string;
  latest?: Props[];
  articles?: Props[];
  notes?: NoteProps[];
  next?: string;
  prev?: string;
  src?: string;
}

export interface Manifest {
  latest: Props[];
  notes: NoteProps[];
  routes: {
    [key: string]: Props;
  };
  styles: Array<{ css: string; hash: string }>;
}

export type GlobalProps = {
  deployHash: string;
  pageHeaders: Array<[string, string]>;
  props: Props;
  styles: Array<{ css: string; hash: string }>;
};
