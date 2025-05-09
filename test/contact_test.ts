import { assert } from "jsr:@std/assert";
import { parseHTML } from "@dbushell/hyperless";

const url = new URL("http://localhost:7777");

Deno.test("contact", async (test) => {
  const response = await fetch(new URL("/contact/", url));
  const root = parseHTML(await response.text());

  await test.step("title", () => {
    assert(
      root.find((n) => n.tag === "title")?.at(0)?.toString().startsWith(
        "Contact –",
      ),
    );
  });

  await test.step("contact.js", () => {
    assert(
      root.find((n) =>
        n.tag === "link" && n.attributes.get("rel") === "preload" &&
        (n.attributes.get("href") ?? "").includes("/contact-form.js")
      ) !== null,
    );
  });
});
