---
title: View Used Ports
---

There are a few different options for showing TCP ports that are being listened on:

```bash
sudo ss -tulpn | grep LISTEN
sudo lsof -i -P -n | grep LISTEN
sudo netstat -tulpn | grep LISTEN
```

If you want to search for a specific port, you can run the same commands as above and just `grep`
for the port number. You can also run this command that's slightly different:

```bash
sudo lsof -i:<PORT>
```
