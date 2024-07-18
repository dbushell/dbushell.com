<script>
  export let title;
  export let balance = true;
  const innerHTML = title.replaceAll('-', '<span class="Hyphen">-</span>');
  let className = 'Comic';
  if (balance) {
    className = `${className} Balance`;
  }
</script>

<h1 class={className}>
  {@html innerHTML}
</h1>
