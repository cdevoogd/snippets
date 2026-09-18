---
title: Bulk Delete Images By Tag
---

This command will remove all Docker images that match the target tag exactly. If you want to see the
images that are matched before deleting them, just remove `docker rmi` from the end of the command
and leave `xargs`. The image names should then be printed out for you to see.

```bash
target_tag="YOUR_TAG"
docker images --format '{{.Repository}} {{.Tag}}' | awk -v tag="$target_tag" '$2 == tag {print $1 ":" $2}' | xargs docker rmi
```


```console
$ docker images --format 'table'
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
alpine       3.21      748902c9f936   18 hours ago   8.13MB
alpine       3.23      189367d8c070   18 hours ago   8.66MB
alpine       latest    33bee74c45f3   18 hours ago   8.66MB
ubuntu       latest    5b3c163248f4   6 days ago     120MB
ubuntu       24.04     8494c74ca40f   7 days ago     101MB
fedora       latest    da5ed9cff0af   3 weeks ago    194MB

$ target_tag="latest"
$ docker images --format '{{.Repository}} {{.Tag}}' | awk -v tag="$target_tag" '$2 == tag {print $1 ":" $2}' | xargs docker rmi
Untagged: alpine:latest
Untagged: alpine@sha256:5b02b42e375f7426f8d65c3af331ca05d9878f9989230354504e0b9dfd431f60
Deleted: sha256:33bee74c45f307e3268adc2010c0f55c48e7a6041e12cd12432bb1a46e498e43
Deleted: sha256:1b349a3334531b575b01d409540dd8aca14ef29abddacd50f36643d7c949db4b
Untagged: ubuntu:latest
Untagged: ubuntu@sha256:9559ceb7c21e528e233e8dff26a0fb2682f4094cce06176eeb075d87a22b31de
Deleted: sha256:5b3c163248f443966ebbe8413216c00aba788dd11118c62a62149dcb2ccb99df
Deleted: sha256:a2529fea105a92799916f2c0dc32fc7661d9d5780e35a5a5c792e9927669d94b
Deleted: sha256:8e4195c4cab0d8619c6e4875591ec16d60bfea485efc58429e9b9e51f327fc0e
Untagged: fedora:latest
Untagged: fedora@sha256:43b29f65a41eb9c35e1cd5323e3bdf3b655c2357a9f4f1ff2f9c2798e5045d80
Deleted: sha256:da5ed9cff0af80751b165c7e8f8dbe795498b56f5a436e8533d09402aa7b1249
Deleted: sha256:121832a7edf8b8d6dcfd46c8c189a1a7491511e7f736d43c08024437542509c0

$ docker images --format 'table'
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
alpine       3.21      748902c9f936   18 hours ago   8.13MB
alpine       3.23      189367d8c070   18 hours ago   8.66MB
ubuntu       24.04     8494c74ca40f   7 days ago     101MB
```
