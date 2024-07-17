---
title: Clear Journal Logs
---

The journal logs are typically managed by the system itself, but if you need/want to manually clear them then you can run the commands below. You can change the `vacuum-time` if you only want to clear older logs instead of all logs.

```bash
journalctl --flush --rotate
journalctl --vacuum-time=1s
```
