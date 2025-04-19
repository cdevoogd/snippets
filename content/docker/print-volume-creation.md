---
title: Print Volume Creation Times
---

You can use the output of `docker volume ls` to loop over each volume and print information about the volume. This snippet will print the creation time of each volume on the machine.

Here it is in a multi-line format:

```bash
while IFS= read -r volume; do
    echo "$(docker volume inspect --format '{{.CreatedAt}}' "$volume"): $volume"
done < <(docker volume ls --quiet)
```

And here it is as a one-liner:

```bash
while IFS= read -r volume; do echo "$(docker volume inspect --format '{{.CreatedAt}}' "$volume"): $volume"; done < <(docker volume ls --quiet)
```
