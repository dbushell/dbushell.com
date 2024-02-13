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
  import App from '@components/app.svelte';
  import Contact from '@components/contact.svelte';
  import Heading from '@components/heading.svelte';
  import Kofi from '@components/kofi.svelte';
  import Nav from '@components/nav.svelte';
</script>

<App>
  <svelte:fragment slot="main">
    <Nav current="/contact/" />
    <Heading title={`Contact`} />
    <div class="Prose">
      <!-- <h3 class="Cursive">I’m here to help</h3> -->
      <Kofi intro="Help support my blog and open source projects with a tip." />
      <p class="Large">Need professional help with your website?</p>
      <p class="Large">
        <a href="mailto:hi@dbushell.com"><b>hi@dbushell.com</b></a>
      </p>
      <div id="contact-form">
        <Contact />
      </div>
    </div>
  </svelte:fragment>
</App>
