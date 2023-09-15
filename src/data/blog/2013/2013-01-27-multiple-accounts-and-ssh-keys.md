---
date: 2013-01-27 18:57:21+00:00
excerpt: None
slug: multiple-accounts-and-ssh-keys
template: single.html
title: Multiple Accounts and SSH Keys
---

Now that I'm officially a [self-employed freelancer](/2012/12/30/a-new-beginning/) I plan to blog more frequently. In the past I've rarely written very technical articles, but I imagine there are many designer/front-end developer types like me who struggle with this stuff. Tomorrow I'll post a big responsive design case study, I promise.

Today I moved my private code repositories onto **[Bitbucket](https://bitbucket.org/)** — my personal WordPress theme and other "secret projects". I don't have the disposable income anymore for premium accounts! I'm keeping my [open-source projects](https://github.com/dbushell) on GitHub (while it remains fashionable). 

## Multiple SSH keys

Problem is, Bitbucket doesn't allow you to use the same SSH key with more than one Bitbucket account. I still have my old work account to tidy up loose ends.

As [GitHub explains](https://help.github.com/articles/generating-ssh-keys) you can generate an SSH key like so:

````shell
cd ~/.ssh
ssh-keygen -t rsa -C "your_email@youremail.com"
````

You are then prompted for an optional password. After the key is generate you copy & paste it into your GitHub or Bitbucket account settings. On Mac OS X (10.8), which I'm using, copying to the clipboard is simple:

````shell
pbcopy < ~/.ssh/id_rsa.pub
````

With multiple Bitbucket accounts (and I assume GitHub too) you need multiple SSH keys. To generate a second key with a different name:

````shell
ssh-keygen -t rsa -f ~/.ssh/accountB -C "your_email@youremail.com"
````

To use multiple keys create a file at `~/.ssh/config` with contents similar to:

````
Host bitbucket.org
  User git
  Hostname bitbucket.org
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_rsa

Host bitbucket-accountB
  User git
  Hostname bitbucket.org
  PreferredAuthentications publickey
  IdentitiesOnly yes
  IdentityFile ~/.ssh/accountB
````

With this set up I can clone with my default key as Bitbucket suggests:

````shell
git clone git@bitbucket.org:username/project.git
````

If I want to clone a repository from my second account I can alter the command to use the second SSH key I generated:

````shell
git clone git@bitbucket-accountB:username/project.git
````

In fact, if I wanted to I could have a different SSH key for every account I have; GitHub, Bitbucket, or any other service that requires one.

And that, my friends, is the sum of my knowledge in this area!

## Update – 20th June 2023

I have more knowledge:

* [Goodbye GPG, Hello SSH Key Signing](/2023/03/27/git-ssh-signing-keys/)
* [Verify Signed Git Commits](/2023/06/20/git-ssh-verify-allowed-signers/)

Stay safe!
