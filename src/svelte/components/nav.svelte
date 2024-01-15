<script>
  export let current = '';

  const links = [
    {
      href: '/',
      label: 'Home'
    },
    {
      href: '/about/',
      label: 'About'
    },
    {
      href: '/services/',
      label: 'Services'
    },
    {
      href: '/now/',
      label: 'Now'
    },
    {
      href: '/blog/',
      label: 'Blog'
    },
    {
      href: '/contact/',
      label: 'Contact'
    }
  ];
</script>

<nav class="Nav">
  <h2 class="Hidden">Menu</h2>
  <ul>
    {#each links as link}
      <li>
        <a
          href={link.href}
          aria-current={current === link.href ? 'page' : null}
        >
          {link.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>
