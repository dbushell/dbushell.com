---
date: 2023-06-20 10:00:00+00:00
slug: git-ssh-verify-allowed-signers
title: 'Verify Signed Git Commits'
description: 'The one where I verify commits locally'
---

I recently wrote about using [SSH keys for Git signatures](/2023/03/27/git-ssh-signing-keys/) instead of GPG. Signing commits gives you a nice green checkmark on GitHub proving it was you.

This week I created new SSH keys using ED25519 instead of RSA. Supposedly better and I reasoned it was time to refresh considering how ancient my RSA keys were. (And how many forgotten backups existed of the private key.)

After doing that I wanted to verify commit signatures locally.

There is a command for that:

```shell
git log --show-signature
```

But I got this error:

```console
error: gpg.ssh.allowedSignersFile needs to be configured and exist for ssh signature verification
```

To fix this I updated the global `~/.gitconfig` in my home directory:

```ini
[gpg "ssh"]
	allowedSignersFile = ~/.ssh/allowed_signers
```

The "allowed signers" file can be anywhere but I stuck it alongside my SSH keys. The format is one `[email address] [public key]` per line with the emails matching those of the git commits. For example:

```console
user@example.com ssh-ed25519 AAAAC3Nza[...]
```

Running `git log --show-signature` again is now successful:

```console
commit efef7e84d910b6ada7a0382b1271bed9cd769299
Good "git" signature for user@example.com with ED25519 key SHA256:Sj5Af[...]
```

Neat!

Seems sensible to include my old public key as a signer and keep it on my GitHub account as a signing key. Doing so allows old commits to continue to be verified. Deleting the old private key ensures no new signatures can be created whilst the public key can still verify. That's the beauty of [asymmetric cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography).

If a private key ever gets stolen then the only choice is to disassociate with both keys.

Am I doing something wrong? [@dbushell](https://twitter.com/dbushell/) or [@dbushell@fosstodon.org](https://fosstodon.org/@dbushell).
