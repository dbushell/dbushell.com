<script>
  import App from '../components/app.svelte';
  import Aside from '../components/aside.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';
  import Prose from '../components/prose.svelte';
  import Time from '../components/time.svelte';

  export let body;
  export let date;
  export let latest;
  export let title;
</script>

<App>
  <Masthead />
  <Main>
    <Nav />
    <Heading {title} />
    {#if date}
      <Time {...date} />
    {/if}
    <Prose innerHTML={body} />
  </Main>
  <Aside articles={latest} />
</App>
