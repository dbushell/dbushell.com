<script>
  export let href;
  export let subtitle;
  export let title;
</script>

<article class="Card">
  <h3>
    <span class="Star">
      {#if href}<a {href}>{title}</a>{:else}{title}{/if}
    </span>
    {#if subtitle}<span class="Cursive">{subtitle}</span>{/if}
  </h3>
  <div>
    <slot />
  </div>
</article>
