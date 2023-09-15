<script>
  import App from '../components/app.svelte';
  import Aside from '../components/aside.svelte';
  import Heading from '../components/heading.svelte';
  import Nav from '../components/nav.svelte';
  import Main from '../components/main.svelte';
  import Masthead from '../components/masthead.svelte';
  import Contact from '../components/contact.svelte';

  export let latest;
</script>

<App>
  <Masthead />
  <Main>
    <Nav current="/contact/" />
    <Heading title={`Contact`} />
    <div class="Prose">
      <h3 class="Cursive">I’m here to help</h3>
      <p class="Large">Need professional help with your website?</p>
      <p class="Large">
        <a href="mailto:hi@dbushell.com"><b>hi@dbushell.com</b></a>
      </p>
      <div id="contact-form">
        <Contact />
      </div>
    </div>
  </Main>
  <Aside articles={latest} />
</App>
