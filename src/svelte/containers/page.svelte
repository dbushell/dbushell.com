<script>
  import App from '../components/app.svelte';
  import Aside from '../components/aside.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';
  import Prose from '../components/prose.svelte';
  import Kofi from '../components/kofi.svelte';
  import CTA from '../components/cta.svelte';

  export let body;
  export let href;
  export let latest;
  export let title;
  export let features;
</script>

<App>
  <Masthead />
  <Main>
    <Nav current={href} />
    <Heading {title} />
    <Prose innerHTML={body} />
    {#if features?.includes('cta')}
      <CTA />
    {/if}
    {#if features?.includes('kofi')}
      <Kofi />
    {/if}
  </Main>
  <Aside articles={latest} />
</App>
