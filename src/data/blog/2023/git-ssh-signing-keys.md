---
date: 2023-03-27 10:00:00+00:00
slug: git-ssh-signing-keys
title: 'Goodbye GPG, Hello SSH Key Signing'
description: 'The one where I replace something that ain’t broke'
---

I was using a GPG key to sign Git commits but I've now swiched to an SSH key. GPG keys are a pain to manage on macOS. Going full SSH is one less concern to remember. [GitHub added support](https://github.blog/changelog/2022-08-23-ssh-commit-verification-now-supported/) for SSH signing back in August last year.

My process was to generate a new key called `signingkey`:

```shell
ssh-keygen -t rsa -f ~/.ssh/signingkey
```

It's good practice to use unique SSH keys per machine for authorisation. I think. Seems sensible to use a different key for signing.

I then updated the global `~/.gitconfig` in my home directory:

```
[user]
  signingkey = /path/to/home/.ssh/signingkey.pub
[gpg]
  format = ssh
```

It's also possible to update local `.git/config` files for repo-specific changes if needed.

In the same global config I checked to make sure Git is signing stuff:

```
[commit]
  gpgsign = true
[tag]
  gpgsign = true
```

As a bonus I added the key to macOS keychain to avoid typing the password on every commit:

```shell
ssh-add --apple-use-keychain ~/.ssh/signingkey
```

Finally I added my new public key to GitHub etc; job done.

On the topic of SSH keys, it's been over 10 years — ten! — since I wrote [*"Multiple Accounts and SSH Keys"*](/2013/01/27/multiple-accounts-and-ssh-keys/). I haven't used analytics in years but I'm pretty sure that was my most searched blog post. Check back in 2033 for another SSH tip.

## Update – 20th June 2023

There's a little more; see ["*Verify Signed Git Commits*"](/2023/06/20/git-ssh-verify-allowed-signers/) for additional usage.
