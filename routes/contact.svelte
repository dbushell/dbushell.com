<script context="module">
  export const pattern = '/';

  export const load = async ({fetch, serverData}) => {
    // Use homepage data for `latest` articles
    const data = await fetch('/api/page/contact/', {
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
  import Contact from '@components/contact.svelte';
  import Heading from '@components/heading.svelte';
  import Nav from '@components/nav.svelte';

  const {deployHash} = getContext('publicData');
</script>

<svelte:head>
  <script defer type="module" src="/assets/scripts/contact.js?v={deployHash}"></script>
</svelte:head>

<App>
  <svelte:fragment slot="main">
    <Nav current="/contact/" />
    <Heading title={`Contact`} />
    <div class="Prose">
      <h2 class="Cursive">Let’s chat!</h2>
      <p>Need professional help with your website?</p>
      <p class="Large">
        <a href="mailto:hi@dbushell.com"><b>hi@dbushell.com</b></a>
      </p>
      <contact-form id="contact-form">
        <Contact />
      </contact-form>
    </div>
  </svelte:fragment>
</App>
