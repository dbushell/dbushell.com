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

const inlineTags = [
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'ins',
  'kbd',
  'mark',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr'
];

// Bespoke list of "contentless" elements to remove
const removeTags = [
  'audio',
  'canvas',
  'figure',
  'form',
  'iframe',
  'picture',
  'pre',
  'script',
  'style',
  'table',
  'video'
];

// Remove HTML and return text content
export const striptags = (html: string) => {
  // Find open and close tags
  let match: RegExpMatchArray | null;
  while ((match = html.match(/(<([\w-]+)[^>]*?>)(.+?)(<\/\2>)/s))) {
    let {0: search, 2: tag, 3: text} = match;
    // Remove entire contents
    if (removeTags.includes(tag)) {
      html = replace(html, search, '');
      continue;
    }
    // Remove tags and keep content
    const inline = inlineTags.includes(tag);
    // Wrap quotes
    if (['blockquote', 'q'].includes(tag)) {
      text = `“${striptags(text).trim()}”`;
    }
    html = replace(html, search, text + (inline ? '' : ' '));
  }
  // Remove comments, self-closing, and void tags
  while ((match = html.match(/(<!--[\s\S]*?-->|<\/?([\w-]+)[^>]*?>)/))) {
    html = replace(html, match[0], '');
  }
  return html;
};

// Generate excerpt from body
export const excerpt = (body: string): string => {
  let excerpt = striptags(body);
  const words = excerpt.split(' ');
  if (words.length >= 55) {
    excerpt = `${words.slice(0, 55).join(' ')} […]`;
  }
  excerpt = excerpt.trim();
  return excerpt;
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
