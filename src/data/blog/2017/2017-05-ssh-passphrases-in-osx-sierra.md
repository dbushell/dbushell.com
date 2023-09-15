---
date: 2017-05-18 10:00:00+00:00
slug: ssh-passphrases-in-macos-sierra
title: 'SSH Passphrases in MacOS Sierra (and learning Vim)'
description: 'MacOS Sierra changed stuff. Here’s how to avoid entering your password with every SSH request.'
---

Managing SSH keys for remote repositories ain't easy to grok. ["Multiple Accounts and SSH
Keys"](/2013/01/27/multiple-accounts-and-ssh-keys/) is to no
suprise one of my most popular articles. It's
still relevant and I have to refer to it myself at least once a year.

Recently MacOS began requesting my passphrase with every Git push and pull. That
is not productive.

The solution is two new lines in `~/.ssh/config`:

```
Host github.com
    User git
    Hostname github.com
    AddKeysToAgent yes
    UseKeychain yes
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/github.com/github
```

Setting `AddKeysToAgent` and `UseKeychain` to `yes` will remember the passphrase
after entering it once. Credit to [Guewen Faivre](https://blog.elao.com/en/tech/ssh-agent-does-not-automatically-load-passphrases-on-the-osx-sierra-keychain/) for the explanation and answer.

Whilst editing my config file in Vim I figured, why not learn this tool properly?

## Foray into [Vim](http://www.vim.org/)

Vim! The command line text editor notorious for hiding the exit door.

I've been on a mission this week to learn it. I began by setting up
[Vundle](https://github.com/VundleVim/Vundle.vim) to manage plugins.
I added a few syntaxes, [Airline](https://github.com/vim-airline/vim-airline),
[CtrlP](https://github.com/ctrlpvim/ctrlp.vim),
[Fugitive](https://github.com/tpope/vim-fugitive), and the
[Dracula](https://github.com/dracula/dracula-theme) colour scheme which I've
customised a bit.

I've realised it's going to take a lot of use for me to become comfortable in Vim.
Keyboard shortcuts have never been my friend. The difference in file browsing
has also thrown me off my game. It's not that the command line and CtrlP are
difficult, it's how accustomed I've grown to a file tree sidebar. I've
since found [NERDTree](https://github.com/scrooloose/nerdtree) which I've
bound to `Ctrl+n`. It alleviates a lot of pain.

![Editing dbushell.com in Vim](/images/blog/2017/dbushell-vim-editing.png)

Despite the struggles I do like using Vim. I don't see it replacing
Sublime Text 3 for long sessions. At least not any time soon. But it is now my
go-to for quick edits.

If you have any favoured Vim tips, tweet me a link [@dbushell](http://twitter.com/dbushell)!
