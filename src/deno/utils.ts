import * as datetime from 'datetime';
import striptags from 'striptags';
import type {DateProps} from './types.ts';

// Generate excerpt from body
export const excerptProps = (body: string): string => {
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
}

const dateProps = (date = new Date()): DateProps => ({
  unix: date.valueOf(),
  // YYYY-MM-DDTHH:mm:ss.sssZ
  ISO: date.toISOString(),
  // ddd, DD MMM YYYY HH:mm:ss ZZ
  IMF: datetime.toIMF(date),
  // Sunday ... Saturday
  dddd: date.toLocaleString('en-GB', {weekday: 'long'}),
  // Sun ... Sat
  ddd: date.toLocaleString('en-GB', {weekday: 'short'}),
  // 01 ... 31
  DD: `${date.getDate()}`.padStart(2, '0'),
  // 1 ... 31
  D: date.getDate(),
  // January ... December
  MMMM: date.toLocaleString('en-GB', {month: 'long'}),
  // Jan ... Dec
  MMM: date.toLocaleString('en-GB', {month: 'short'}),
  // 01 ... 12
  MM: `${date.getMonth() + 1}`.padStart(2, '0'),
  // 1 ... 12
  M: date.getMonth() + 1,
  // 2021
  YYYY: date.getFullYear()
});

export {dateProps};
