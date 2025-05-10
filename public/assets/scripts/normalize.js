/**
 * From @dbushell/hyperless
 * https://github.com/dbushell/hyperspace/blob/main/hyperless/src/normalize.ts
 */
const blanks = new RegExp(
  "[" + ("’'"
    .split("")
    .map((c) => `\\u{${c.charCodeAt(0).toString(16)}}`)
    .join("")) +
    "]",
  "gu",
);

const spaces = new RegExp(
  "[" + ('-–—_“”"!?¿¡…,.'
    .split("")
    .map((c) => `\\u{${c.charCodeAt(0).toString(16)}}`)
    .join("")) +
    "]",
  "gu",
);

const ligatureMap = new Map([
  ["ꜳ", "aa"],
  ["æ", "ae"],
  ["ǽ", "ae"],
  ["ꜵ", "ao"],
  ["ꜷ", "au"],
  ["ꜹ", "av"],
  ["ꜻ", "av"],
  ["ꜽ", "ay"],
  ["ȸ", "db"],
  ["ǳ", "dz"],
  ["ǆ", "dz"],
  ["ﬀ", "ff"],
  ["ﬃ", "ffi"],
  ["ﬄ", "ffl"],
  ["ﬁ", "fi"],
  ["ﬂ", "fl"],
  ["ƕ", "hv"],
  ["ĳ", "ij"],
  ["ǉ", "lj"],
  ["ʪ", "ls"],
  ["ʫ", "lz"],
  ["ǌ", "nj"],
  ["œ", "oe"],
  ["ꝏ", "oo"],
  ["ﬆ", "st"],
  ["ﬅ", "st"],
  ["ꜩ", "tz"],
  ["ꝡ", "vy"],
  ["ẞ", "ss"],
  ["ß", "ss"],
]);

const ligatures = new RegExp([...ligatureMap.keys()].join("|"), "g");

export const normalizeWords = (input, unique = false) => {
  const words = input
    .toLowerCase()
    .replaceAll(blanks, "")
    .replaceAll(spaces, " ")
    .replace(ligatures, (m) => ligatureMap.get(m) ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .split(/\b/)
    .map((w) => w.trim())
    .filter((w) => /\w+/.test(w));
  if (unique) {
    return [...new Set(words)];
  }
  return words;
};
