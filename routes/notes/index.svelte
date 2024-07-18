<script context="module">
  export const pattern = '/';

  export const load = async ({fetch, serverData}) => {
    const data = await fetch('/api/notes/1/', {
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
  import Pagination from '@components/pagination.svelte';

  const {props} = getContext('serverData');
  const {notes, next, prev, title} = props;
</script>

<App>
  <svelte:fragment slot="main">
    <Nav current="/notes/" />
    <Heading {title} />
    <div class="Box">
      <p>
        Subscribe to my <a href="/notes/rss.xml" target="_blank">microblog RSS feed</a> and
        <a href="/mastodon/" target="_blank">follow on Mastodon</a>.
      </p>
    </div>
    {#each notes as item (item.date)}
      <Note {...item} />
    {/each}
    {#if next || prev}
      <Pagination {next} {prev} />
    {/if}
  </svelte:fragment>
</App>
