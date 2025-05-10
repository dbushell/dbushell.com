import { decodeHex } from "@std/encoding";
import { Node, normalizeWords, stripTags } from "@dbushell/hyperless";
import { assert } from "../utils.ts";
import no_index from "../../data/no-index.json" with { type: "json" };

export type IndexWord = [string, number, [string, number][]];

export type IndexPage = [string, string, string];

export type IndexCount = {
  count: number;
  pages: Array<{
    hash: string;
    count: number;
  }>;
};

const encoder = new TextEncoder();

const enc = (str: string) => encoder.encode(str);

const word_index = new Map<string, IndexCount>();

export const clearIndex = () => {
  word_index.clear();
};

export const parseWords = (node: Node, hash: string) => {
  const remove: Node[] = [];
  node.traverse((n) => {
    if (["nav", "aside"].includes(n.tag)) {
      n.detach();
      remove.push(n);
      return false;
    }
  });
  remove.forEach((n) => n.detach());

  const words = normalizeWords(stripTags(node))
    .filter((w) => w.length > 2);

  // Count unique words
  const word_count = new Map<string, number>();
  for (const word of words) {
    if (no_index.includes(word)) continue;
    word_count.set(word, (word_count.get(word) ?? 0) + 1);
  }
  // Add to global tally
  for (const [word, count] of word_count.entries()) {
    if (!word_index.has(word)) {
      word_index.set(word, { count: 0, pages: [] });
    }
    const item = word_index.get(word)!;
    item.pages.push({ hash, count });
    item.count += 1;
  }
};

export const countToWord = (entry: [string, IndexCount]): IndexWord => {
  return [
    entry[0],
    entry[1].count,
    [
      ...entry[1].pages
        .toSorted((a, b) => b.count - a.count)
        .map((p) => [p.hash, p.count]) as [string, number][],
    ],
  ];
};

export const writeIndex = async (pages: IndexPage[]) => {
  const words: IndexWord[] = word_index
    .entries()
    .toArray()
    .toSorted((a, b) => b[1].count - a[1].count)
    .map(countToWord);

  Deno.writeTextFile("test.json", JSON.stringify(words, null, 2));

  using file = await Deno.open("data/index.json", {
    truncate: true,
    create: true,
    write: true,
  });

  const buffer = new Uint8Array(1024);
  let offset = 0;

  const flush = async () => {
    await file.write(buffer.subarray(0, offset));
    offset = 0;
  };

  const write = async (bytes: Uint8Array) => {
    if (offset + bytes.length > buffer.length) {
      await flush();
    }
    buffer.set(bytes, offset);
    offset += bytes.length;
  };

  const buf32 = new Uint8Array(4);
  const buf16 = new Uint8Array(2);
  const buf8 = new Uint8Array(1);
  const v32 = new DataView(buf32.buffer);
  const v16 = new DataView(buf16.buffer);
  const v8 = new DataView(buf8.buffer);

  v32.setUint32(0, words.length, true);
  await write(buf32);

  for (const [word, count, pages] of words) {
    assert(word.length < 256);
    assert(count < 65_536);
    // Write word length + word
    const word_buf = enc(word);
    v8.setUint8(0, word_buf.byteLength);
    await write(buf8);
    await write(word_buf);
    // Write page count
    v16.setUint16(0, count, true);
    await write(buf16);
    // Write pages
    for (const [p, c] of pages) {
      await write(decodeHex(p));
      assert(c < 256);
      v8.setUint8(0, c);
      await write(buf8);
    }
  }

  v32.setUint32(0, pages.length, true);
  await write(buf32);
  for (const [hash, href, title] of pages) {
    await write(decodeHex(hash));
    const href_buf = enc(href);
    v8.setUint8(0, href_buf.byteLength);
    await write(buf8);
    await write(href_buf);
    const title_buf = enc(title);
    v8.setUint8(0, title_buf.byteLength);
    await write(buf8);
    await write(title_buf);
  }

  await flush();
};
