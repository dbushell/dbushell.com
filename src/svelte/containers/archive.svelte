<script>
  import App from '../components/app.svelte';
  import Article from '../components/article.svelte';
  import Aside from '../components/aside.svelte';
  import Button from '../components/button.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';

  export let articles;
  export let latest;
  export let next;
  export let prev;
  export let title;
</script>

<App>
  <Masthead />
  <Main>
    <Nav current="/blog/" />
    <Heading {title} />
    {#each articles as item (item.date.unix)}
      <Article key={item.date.unix} {...item} />
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
            <span>Previous</span>
          </Button>
        {/if}
        {#if next}
          <Button href={next}>
            <span>Next</span>
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
  </Main>
  <Aside articles={latest} />
</App>
