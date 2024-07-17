---
title: Print Container Bind Mounts
---

The following script will print the bind mounts of all currently running containers.

```bash
#!/usr/bin/env bash

while IFS= read -r container_id; do
    # When queried using docker inspect, the name has a leading slash that is removed using sed
    name="$(docker inspect "$container_id" --format '{{.Name}}' | sed 's|^/||g')"
    mounts="$(docker inspect "$container_id" --format '{{range .HostConfig.Binds}}{{println .}}{{end}}')"
    char_count="$(echo "$mounts" | wc --chars)"

    echo "Bind mounts for: $name"

    # If a container doesn't have a bind mount, the output will just be a newline hence the 1 character
    if (( char_count <= 1 )); then
        echo "none"
    else
        echo "$mounts"
    fi
    echo
done < <(docker ps --quiet)
```
