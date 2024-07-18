<script>
  import Time from './time.svelte';

  export let href;
  export let date;
  export let body;
</script>

<article class="Note">
  {@html body}
  {#if date}
    <footer>
      <Time {href} {date} time={true} />
    </footer>
  {/if}
</article>
