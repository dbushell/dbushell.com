<script>
  export let dddd;
  export let D;
  export let ISO;
  export let MMMM;
  export let MMM;
  export let YYYY;
</script>

<p>
  <time class="Time" datetime={ISO} title={ISO}
    >{dddd} {D} <abbr title={MMMM}>{MMM}</abbr> {YYYY}</time
  >
</p>
