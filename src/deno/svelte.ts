import * as path from 'path';
import * as svelte from 'svelte/compiler';
import * as esbuild from 'esbuild';
import {denoPlugins} from 'esbuild_deno_loader';
import type {SSRComponent} from './types.ts';

export const {VERSION: version} = svelte;

const pwd = path.dirname(new URL(import.meta.url).pathname);

// TODO: fix with ReturnType<>?
const resolvers = Promise.withResolvers();
const renderMap = new Map<string, typeof resolvers>();

const ssrMap = new Map<string, SSRComponent>();

const svelteSSRPlugin: esbuild.Plugin = {
  name: 'svelte',
  setup(build) {
    build.onLoad({filter: /\.svelte$/}, async (args) => {
      let src = await Deno.readTextFile(args.path);
      src = svelte.compile(src, {generate: 'ssr'}).js.code;
      return {
        contents: src
      };
    });
  }
};

export const svelteDOMPlugin: esbuild.Plugin = {
  name: 'svelte',
  setup(build) {
    build.onLoad({filter: /\.svelte$/}, async (args) => {
      let src = await Deno.readTextFile(args.path);
      src = svelte.compile(src, {generate: 'dom'}).js.code;
      return {
        contents: src
      };
    });
  }
};

export const ssrComponent = async (
  container: string,
  options: esbuild.BuildOptions = {},
  bypassCache = false
) => {
  if (renderMap.has(container)) {
    await renderMap.get(container)!.promise;
  }
  if (!bypassCache && ssrMap.has(container)) {
    return ssrMap.get(container)!;
  }
  const deferred = Promise.withResolvers();
  renderMap.set(container, deferred);
  const dirPath = path.resolve(pwd, `../svelte/containers`);
  const result = await esbuild.build({
    ...options,
    entryPoints: [path.resolve(dirPath, `${container}.svelte`)],
    format: 'esm',
    target: 'esnext',
    bundle: true,
    minify: false,
    plugins: [svelteSSRPlugin],
    external: ['svelte', 'svelte/internal'],
    write: false
  });
  const blob = new Blob([result.outputFiles[0].text], {
    type: 'text/javascript'
  });
  const url = URL.createObjectURL(blob);
  const component = (await import(url)).default as SSRComponent;
  URL.revokeObjectURL(url);
  ssrMap.set(container, component);
  deferred.resolve(0);
  renderMap.delete(container);
  return component;
};

export const bundle = async (buildDir: string) => {
  console.log('✧ Bundling');
  const now = performance.now();
  try {
    // TODO: single pass / fix plugins working together?
    // Pass one (svelte)
    await esbuild.build({
      entryPoints: [path.resolve(pwd, `../svelte/app.js`)],
      outfile: path.join(buildDir, `assets/js/app.min.js`),
      external: ['svelte', 'svelte/internal'],
      plugins: [svelteDOMPlugin],
      format: 'esm',
      target: 'esnext',
      bundle: true,
      minify: false,
      allowOverwrite: true
    });
    // Pass two (bundle)
    await esbuild.build({
      entryPoints: [path.join(buildDir, `assets/js/app.min.js`)],
      outfile: path.join(buildDir, `assets/js/app.min.js`),
      plugins: [
        ...denoPlugins({
          configPath: path.resolve(pwd, `deno.json`)
        })
      ],
      format: 'esm',
      target: 'esnext',
      bundle: true,
      minify: true,
      allowOverwrite: true
    });
  } catch (err) {
    console.log(err);
  }
  console.log(`✹ Bundled in ${Math.round(performance.now() - now)}ms`);
};
