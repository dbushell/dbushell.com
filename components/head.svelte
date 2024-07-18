<script>
  import {getContext} from 'svelte';

  const publicData = getContext('publicData');
  let {title, href, description} = getContext('serverData')?.props ?? {};

  href = href ?? '/';
  let pageTitle = publicData.title;
  let pageDescription = description ?? publicData.title;
  if (title) {
    pageTitle = `${title} – ${pageTitle}`;
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <link rel="canonical" href="https://dbushell.com{href}" />
  <meta name="author" content="David Bushell" />
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={title ?? publicData.title} />
  <meta property="og:url" content="https://dbushell.com{href}" />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:image" content="https://dbushell.com/assets/icons/512x512.png" />
  <meta property="og:site_name" content="dbushell.com" />
  <meta name="fediverse:creator" content="@dbushell@fosstodon.org" />
</svelte:head>
