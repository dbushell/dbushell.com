<script>
  import {onMount} from 'svelte';

  const {version} = globalThis.dbushell;
  const label = `Homepage`;
  let img;
  let svg;

  onMount(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', img.src, true);
    xhr.send();
    xhr.addEventListener('loadend', (response) => {
      if (response.target.status === 200) {
        svg = response.target.responseText;
      }
    });
  });
</script>

<a href="/" class="Logo">
  <span class="Hidden">{label}</span>
  {#if svg}
    {@html svg}
  {:else}
    <img
      bind:this={img}
      src="/assets/images/dbushell-logotype.svg?v={version}"
      alt="David Bushell"
    />
  {/if}
</a>
