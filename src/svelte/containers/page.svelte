<script>
  import App from '../components/app.svelte';
  import Aside from '../components/aside.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';
  import Prose from '../components/prose.svelte';

  export let body;
  export let href;
  export let latest;
  export let title;
</script>

<App>
  <Masthead />
  <Main>
    <Nav current={href} />
    <Heading {title} />
    <Prose innerHTML={body} />
  </Main>
  <Aside articles={latest} />
</App>
