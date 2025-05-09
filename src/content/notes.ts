import * as fs from "@std/fs";
import { TextLineStream } from "@std/streams";
import { hmmarkdown } from "./markdown.ts";
import type { NoteProps } from "./types.ts";

export const notes: NoteProps[] = [];

export const rebuildNotes = async (
  dir: string,
): Promise<NoteProps[]> => {
  notes.length = 0;
  for await (
    const entry of fs.walk(dir, {
      match: [/\/\d{4}\.md$/],
    })
  ) {
    const file = await Deno.open(entry.path);
    const data: Array<Array<string>> = [];
    const stream = file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    for await (const line of stream) {
      if (line.length === 17 && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(line)) {
        data.push([line]);
      } else if (data.length) {
        data?.at(-1)?.push(line);
      }
    }
    const promises = [];
    for (const [dateStr, ...lines] of data) {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) continue;
      promises.push(
        hmmarkdown(lines.join("\n")).then((body) => {
          // Escape Hypermore props
          body = body.replace(/{{([^{].*?)}}/gs, (...m) => `{{!${m[1]}}}`);
          notes.push({
            date,
            body,
            href: `/notes/${date.toISOString().slice(0, 16)}Z/`,
          });
        }),
      );
    }
    await Promise.all(promises);
  }
  notes.sort((a, b) => b.date.getTime() - a.date.getTime());
  return notes;
};
