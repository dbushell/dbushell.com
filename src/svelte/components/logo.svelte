<script>
  import {onMount} from 'svelte';

  const {version} = globalThis.dbushell;
  const label = `Homepage`;
  let img;
  let svg;

  onMount(async () => {
    const response = await fetch(img.src);
    if (response.ok) {
      svg = await response.text();
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
      src="/assets/images/dbushell-logotype.svg?v={version}"
      alt="David Bushell"
    />
  {/if}
</a>
