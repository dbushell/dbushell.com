<script context="module">
  export const pattern = '/:slug([a-zA-Z0-9-]+)/';

  const ignore = ['blog', 'contact'];

  export const load = async ({params, fetch, serverData}) => {
    const noMatch = new Response(null, {status: 404});
    if (ignore.includes(params.slug)) {
      return noMatch;
    }
    const data = await fetch(`/api/page/${params.slug}/`, {
      headers: {
        authorization: `Bearer ${Deno.env.get('SSR_API_KEY')}`
      }
    });
    if (!data.ok) {
      return noMatch;
    }
    serverData.props = await data.json();
  };
</script>

<script>
  import {getContext} from 'svelte';
  import App from '@components/app.svelte';
  import CTA from '@components/cta.svelte';
  import Heading from '@components/heading.svelte';
  import Kofi from '@components/kofi.svelte';
  import Nav from '@components/nav.svelte';
  import Prose from '@components/prose.svelte';

  const {props} = getContext('serverData');
  const {body, href, title, features} = props;
</script>

<App>
  <svelte:fragment slot="main">
    <Nav current={href} />
    <Heading {title} />
    <Prose innerHTML={body} />
    {#if features?.includes('cta')}
      <CTA />
    {/if}
    {#if features?.includes('kofi')}
      <Kofi />
    {/if}
  </svelte:fragment>
</App>
