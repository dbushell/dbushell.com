<script>
  import Button from './button.svelte';
</script>

<div class="Social">
  <Button href="/about/">About</Button>
  <a
    rel="me noopener noreferrer"
    title="David Bushell on Ko-fi"
    href="https://ko-fi.com/dbushell"
    target="_blank"
  >
    <span class="Hidden">Ko-fi</span>
    <svg aria-label="Ko-fi" role="img" viewBox="0 0 512 512" width="24" height="24">
      <path d="M0 0h512v512H0z" />
      <path
        fill="var(--social-color)"
        d="M453.87 204.81c-5.85-29.39-20.98-47.82-37.73-58.71-16.75-11.77-36.92-17.62-57.03-17.62l-288.65-.02c-10.09 0-14.26 10.09-14.26 15.13v3.36s-.82 127.51.8 196.31c2.49 40.28 42.77 40.29 42.77 40.29s131.68 0 195.44-.8c3.36 0 5.85 0 9.22-.81 36.05-9.21 39.41-42.77 39.41-61.26 72.22 3.24 123.41-47.93 110.02-115.86Zm-183.74 58.7c-20.98 24.28-67.12 66.24-67.12 66.24s-.11.11-.33.24c-.4.36-1.58 1.32-3.16 1-.81-.12-1.56-.56-2.18-1.12-.24-.22-.67-.61-1.04-.94 0 .01-.02 0-.02 0-7.53-6.73-56.22-50.31-67.12-65.44-11.77-16.75-17.62-45.33-1.68-62.07 15.94-16.75 50.31-18.43 72.97 6.73 0 0 26.03-29.39 57.9-15.94 31.07 13.39 30.2 49.5 11.76 71.29Zm102.36 7.54c-15.13 1.68-27.71.81-27.71.81V177.1h19.31c12.58 0 24.34 5.04 32.69 15.13 5.85 6.72 10.09 15.94 10.09 29.39 0 31.01-15.94 43.58-34.37 49.43Z"
      />
    </svg>
  </a>
  <a
    rel="me noopener noreferrer"
    title="David Bushell on Mastodon"
    href="https://dbushell.com/mastodon/"
    target="_blank"
  >
    <span class="Hidden">Mastodon</span>
    <svg aria-label="Mastodon" role="img" viewBox="0 0 512 512" width="24" height="24">
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
    title="David Bushell on CodePen"
    href="https://codepen.io/dbushell/"
    target="_blank"
  >
    <span class="Hidden">CodePen</span>
    <svg aria-label="CodePen" role="img" viewBox="0 0 512 512" width="24" height="24">
      <rect width="512" height="512" rx="15%" />
      <g fill="none" stroke="var(--social-color)" stroke-width="33" stroke-linejoin="round">
        <path d="M81 198v116l175 117 175-117V198L256 81z" />
        <path d="M81 198l175 116 175-116M256 81v117" />
        <path d="M81 314l175-116 175 116M256 431V314" />
      </g>
    </svg>
  </a>
  <a
    rel="me noopener noreferrer"
    title="David Bushell on GitHub"
    href="https://github.com/dbushell/"
    target="_blank"
  >
    <span class="Hidden">GitHub</span>
    <svg aria-label="GitHub" role="img" viewBox="0 0 512 512" width="24" height="24">
      <rect width="512" height="512" rx="15%" />
      <path
        fill="var(--social-color)"
        d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"
      />
    </svg>
  </a>
  <a title="dbushell.com RSS Feed" href="https://dbushell.com/rss.xml" target="_blank">
    <span class="Hidden">RSS Feed</span>
    <svg aria-label="RSS Feed" role="img" viewBox="0 0 512 512" width="24" height="24">
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
