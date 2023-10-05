<script>
  import Button from './button.svelte';
</script>

<div class="Social">
  <Button href="/about/">About Me</Button>
  <a
    rel="me noopener noreferrer"
    title="David Bushell on Mastodon"
    href="https://fosstodon.org/@dbushell"
    target="_blank"
  >
    <span class="Hidden">Mastodon</span>
    <svg
      aria-label="Mastodon"
      role="img"
      viewBox="0 0 512 512"
      width="24"
      height="24"
    >
      <path d="M0 0h512v512H0z" />
      <path
        fill="var(--social-color)"
        d="M317 381q-124 28-123-39 69 15 149 2 67-13 72-80 3-101-3-116-19-49-72-58-98-10-162 0-56 10-75 58-12 31-3 147 3 32 9 53 13 46 70 69 83 23 138-9"
      />
      <path
        d="M360 293h-36v-93q-1-26-29-23-20 3-20 34v47h-36v-47q0-31-20-34-30-3-30 28v88h-36v-91q1-51 44-60 33-5 51 21l9 15 9-15q16-26 51-21 43 9 43 60"
      />
    </svg>
  </a>
  <a
    rel="me noopener noreferrer"
    title="David Bushell on Twitter"
    href="https://twitter.com/dbushell/"
    target="_blank"
  >
    <span class="Hidden">Twitter</span>
    <svg
      aria-label="Twitter"
      role="img"
      viewBox="0 0 512 512"
      width="24"
      height="24"
    >
      <rect width="512" height="512" rx="15%" />
      <path
        fill="var(--social-color)"
        d="M437 152a72 72 0 0 1-40 12 72 72 0 0 0 32-40 72 72 0 0 1-45 17 72 72 0 0 0-122 65 200 200 0 0 1-145-74 72 72 0 0 0 22 94 72 72 0 0 1-32-7 72 72 0 0 0 56 69 72 72 0 0 1-32 1 72 72 0 0 0 67 50 200 200 0 0 1-105 29 200 200 0 0 0 309-179 200 200 0 0 0 35-37"
      />
    </svg>
  </a>
  <a
    rel="me noopener noreferrer"
    title="David Bushell on GitHub"
    href="https://github.com/dbushell/"
    target="_blank"
  >
    <span class="Hidden">GitHub</span>
    <svg
      aria-label="GitHub"
      role="img"
      viewBox="0 0 512 512"
      width="24"
      height="24"
    >
      <rect width="512" height="512" rx="15%" />
      <path
        fill="var(--social-color)"
        d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"
      />
    </svg>
  </a>
  <a
    rel="me noopener noreferrer"
    title="David Bushell on CodePen"
    href="https://codepen.io/dbushell/"
    target="_blank"
  >
    <span class="Hidden">CodePen</span>
    <svg
      aria-label="CodePen"
      role="img"
      viewBox="0 0 512 512"
      width="24"
      height="24"
    >
      <rect width="512" height="512" rx="15%" />
      <g
        fill="none"
        stroke="var(--social-color)"
        stroke-width="33"
        stroke-linejoin="round"
      >
        <path d="M81 198v116l175 117 175-117V198L256 81z" />
        <path d="M81 198l175 116 175-116M256 81v117" />
        <path d="M81 314l175-116 175 116M256 431V314" />
      </g>
    </svg>
  </a>
  <a
    title="dbushell.com RSS Feed"
    href="https://dbushell.com/rss.xml"
    target="_blank"
  >
    <span class="Hidden">RSS Feed</span>
    <svg
      aria-label="RSS Feed"
      role="img"
      viewBox="0 0 512 512"
      width="24"
      height="24"
    >
      <rect width="512" height="512" rx="15%" />
      <circle cx="145" cy="367" r="35" fill="var(--social-color)" />
      <path
        fill="none"
        stroke="var(--social-color)"
        stroke-width="60"
        d="M109 241c89 0 162 73 162 162m114 0c0-152-124-276-276-276"
      />
    </svg>
  </a>
</div>
