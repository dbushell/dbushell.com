<script>
  import Bio from './bio.svelte';
  import Card from './card.svelte';
  import Rule from './rule.svelte';
  import Social from './social.svelte';

  export let articles;
</script>

<div class="Aside">
  <Rule hidden />
  <aside class="Featured">
    <Card href="/" title="David Bushell">
      <Bio />
      <Social />
    </Card>
    <Card
      href="/working-with-agencies/"
      title="Web Agencies"
      subtitle="Need a hand?"
    >
      <p>
        I’m reliable, flexible, and pride myself in communication and initiative
        to ensure smooth delivery on time and within budget.
      </p>
    </Card>
    <Card
      href="/working-with-clients/"
      title="Businesses"
      subtitle="Have an idea?"
    >
      <p>
        Let’s discuss your requirements, share ideas, and figure out what’s best
        for your new website together.
      </p>
    </Card>
    <Card href="/showcase/" title="My Portfolio" subtitle="See my work!">
      <p>Find out what I've been coding and see my design portfolio.</p>
    </Card>
    <Rule />
    {#if articles}
      <Card title="The Blog" href="/blog/">
        <p>I write about website design and development.</p>
        <ul class="List">
          {#each articles as item (item.href)}
            <li>
              <a href={item.href}>{@html item.title}</a>
            </li>
          {/each}
        </ul>
      </Card>
    {/if}
  </aside>
</div>
