<script>
  import Button from '@components/button.svelte';

  export let next;
  export let prev;
</script>

<div class="Pagination">
  {#if prev}
    <Button href={prev}>
      <svg viewBox="0 0 16 16">
        <path
          stroke-width="1.5"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
      <span>Newer</span>
    </Button>
  {/if}
  {#if next}
    <Button href={next}>
      <span>Older</span>
      <svg viewBox="0 0 16 16">
        <path
          stroke-width="1.5"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </Button>
  {/if}
</div>
