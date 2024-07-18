import type {ServerData} from '@src/types.ts';

export const appendHeaders = (response: Response, headers: ServerData['pageHeaders']) => {
  try {
    headers.forEach(([name, value]) => {
      response.headers.append(name, value);
    });
  } catch {
    // Ignore immutable headers
  }
  return response;
};

export const authorized = (request: Request) => {
  if (
    request.method === 'GET' &&
    request.headers.get('authorization') === `Bearer ${Deno.env.get('SSR_API_KEY')}`
  ) {
    return true;
  }
};

export const redirect = (location: string | URL, status = 302) => {
  location = location instanceof URL ? location.href : location;
  return new Response(null, {
    status,
    headers: {
      location
    }
  });
};

export const replace = (subject: string, search: string, replace = '', all = false) => {
  let parts = subject.split(search);
  if (parts.length === 1) return subject;
  if (!all) parts = [parts.shift()!, parts.join(search)];
  return parts.join(replace);
};

// Complete list of self-closing void tags to remove
const voidTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

// Bespoke list of "contentless" elements to remove
const emptyTags = [
  'audio',
  'blockquote',
  'canvas',
  'figure',
  'iframe',
  'picture',
  'pre',
  'script',
  'table',
  'video'
];

export const striptags = (html: string) => {
  const voidRegex = new RegExp(`(<(?:${voidTags.join('|')})[^>]*?>)`, 'gs');
  const voidMatch = voidRegex.exec(html);
  if (voidMatch) {
    html = replace(html, voidMatch[1], '', true);
    html = striptags(html);
  }
  const regex = /<([\w-]+)[^>]*?>(.*?)<\/\1>/gs;
  const match = regex.exec(html);
  if (match) {
    let replacement = match[2];
    if (match[1] === 'q') {
      replacement = `“${replacement}”`;
    }
    if (emptyTags.includes(match[1])) {
      replacement = '';
    }
    html = replace(html, match[0], replacement, true);
    html = striptags(html);
  }
  return html;
};

export const dateParts = (date: Date): Record<string, string> => {
  const ISO = date.toISOString();
  const D = date.getDate().toString();
  const dddd = date.toLocaleString('en-GB', {weekday: 'long'});
  const dd = date.toLocaleString('en-GB', {weekday: 'short'});
  const MMMM = date.toLocaleString('en-GB', {month: 'long'});
  const MMM = date.toLocaleString('en-GB', {month: 'short'});
  const YYYY = date.getFullYear().toString();
  const HH = date.getUTCHours().toString().padStart(2, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  return {ISO, D, dddd, dd, MMMM, MMM, YYYY, HH, mm};
};
