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
    <Card href="/" title="David Bushell" heading="h2">
      <Bio />
      <Social />
    </Card>
    <Card href="/now/" title="My Projects" subtitle="New and old!">
      <p>
        Read my <a href="/notes/">microblog</a>, see what I’m <a href="/now/">coding now</a>
        and my <a href="/showcase/">design portfolio</a>.
      </p>
    </Card>
    <Card href="/working-with-agencies/" title="Web Agencies" subtitle="Need a hand?">
      <p>
        I’m reliable, flexible, and pride myself in communication and initiative to delivery on time
        and within budget.
      </p>
    </Card>
    <Card href="/working-with-clients/" title="Businesses" subtitle="Have an idea?">
      <p>
        Let’s discuss your requirements, share ideas, and figure out what’s best for your new
        website together.
      </p>
    </Card>
    <Rule />
    {#if articles}
      <Card title="The Blog" href="/blog/">
        <p class="Balance">I write about web design and development.</p>
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
