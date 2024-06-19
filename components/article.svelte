<script>
  import Time from './time.svelte';

  export let heading = 'h2';
  export let date;
  export let excerpt;
  export let href;
  export let title;
</script>

<article class="Article">
  <svelte:element this={heading} class="Star">
    <a {href}>{@html title}</a>
  </svelte:element>
  {#if date}
    <Time {date} />
  {/if}
  {#if excerpt}
    <p>{@html excerpt}</p>
  {/if}
</article>
