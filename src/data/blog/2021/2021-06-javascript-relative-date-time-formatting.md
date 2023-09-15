---
date: 2021-06-8 10:00:00+00:00
slug: javascript-relative-date-time-formatting
title: 'Relative Date Formatting in JavaScript'
description: 'The one where I learn a new trick'
---
Did you know those behemothic JavaScript date libraries are basically obsolete?

A few weeks ago I learnt how to use the **Internationalization API** for [natural alphanumeric sorting](/2021/05/17/javascript-natural-alphanumeric-sorting/). This week I've been using the [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and [RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) APIs. Like all native APIs they're a little verbose and unintuitive, but also extremely powerful. Browser support has caught up making them viable for regular use.

A simple example for the day of the week:

```javascript
// Returns "Sunday" (on Sunday)
new Date().toLocaleDateString(
  'en-GB', {weekday: 'long'}
);
```

The same using a class instance:

```javascript
const dtf = new Intl.DateTimeFormat(
  'en-GB', {weekday: 'long'}
);
dtf.format(new Date());
```

An example using relative formats:

```javascript
const rtf = new Intl.RelativeTimeFormat(
  'en-GB', {numeric: 'auto'}
);
rtf.format(-1, 'days'); // Returns "yesterday"
rtf.format(-2, 'days'); // Returns "2 days ago"
```

The [`Intl` namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) is chock full of goodies. Best of all browsers provide full internationalisation so translating web UI becomes even easier.

## Practical Example

For my [podcast player](https://github.com/dbushell/mesonic) side project I've added a function to format dates based on age. Most recent episode are labelled either "Today" or "Yesterday", or by weekday if less than seven days olds, and finally by full date when older.

<p class="Image">
  <img loading="lazy" srcset="
    /images/blog/2021/mesonic-v0-16-2@1x.png,
    /images/blog/2021/mesonic-v0-16-2@2x.png 2x"
    src="/images/blog/2021/mesonic-v0-16-2@1x.png"
    alt="podcast episode list with relative dates"
    width="360"
    height="304">
</p>

This makes it easier to see what's new at a glance. It removes the need to mentally parse a full date. For older episodes a relative format like "20 days ago" is less meaningful so I've opted for long form after one week. Context is key, there's no magic formula.

```javascript
// Formatter for "Today" and "Yesterday" etc
const relative = new Intl.RelativeTimeFormat(
  'en-GB', {numeric: 'auto'}
);

// Formatter for weekdays, e.g. "Monday"
const short = new Intl.DateTimeFormat(
  'en-GB', {weekday: 'long'}
);

// Formatter for dates, e.g. "Mon, 31 May 2021"
const long = new Intl.DateTimeFormat(
  'en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

const formatDate = (date) => {
  const now = new Date().setHours(0, 0, 0, 0);
  const then = date.setHours(0, 0, 0, 0);
  const days = (then - now) / 86400000;
  if (days > -6) {
    if (days > -2) {
      return relative.format(days, 'day');
    }
    return short.format(date);
  }
  return long.format(date);
};
```

For me this is more of a lesson in paying attention to what's being shipped in modern browsers. I'm accustomed to using particular libraries because JavaScript was pretty much stagnant for the longest time. With Internet Explorer 11 no longer a concern, new APIs are becoming usable at an exciting pace.
