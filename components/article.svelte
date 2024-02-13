<script>
  import Time from './time.svelte';

  export let date;
  export let excerpt;
  export let href;
  export let title;
</script>

<article class="Article">
  <h2 class="Star">
    <a {href}>{@html title}</a>
  </h2>
  {#if date}
    <Time {date} />
  {/if}
  {#if excerpt}
    <p>{@html excerpt}</p>
  {/if}
</article>
