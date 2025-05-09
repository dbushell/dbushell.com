/// <reference lib="webworker" />

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Decode WASM memory UTF-8
 * @param {number} ptr byte offset
 * @param {number} len byte length
 * @returns {string}
 */
const decode = (ptr, len) => {
  return decoder.decode(
    memory.buffer.slice(ptr, ptr + len),
  );
};

/** @type {WebAssembly.Memory} */
const memory = new WebAssembly.Memory({
  initial: (10 * 1024 * 1024) / (64 * 1024),
  maximum: (50 * 1024 * 1024) / (64 * 1024),
});

/** @type {WebAssembly.Imports} */
const imports = {
  env: {
    memory: memory,
    /**
     * Log string from WASM memory buffer
     * @param {number} ptr
     * @param {number} len
     */
    console: (ptr, len) => {
      const message = decode(ptr, len);
      if (message.startsWith("Error:")) {
        console.error(message);
        return;
      }
      console.debug(message);
    },
    /**
     * Calculate the blog post age in days
     * @param {number} ptr
     * @param {number} len
     */
    getAge: (ptr, len) => {
      const day = 24 * 60 * 60 * 1000;
      const href = decode(ptr, ptr + len);
      const date = new Date(href.split("/").slice(1, 4).join("-"));
      const diff = Math.round(
        Math.abs((Date.now() - date.getTime()) / day),
      );
      return Math.floor(diff);
    },
    /**
     * Post search results to the main thread
     * @param {number} ptr
     * @param {number} len
     */
    setSearch: (ptr, len) => {
      const data = new Uint8Array(
        memory.buffer.slice(ptr, ptr + len),
      );
      try {
        self.postMessage({
          type: "results",
          buffer: data.buffer,
        }, [data.buffer]);
        performance.mark("end");
        const { duration } = performance.measure("m", "start", "end");
        console.debug(`Duration: ${duration.toFixed(2)}ms`);
      } catch (err) {
        console.error(err);
      }
    },
  },
};

const wasm = await WebAssembly.instantiateStreaming(
  fetch("/assets/wasm/search.wasm"),
  imports,
);

/** @type {WebAssembly.Exports} */
const exports = wasm.instance.exports;
exports.init();

self.postMessage({ type: "ready" });

/**
 * Search index
 * @param {string[]} words
 */
const search = (words) => {
  if (
    Array.isArray(words) === false ||
    words.length === 0
  ) {
    return;
  }
  const scratch = new Uint8Array(
    memory.buffer,
    exports.getScratch(),
    128,
  );
  const query = words.join(",");
  scratch.set([...encoder.encode(query), 0], 0);
  performance.mark("start");
  exports.getSearch(query.length);
};

// Handle messages from main thead
self.addEventListener("message", (ev) => {
  if (ev.data.type === "search") {
    search(ev.data.words);
  }
});
