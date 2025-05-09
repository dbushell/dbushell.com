import { assert, assertEquals } from "jsr:@std/assert";
import {
  type Node as XMLNode,
  parse as parseXML,
} from "jsr:@dbushell/xml-streamify";

const url = new URL("http://localhost:7777");

Deno.test("blog rss", async (test) => {
  const response = await fetch(new URL("/rss.xml", url));
  await response.body?.cancel();

  await test.step("response", () => {
    assertEquals(response.status, 200);
  });

  await test.step("content type", () => {
    assert(
      (response.headers.get("content-type") ?? "").includes("application/xml"),
    );
  });
});

Deno.test("blog rss content", async () => {
  const response = await fetch(new URL("/rss.xml", url));
  let title: XMLNode | undefined;
  const items: Array<XMLNode> = [];
  for await (const node of parseXML(response.body!)) {
    if (node.is("rss", "channel", "title")) {
      title = node;
    }
    if (node.is("rss", "channel", "item")) {
      items.push(node);
    }
  }
  assertEquals(title?.innerText, "dbushell.com (blog)");
  assertEquals(items.length, 10);
});

Deno.test("notes rss", async (test) => {
  const response = await fetch(new URL("/notes/rss.xml", url));
  await response.body?.cancel();

  await test.step("response", () => {
    assertEquals(response.status, 200);
  });

  await test.step("content type", () => {
    assert(
      (response.headers.get("content-type") ?? "").includes("application/xml"),
    );
  });
});

Deno.test("notes rss content", async () => {
  const response = await fetch(new URL("/notes/rss.xml", url));
  let title: XMLNode | undefined;
  const items: Array<XMLNode> = [];
  for await (const node of parseXML(response.body!)) {
    if (node.is("rss", "channel", "title")) {
      title = node;
    }
    if (node.is("rss", "channel", "item")) {
      items.push(node);
    }
  }
  assertEquals(title?.innerText, "dbushell.com (notes)");
  assertEquals(items.length, 20);
});

Deno.test("merge rss", async (test) => {
  const response = await fetch(new URL("/merge/rss.xml", url));
  await response.body?.cancel();

  await test.step("response", () => {
    assertEquals(response.status, 200);
  });

  await test.step("content type", () => {
    assert(
      (response.headers.get("content-type") ?? "").includes("application/xml"),
    );
  });
});

Deno.test("merge rss content", async () => {
  const response = await fetch(new URL("/merge/rss.xml", url));
  let title: XMLNode | undefined;
  const items: Array<XMLNode> = [];
  for await (const node of parseXML(response.body!)) {
    if (node.is("rss", "channel", "title")) {
      title = node;
    }
    if (node.is("rss", "channel", "item")) {
      items.push(node);
    }
  }
  assertEquals(title?.innerText, "dbushell.com (all feeds)");
  assertEquals(items.length, 20);
});

Deno.test("sitemap", async () => {
  const response = await fetch(new URL("/sitemap.xml", url));
  let items = 0;
  let pages = 0;
  for await (const node of parseXML(response.body!)) {
    if (node.is("url", "loc")) {
      items++;
      if (/\/blog\/page\/\d+/.test(node.innerText)) {
        pages++;
      }
    }
  }
  assert(items > 450);
  assert(pages > 50);
});
