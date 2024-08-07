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
    <h2 class="Cursive">
      <!-- https://icons.getbootstrap.com/icons/code-slash/ -->
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path
          d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"
        />
      </svg>
      <span>I make websites</span>
    </h2>
    <div class="Prose">
      <p class="Large Balance">
        I design and build websites with a focus on <em>standards</em>, <em>performance</em>,
        <em>accessibility</em>, and <em>security</em>. With over 15 years of professional
        experience, from progressive web apps, to content managed templates, and full-stack
        frameworks, I've coded it all.
      </p>
      <div class="Crane">
        <picture>
          <source srcset="/assets/images/origami-crane.avif" type="image/avif" />
          <img
            alt="my mascot; green folded origami crane"
            src="/assets/images/origami-crane.png"
            width="500"
            height="520"
            loading="lazy"
          />
        </picture>
        <div>
          <ul class="List List--large">
            <li><a href="/front-end-development/">Front-end Development</a></li>
            <li><a href="/responsive-design/">Responsive Design</a></li>
            <li><a href="/about/">Who Am I?</a></li>
          </ul>
          <Button href="/contact/">Hire Me!</Button>
        </div>
      </div>
      <h2 class="Cursive">
        <!-- https://icons.getbootstrap.com/icons/quote/ -->
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"
          />
        </svg>
        <span>What my clients say</span>
      </h2>
      <blockquote>
        <p>
          Highly skilled, personable, helpful and dedicated: David exceeded my expectations to
          deliver for us on a key project.
        </p>
        <p><cite>Frank Fenton – Head of Digital – Dinosaur UK Ltd.</cite></p>
      </blockquote>
      <Rule />
      <h2 class="Cursive">
        <!-- https://icons.getbootstrap.com/icons/rss/ -->
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M5.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-3-8.5a1 1 0 0 1 1-1c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1 6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1-1-1"
          />
        </svg>
        <span>Latest weblog</span>
      </h2>
    </div>
    <Article {...latest[0]} heading="h3" />
  </svelte:fragment>
</App>
