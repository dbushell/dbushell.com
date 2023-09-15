---
date: 2020-03-27 10:00:00+00:00
slug: debugging-a-todo-app
title: 'Debugging a Todo App'
description: 'The one where I debug my progressive web app.'
---

So lately I've been boasting about how easy it is to build [Progressive Web Apps](/2020/03/05/bundle-a-pwa-as-an-android-app/). I've been dogfooding my glorified todo app **Mute Swan** for weeks thinking it was perfect (bug-free) and quite possibly a game changer, if I dare say.

As it turns out these things are not so easy to test. This week I squashed a bug that I may never have noticed.

## Daylight Savings

Earlier in the week I noticed that tasks assigned to Monday, 30th March would also appear under Sunday 29th. Here's a GIF:

<p class="Image">
  <img loading="lazy"
    src="/images/blog/2020/muteswan-datebug.gif"
    alt="Mute Swan daylight savings bug"
    width="320"
    height="419">
</p>

I had my suspicions. I Googled "when do the clocks change" as is tradition. 29th March is guilty this time of year in the UK. Now I have a clue as to why this bug exists; time to debug.

Mute Swan tasks are stored by ID in a single state object. Each task has a unix timestamp. This time is set to midnight for the day they're assigned. When the list for each day is rendered the state is filtered by a 24 hour range:

```javascript
const tasks = Object.values(state)
  .filter(task =>
    task.unix >= startTime && task.unix < endTime
  );
````

Using "today" as an example, I start the range at midnight:

```javascript
const startDate = new Date();
startDate.setHours(0, 0, 0, 0);
```

Then add 24 hours to get the end of the range:

```javascript
const endDate = new Date(
  startDate.getTime() + 86400000
);
```

That seemed to work fine. Until the clocks went forward. With this code the `endDate` for the range on Sunday 29th is *one hour past midnight* on the 30th. That means any tasks assigned to Monday also appear in the filtered list for Sunday.

Whoops.

Now given the Redux nature of my code, if I dragged either of those duplicate tasks into a different day, I'd no longer see two because only the timestamp for a single task ever changed in the state. This was a bug in the selector logic.

The solution:

```javascript
const endDate = new Date(startDate.getTime());
endDate.setDate(endDate.getDate() + 1);
```

This technically does the same thing by adding 24 hours to the date. However, when I do `endDate.getTime()` it will return `3600000` milliseconds (one hour) less than before. JavaScript Date methods account for daylight savings whereas my naively adding unix time together did not.

Lesson learned...

Now that I think about it I remember throwing together an "event countdown" for a client that ended up being off by an hour. I've made this mistake before! Thankfully we got that fixed long before attendees arrived on the day.

I'm blogging this so I don't forget again.

## Related articles

* [Bundle a PWA as an Android App](/2020/03/05/bundle-a-pwa-as-an-android-app/)
* [Debugging a Todo App](/2020/03/27/debugging-a-todo-app/)
* [Bubblewrap Apps in Android Studio](/2020/06/01/bubblewrap-twa-pwa-apps-android-studio/)
* [PWA Encryption and Auto Sign-in](/2020/06/08/pwa-web-crypto-encryption-auto-sign-in-redux-persist/)

Last updated: June 2020.
