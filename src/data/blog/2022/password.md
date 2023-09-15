---
date: 2022-08-23 10:00:00+00:00
slug: let-me-type-my-password
title: 'Let me type my ******* password!'
description: 'The one where I get mad'
---

Did I miss the "user experience" memo about passwords?

I've noticed a growing trend in website design that is driving me crazy. It's actually far from a new trend. It has insideously crept across the web for years and has basically ruined everything. Call me melodramatic but I'm writing this on a Monday and I hate it!

## Where did the password field go?

Login used to be simple. You'd type in your username and password and click "Login" (or "Log in", or "Sign in", or "Sign-in" — I'm not fussed).

Then people who make websites decided to change their job titles and "solve" things. Now everywhere I go login has to be an arduous multi-step process. Please, I just want to enter my password!

Passwords nowhere:

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2022/password-adobe.png"
    alt="Adobe login form"
    width="439"
    height="241">
  <figcaption>The <strong>Adobe</strong> login form forgot something...</figcaption>
</figure>

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2022/password-apple.png"
    alt="Apple login form"
    width="371"
    height="332">
  <figcaption><strong>Apple</strong> try to <em>think differently</em>.</figcaption>
</figure>

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2022/password-google.png"
    alt="Google login form"
    width="408"
    height="416">
  <figcaption>No <strong>Google</strong> I didn't "forget email" but you forgot password.</figcaption>
</figure>

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2022/password-twitter.png"
    alt="Twitter login form"
    width="342"
    height="435">
  <figcaption><strong>Twitter</strong>, I'm not sure if I forgot my password. How about we find out?</figcaption>
</figure>

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2022/password-amazon.png"
    alt="Amazon login form"
    width="360"
    height="309">
  <figcaption><strong>Amazon</strong> — no password but <strong>four</strong> policy agreements.</figcaption>
</figure>

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2022/password-slack.png"
    alt="Slack login form"
    width="460"
    height="530">
  <figcaption><strong>Slack</strong> does not spark joy. Just let me get in and out.</figcaption>
</figure>

It would seem "Sign in" is the more common phrase now.

Anyway, there is one standout winner amongst my regular logins.

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2022/password-netlify.png"
    alt="Netlify login form"
    width="385"
    height="385">
  <figcaption><strong>Netlify</strong> wins gold. Not only no password, no username either!</figcaption>
</figure>

Well done Netlify! Your "Log in" link in the menu doesn't allow me to login. Thankfully the real login page does allows me type a username & password. Regardless, you've made me click twice anyway.

## It's annoying

I use different devices and browsers so I don't save passwords with each browser. For security I don't auto-fill anything either. Instead I use a password manager. I just click the plugin to fill in my details. With Apple's face or touch ID it's extra quick and secure. When the password field is hidden this often fails and I have to do it twice. Or worse, I have to copy & paste the password because the form markup is so broken.

If it's not in my password manager then I don't care. Just let me press _Tab_ and type my `Password1!` variant. What possible value do I gain from a relatively tedious multi-page form.

Can you imagine the inconvenience of it! Outrageous.

## What's the deal?

Is this a product of some A/B testing? Are users considered so stupid they can only handle one field at a time? If that's true then all the "social sign in" clutter isn't helping.

Is this an attempt to thwart bots? Judging from the countless Twitter sock puppets and relentless Gmail spam it doesn't work. I've read suggestions it's to stop brute force attacks. That's nonsense. Just rate limit a normal login form. Hiding the password field is only slowing down humans.

Is it to ensure the username or email address is correct before continuing? Now you've exposed valid accounts to bad actors.

The answer in some cases is single sign-on like SAML. So they can check and redirect to an identity provider if necessary when the account doesn't have a password. I guess business clients pay the bills.

Whatever the reason I hate it.

It's Monday morning, please, just let me type my password!
