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
    // Update SVG logo
    fetch(img.src).then(async (response) => {
      if (response.ok) {
        svg = await response.text();
      }
    });

    // Handle service worker
    if ('serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.register(`/sw.js?v=${deployHash}`);
    }

    // Handle dark mode
    const $doc = document.querySelector('.Document');
    const $mode = document.querySelector('.Lightbulb');
    const list = $doc.classList;
    if (localStorage.getItem('darkmode') === 'on') {
      list.remove('Lightmode');
      list.add('Darkmode');
    }
    $mode.addEventListener('click', () => {
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

    // Handle monospace font
    if (document.querySelector('code')) {
      var fira = new FontFace(
        'Fira Code Light',
        `url('/assets/fonts/fira-code-light.woff2?v=${deployHash}') format('woff2')`,
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
