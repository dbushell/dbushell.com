<script context="module">
  export const pattern = '/';

  export const load = async ({fetch, serverData}) => {
    const data = await fetch('/api/home/', {
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
  import Rule from '@components/rule.svelte';

  const {props} = getContext('serverData');
  const {latest} = props;

  const h1 = `<span class='Hidden'>David Bushell</span>
    <span>Web Design &amp; Front-end Development</span>`;
</script>

<App>
  <svelte:fragment slot="main">
    <Nav current="/" />
    <Heading title={h1} balance={false} />
    <h3 class="Cursive">I make websites</h3>
    <div class="Prose">
      <p class="Large">
        I design and build websites with a focus on standards, performance, and accessibility. With
        a decade of professional experience — in-house and remote — I’ve delivered for everyone.
        Whether it’s
        <abbr title="Progressive Web Apps">PWAs</abbr>, WordPress, or full-stack frameworks, I have
        the know-how to help.
      </p>
      <div class="Crane">
        <picture>
          <source srcset="/assets/images/origami-crane.avif" type="image/avif" />
          <img
            alt="Origami Crane - Copyright © David Bushell"
            src="/assets/images/origami-crane.png"
            width="500"
            height="520"
            loading="lazy"
            role="presentation"
          />
        </picture>
        <div>
          <ul class="List List--large">
            <li><a href="/front-end-development/">Front-end Development</a></li>
            <li><a href="/responsive-design/">Responsive Design</a></li>
            <li><a href="/services/">And a whole lot more&hellip;</a></li>
          </ul>
          <Button href="/contact/">Hire Me!</Button>
        </div>
      </div>
      <h3 class="Cursive">What my clients say</h3>
      <blockquote>
        <p>
          Highly skilled, personable, helpful and dedicated: David exceeded my expectations to
          deliver for us on a key project.
        </p>
        <p><cite>Frank Fenton – Head of Digital – Dinosaur UK Ltd.</cite></p>
      </blockquote>
      <Rule />
      <h3 class="Cursive">Featured article</h3>
    </div>
    <Article {...latest[0]} />
  </svelte:fragment>
</App>
