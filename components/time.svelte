<script>
  import {dateParts} from '@src/shared.ts';

  export let date;
  export let time = false;
  export let href = undefined;

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const {ISO, HH, mm, dddd, dd, D, MMMM, MMM, YYYY} = dateParts(date);
</script>

<time class="Time" datetime={ISO} title={ISO}>
  <a {href} tabindex={href ? -1 : undefined}>
    {#if time}
      {HH}:{mm} <abbr title={dddd}>{dd}</abbr>
    {:else}
      {dddd}
    {/if}
    {D} <abbr title={MMMM}>{MMM}</abbr>
    {YYYY}
  </a>
</time>
