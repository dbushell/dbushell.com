<script>
  export let heading = 'h3';
  export let href;
  export let subtitle;
  export let title;
</script>

<article class="Card">
  <svelte:element this={heading}>
    <span class="Star">
      {#if href}<a {href}>{title}</a>{:else}{title}{/if}
    </span>
    {#if subtitle}<span class="Cursive">{subtitle}</span>{/if}
  </svelte:element>
  <div>
    <slot />
  </div>
</article>
