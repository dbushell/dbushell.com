<script>
  import {getContext} from 'svelte';

  const {deployHash} = getContext('publicData');

  const label = `Homepage`;
  const alt = 'David Bushell';
</script>

<a href="/" class="Logo">
  <span class="Hidden">{label}</span>
  <img {alt} src="/assets/images/dbushell-logotype.svg?v={deployHash}" />
</a>
