<script>
  import {getContext} from 'svelte';
  import Aside from '@components/aside.svelte';
  import Footer from './footer.svelte';
  import Head from '@components/head.svelte';
  import Lightbulb from './lightbulb.svelte';
  import Main from '@components/main.svelte';
  import Masthead from '@components/masthead.svelte';

  const {props} = getContext('serverData');
  const {latest} = props;
</script>

<Head />

<div class="Layout">
  <Masthead />
  <Main>
    <slot name="main" />
  </Main>
  <slot name="aside">
    <Aside slot="aside" articles={latest} />
  </slot>
</div>
<Lightbulb />
<Footer />
