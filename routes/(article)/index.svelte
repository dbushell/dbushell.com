<script context="module">
  export const pattern = '/:year(\\d+)/:month(\\d+)/:day(\\d+)/:slug/';

  export const load = async ({fetch, params, serverData}) => {
    const data = await fetch(
      `/api/article/${params.year}/${params.month}/${params.day}/${params.slug}/`,
      {
        headers: {
          authorization: `Bearer ${Deno.env.get('SSR_API_KEY')}`
        }
      }
    );
    if (!data.ok) {
      return new Response(null, {status: 404});
    }
    serverData.props = await data.json();
  };
</script>

<script>
  import {getContext} from 'svelte';
  import App from '@components/app.svelte';
  import Heading from '@components/heading.svelte';
  import Kofi from '@components/kofi.svelte';
  import Nav from '@components/nav.svelte';
  import Prose from '@components/prose.svelte';
  import Time from '@components/time.svelte';

  const {props} = getContext('serverData');
  const {body, title, date} = props;
</script>

<App>
  <svelte:fragment slot="main">
    <Nav />
    <Heading {title} />
    {#if date}
      <Time {date} />
    {/if}
    <Prose innerHTML={body} />
    <Kofi />
  </svelte:fragment>
</App>
