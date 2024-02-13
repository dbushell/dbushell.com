<script>
  export let date;

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const ISO = date.toISOString();
  const D = date.getDate();
  const dddd = date.toLocaleString('en-GB', {weekday: 'long'});
  const MMMM = date.toLocaleString('en-GB', {month: 'long'});
  const MMM = date.toLocaleString('en-GB', {month: 'short'});
  const YYYY = date.getFullYear();
</script>

<p>
  <time class="Time" datetime={ISO} title={ISO}>
    {dddd}
    {D} <abbr title={MMMM}>{MMM}</abbr>
    {YYYY}
  </time>
</p>
