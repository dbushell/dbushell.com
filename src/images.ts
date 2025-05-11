import * as fs from "@std/fs";
import * as path from "@std/path";
import { manifest, rebuildManifest } from "./content/manifest.ts";
import { webkit } from "npm:playwright@1.50.0";

const ALL = Deno.args.includes("--all");
const OVERWRITE = Deno.args.includes("--overwrite");
const DAY = 1000 * 60 * 60 * 24 * 7 * 2;
const YEAR = 2020;
const WIDTH = 1200;
const HEIGHT = 630;

await rebuildManifest();

const imagePath = path.resolve(Deno.cwd(), "public/images/articles");
await fs.ensureDir(imagePath);

performance.mark("start");

const browser = await webkit.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: WIDTH, height: HEIGHT });

for (const [href, route] of Object.entries(manifest.routes)) {
  // Only articles beyond 2020
  if (route.date === undefined || route.container !== "article") continue;
  if (route.date.getFullYear() < YEAR) continue;

  // Get path and skip if exists
  const fileName = href.slice(1, -1).replaceAll("/", "-") + ".png";
  const filePath = path.join(imagePath, fileName);
  if (ALL === false && Date.now() - route.date.getTime() > DAY) {
    continue;
  }
  if (OVERWRITE === false && await fs.exists(filePath)) {
    continue;
  }

  // Generate screenshot
  const url = new URL("http://localhost:7777/api/image/");
  url.searchParams.append("title", route.title);

  await page.goto(url.href, {
    waitUntil: "load",
  });
  await page.screenshot({
    type: "png",
    path: filePath,
  });

  // Optimise PNG
  const command = new Deno.Command("oxipng", {
    args: ["-o", "2", "--strip", "safe", filePath],
  });
  const { stdout, stderr } = await command.output();
  const out = new TextDecoder().decode(stdout.length ? stdout : stderr);
  const match = out.match(/\d{2,}\.\d{2,}%/g);
  if (match) {
    console.log(`${match[0]}\t${href}`);
  } else {
    console.log(href);
  }
}

await browser.close();

performance.mark("end");
console.log(
  performance.measure("m", "start", "end").duration.toFixed(2) + "ms",
);

Deno.exit();
