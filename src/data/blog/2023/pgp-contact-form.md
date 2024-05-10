---
date: 2023-07-14 10:00:00+00:00
slug: pgp-email-encryption-aws-cloudflare-worker
title: 'PGP Encrypted Contact Form Emails'
description: 'The one where I take data privacy seriously'
---

It's time! Time to check off another to-do on the "random dev ideas" list!

I have a [contact form](/contact/) on my website. It emails the enquirer's name, email, and message to me using [AWS SES](https://docs.aws.amazon.com/ses/latest/dg/send-email-api.html) (Simple Email Service).

<figure class="Image">
  <img
    loading="lazy"
    src="/images/blog/2023/contact-form-email.avif"
    alt="A contact form email with test data"
    width="830"
    height="390">
</figure>

You see that? Plain text email! HTML has no place in emails.

## Old Implementation

My static site is currently hosted on [Netlify](https://www.netlify.com/) and the contact form was handled by a [Netlify function](https://www.netlify.com/products/functions/). That was a small server-side JavaScript function that accepted the `POST` data and called the AWS SES API to send an email. That's the *Amazon Web Service Simple Email Service Application Programming Interface*, FYI.

For various reasons I'm also fronting my website with Cloudflare, despite [Netlify's advice](https://answers.netlify.com/t/support-guide-what-problems-could-occur-when-using-cloudflare-in-front-of-netlify/138). That means data is passed through Cloudflare, Netlify, and Amazon, before it gets to Proton. Data is sent encrypted over TLS but each service can technically read it before passing it along. That's a whole lotta privacy policies…

## The Idea

I'm a happy paying [Proton Mail](https://proton.me/mail) user. So any email I receive is encrypted on arrival (if not already). Only I can decrypt and read the contents. A stark difference from Gmail for example, where Google actively read, index, and catalogue your private emails. Proton Mail uses the [PGP encryption](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) standard. If emails are encrypted before they're sent to me no service along the way can read the contents.

So my idea is simple:

**Encrypted the contact form email with PGP as early as possible.**

## New Implementation

Theoretically I could encrypt the email in the web browser making it truly end-to-end encrypted. However, the [OpenPGP.js library](https://github.com/openpgpjs/openpgpjs) is rather big. Maybe there are smaller libraries but OpenPGP is [maintained by Proton](https://proton.me/blog/openpgpjs-email-encryption) so I trust it. Anyway, requiring JavaScript to submit a form isn't a compromise I'm willing to make.

Initially I had envisioned adding the encryption to my existing Netlify function. Then I realised I could use a [Cloudflare Worker](https://workers.cloudflare.com/) to handle the `POST` request and bypass Netlify entirely.

Time for some code!

The email is sent to `hi@dbushell.com` which has this PGP public key:

```console
-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZFn7ehYJKwYBBAHaRw8BAQdAwqA8sKd0DFi9ZoyG45Bg4nZiEV+V9lZ3
wvD4xHuHJoTNIWhpQGRidXNoZWxsLmNvbSA8aGlAZGJ1c2hlbGwuY29tPsKM
BBAWCgA+BYJkWft6BAsJBwgJkEsrOeOY5JVeAxUICgQWAAIBAhkBApsDAh4B
FiEETUf3geu0g0sZvPTCSys545jklV4AAJ8SAP41Hoc2VXKZIPqSlxvzDqQv
A8PHFZWvBa6xO4USjgUqhQEAlD88TkJzTY1v+Is0cCHHKUDjPgFH/z09zbzw
PJyaWQnOOARkWft6EgorBgEEAZdVAQUBAQdA2XKGBLhzdKQszjvYeb6Bj1rR
7EcMCSqZL6HMdGEMYAIDAQgHwngEGBYIACoFgmRZ+3oJkEsrOeOY5JVeApsM
FiEETUf3geu0g0sZvPTCSys545jklV4AAMHWAQDgPYJd7uNL2cMiN4K/M+TT
wN4pn0F9JDhFp6qUYfBZKwD/dDMQBnejah9lg0P4HErwG1bFEZmd+T8nOTpt
Y5Au0gc=
=C+Mh
-----END PGP PUBLIC KEY BLOCK-----
```

Encrypting an email with the `openpgp` library is simple. The example code below is inside a `POST` request handler. In my case, that's a [Cloudflare Worker](https://developers.cloudflare.com/workers/).

```javascript
import * as openpgp from 'openpgp';

// TODO: server-side validation...
const data = await request.formData();

// The email body template (could be HTML)
const message = await openpgp.createMessage({
  text: `
Name: ${data.get('name')}
Email: ${data.get('email')}

Enquiry:
${data.get('enquiry')}
`
});

const encryptionKeys = await openpgp.readKey({
  armoredKey // the PGP public key above
});

const encrypted = await openpgp.encrypt({
  message,
  encryptionKeys
});
```

With that `encrypted.toString()` returns the email body like:

```console
-----BEGIN PGP MESSAGE-----

wV4DI7BM8eVGeagSAQdAuDJBNL72qJ6MqxHmvmQwDGWmEM2pG1Va84MZ6Qy9
IHQw3zJ21MwwnbXGN5H2Zdg4cokE1rsOEYF/5eR0U1Rkf61FMwoQu9qO6SyK
CBQz3o7v0lUBk5xPS1rL2o/1CS3sjsxGH7O83ySjDT6l8BtDmA70ieuo902H
f/HLz2Sa8l/71dfE8lRXuvv0ZxTR/ogOsmb+T1X2g9jPsQWGedbM6McJzdm6
P9gn
=HYOw
-----END PGP MESSAGE-----
```

Only my private key can decrypted it — and that's a secret!

Sending this via AWS SES is just as easy. Assuming you've got everything configured on the AWS side… which is far from easy.

```javascript
const client = new SESv2Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
});

await client.send(
  new SendEmailCommand({
    FromEmailAddress: env.SES_RECIPIENT,
    Destination: {
      ToAddresses: [env.SES_RECIPIENT]
    },
    Content: {
      Simple: {
        Subject: {
          Data: "Enquiry (dbushell.com)"
        },
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: encrypted.toString()
          }
        }
      }
    }
  })
);
```

The email subject cannot be encrypted so I keep that generic.

I could put the enquirer's email in `ReplyToAddresses` for convenience but headers aren't encrypted either. I can't CC them a copy because they'll only see the encrypted body.

With this new implementation only the Cloudflare Worker sees the data. Netlify is bypassed, AWS only knows I'm sending an encrypted email to myself, and Proton Mail can only decrypt the email client-side.

## Is it worth the effort?

As you might have guessed, when I follow up on enquiries I'm almost always replying with unencrypted email. Very few people use PGP in the real world.

So why bother? I'll admit this is largely academic but I think it's worth the effort. It certainly can't harm to cut out several middlemen from the process.

Most importantly, I can check that to-do off my list.

☑️ ~~PGP encrypt contact form email?~~ **(done)**
