---
title: Block Connections With IPTables
---

Sometimes it's necessary to block a container's connection for testing. Docker uses `iptables` to
manage container networking, and if you just try to add a rule to the normal `iptables` chains or
use a tool like `ufw`, Docker will typically end up bypassing those rules. Instead, you need to add
rules to a specific chain called `DOCKER-USER`.

References:
- [Docker: Packet filtering and firewalls](https://docs.docker.com/network/packet-filtering-firewalls/)

Prevent all containers on the host from accessing a specific IP:

```bash
sudo iptables -I DOCKER-USER -d <DEST-IP> -j DROP
```

To remove that rule, run the same command with swap `-I` (insert) with `-D` (delete):

```bash
sudo iptables -D DOCKER-USER -d <DEST-IP> -j DROP
```
