<script context="module">
  export const pattern = '/:slug(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}Z)/';

  export const load = async ({fetch, params, serverData}) => {
    const data = await fetch(`/api/note/${params.slug}/`, {
      headers: {
        authorization: `Bearer ${Deno.env.get('SSR_API_KEY')}`
      }
    });
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
  import Nav from '@components/nav.svelte';
  import Note from '@components/note.svelte';
  import RssNotes from '@components/rss-notes.svelte';

  const {props} = getContext('serverData');
  const {href, date, body, title} = props;
</script>

<App>
  <svelte:fragment slot="main">
    <Nav current="/notes/" />
    <Heading title="Notes" />
    <RssNotes />
    <Note {href} {date} {body} />
  </svelte:fragment>
</App>
