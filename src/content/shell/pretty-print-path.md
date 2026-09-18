---
title: Pretty Print PATH
---

A simple command to print the directories in your PATH numbered and separated by newlines.

```bash
echo "$PATH" | sed 's/:/\n/g' | cat -n
```

Instead of this:

```console
$ echo "$PATH"
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```

You get this:

```console
$ echo "$PATH" | sed 's/:/\n/g' | cat -n
     1  /usr/local/sbin
     2  /usr/local/bin
     3  /usr/sbin
     4  /usr/bin
     5  /sbin
     6  /bin
     7  /usr/games
     8  /usr/local/games
     9  /snap/bin
```
