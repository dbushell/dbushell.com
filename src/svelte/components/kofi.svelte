<script>
  export let heading = 'Support my work!';
  export let intro =
    'Enjoying this blog? Please consider a small tip to say thanks.';
  export let outro = 'A $5 coffee would taste wonderful!';
</script>

<aside class="Box | Kofi">
  <h2 class="Cursive">{heading}</h2>
  <a
    href="/tip/"
    rel="me noopener noreferrer"
    target="_blank"
  >
    <span class="Hidden">Tip me on Ko-fi</span>
    <img
      alt=""
      loading="lazy"
      src="/images/blog/2024/kofi_button.png"
      width="204"
      height="32"
    />
  </a>
  <p>{intro}</p>
  <p>
    <img
      alt=""
      src="/images/blog/2024/kofi_logo.png"
      width="152"
      height="100"
    /><em>{outro}</em>
  </p>
  <p><a href="/2024/01/16/buy-me-a-coffee/"><i>about tips</i></a></p>
</aside>
