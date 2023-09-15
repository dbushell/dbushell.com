<script>
  export let title;
  const innerHTML = title.replace(/(-)/g, `<span class="Hyphen">$1</span>`);
</script>

<h1 class="Comic">
  {@html innerHTML}
</h1>
