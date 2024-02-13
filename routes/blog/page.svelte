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
  import Button from '@components/button.svelte';
  import Heading from '@components/heading.svelte';
  import Kofi from '@components/kofi.svelte';
  import Nav from '@components/nav.svelte';

  const {props} = getContext('serverData');
  const {articles, next, prev, title} = props;
</script>

<App>
  <svelte:fragment slot="main">
    <Nav current="/blog/" />
    <Heading {title} />
    {#each articles as item (item.href)}
      <Article {...item} />
    {/each}
    {#if next || prev}
      <div class="Pagination">
        {#if prev}
          <Button href={prev}>
            <svg viewBox="0 0 16 16">
              <path
                stroke-width="1.5"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
            <span>Newer</span>
          </Button>
        {/if}
        {#if next}
          <Button href={next}>
            <span>Older</span>
            <svg viewBox="0 0 16 16">
              <path
                stroke-width="1.5"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </Button>
        {/if}
      </div>
    {/if}
    <Kofi />
  </svelte:fragment>
</App>
