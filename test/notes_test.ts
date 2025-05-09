import { assert, assertEquals } from "jsr:@std/assert";
import { Node, parseHTML } from "@dbushell/hyperless";

const url = new URL("http://localhost:7777");

Deno.test("notes", async (test) => {
  const response = await fetch(new URL("/notes/", url));
  const root = parseHTML(await response.text());
  await test.step("title", () => {
    assert(
      root.find((n) => n.tag === "title")?.at(0)?.toString().startsWith(
        "Notes –",
      ),
    );
  });
});

Deno.test("notes pages", async (test) => {
  const getItems = (root: Node): Array<Node> => {
    const items: Array<Node> = [];
    root.traverse((n) => {
      if (n.tag !== "article") return;
      if (n.attributes.get("class") !== "Note") return;
      items.push(n);
    });
    return items;
  };
  for (let i = 0; i < 4; i++) {
    await test.step(`page ${i + 1}`, async () => {
      const page = new URL("/notes/", url);
      if (i > 0) page.pathname += `page/${i + 1}/`;
      const response = await fetch(page);
      const root = parseHTML(await response.text());
      assertEquals(getItems(root).length, 20);
    });
  }
});
