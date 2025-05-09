import { assertEquals } from "jsr:@std/assert";
import { Node, parseHTML } from "@dbushell/hyperless";

const url = new URL("http://localhost:7777");

Deno.test("homepage", async (test) => {
  const response = await fetch(new URL("/", url));
  const root = parseHTML(await response.text());

  await test.step("title", () => {
    assertEquals(
      root.find((n) => n.tag === "title")?.at(0)?.toString(),
      "David Bushell – Freelance Web Design &amp; Front-end Development (UK)",
    );
  });

  await test.step("<meta>", () => {
    assertEquals(
      root.find((n) =>
        n.tag === "meta" && n.attributes.get("name") === "description"
      )?.attributes.get("content"),
      "David Bushell – Freelance Web Design & Front-end Development (UK)",
    );
  });

  await test.step("latest articles", () => {
    const latest: Array<Node> = [];
    root.traverse((n) => {
      if (n.tag !== "li") return;
      if (n.parent?.attributes.get("class") !== "List") return;
      latest.push(n);
    });
    assertEquals(latest.length, 10);
  });
});
