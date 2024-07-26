<script context="module">
  export const pattern = '/:page(\\d+)/';

  export const load = async ({params, fetch, serverData}) => {
    const {page} = params;
    const data = await fetch(`/api/blog/${page}/`, {
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
  import Article from '@components/article.svelte';
  import Heading from '@components/heading.svelte';
  import Nav from '@components/nav.svelte';
  import Pagination from '@components/pagination.svelte';
  import RssBlog from '@components/rss-blog.svelte';

  const {props} = getContext('serverData');
  const {articles, next, prev, title} = props;
</script>

<App>
  <svelte:fragment slot="main">
    <Nav current="/blog/" />
    <Heading {title} />
    <RssBlog />
    {#each articles as item (item.href)}
      <Article {...item} />
    {/each}
    {#if next || prev}
      <Pagination {next} {prev} />
    {/if}
  </svelte:fragment>
</App>
