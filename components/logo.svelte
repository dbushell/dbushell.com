<script context="module">
  export const island = true;
</script>

<script>
  import {getContext, onMount} from 'svelte';

  const label = `Homepage`;
  let img;
  let svg;

  const {deployHash} = getContext('publicData');

  onMount(async () => {
    const response = await fetch(img.src);
    if (response.ok) {
      svg = await response.text();
    }

    // Handle service worker
    if ('serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.register('/sw.js');
    }

    // Handle dark mode
    const $doc = document.querySelector('.Document');
    const $mode = document.querySelector('.Lightbulb');
    $mode.addEventListener('click', () => {
      const list = $doc.classList;
      if (list.contains('Lightmode')) {
        list.remove('Lightmode');
        list.add('Darkmode');
        localStorage.setItem('darkmode', 'on');
      } else {
        list.remove('Darkmode');
        list.add('Lightmode');
        localStorage.setItem('darkmode', 'off');
      }
    });

    // Handle syntax highlighting
    if (document.querySelector('pre')) {
      const $prism = document.createElement('link');
      $prism.rel = 'stylesheet';
      $prism.href = `/assets/css/prism.css?v=${deployHash}`;
      document.head.appendChild($prism);
    }

    // Handle monospace font
    if (document.querySelector('code')) {
      var fira = new FontFace(
        'Fira Code Light',
        "url('/assets/fonts/fira-code-light.woff2') format('woff2')",
        {weight: '300', unicodeRange: 'U+0020-007F'}
      );
      Promise.all([fira.load()]).then((fonts) => {
        fonts.forEach((font) => {
          document.fonts.add(font);
        });
      });
    }
  });
</script>

<a href="/" class="Logo">
  <span class="Hidden">{label}</span>
  {#if svg}
    {@html svg}
  {:else}
    <img
      bind:this={img}
      src="/assets/images/dbushell-logotype.svg?v={deployHash}"
      alt="David Bushell"
    />
  {/if}
</a>
