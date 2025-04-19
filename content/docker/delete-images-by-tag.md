---
title: Bulk Delete Images By Tag
---

This command will remove all Docker images that match the target tag. It prints out all images,
filters the output s that it only includes images with the tag in `target_tag`, and then deletes
them with `docker rmi`.

```bash
target_tag="YOUR_TAG"
docker images | awk -v tag="$target_tag" '$2 == tag {print $1 ":" $2}' | xargs docker rmi
```

The command should only match the name of the tag and not the name of the image. If you want to
delete all images tagged with `latest`, it shouldn't remove any images with `latest` in the actual
name. Here you can see I have one image tagged with `latest` (`alpine:latest`) and an image named
`test/latest` but only the image with the tag is removed.

```bash
$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED       SIZE
alpine        3.19      5a3621c427e9   4 weeks ago   7.74MB
alpine        3.20      c157a85ed455   4 weeks ago   8.83MB
alpine        latest    c157a85ed455   4 weeks ago   8.83MB
test/latest   foo       c157a85ed455   4 weeks ago   8.83MB

$ target_tag="latest"
$ docker images | awk -v tag="$target_tag" '$2 == tag {print $1 ":" $2}' | xargs docker rmi
Untagged: alpine:latest

$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED       SIZE
alpine        3.19      5a3621c427e9   4 weeks ago   7.74MB
alpine        3.20      c157a85ed455   4 weeks ago   8.83MB
test/latest   foo       c157a85ed455   4 weeks ago   8.83MB
```

The target tag name also has to be a complete match. It won't delete images with tags that contain
other characters. In this example I have the tags `latest` and `old-latest`, but only `latest` gets
deleted.

```bash
$ docker images
REPOSITORY   TAG          IMAGE ID       CREATED       SIZE
alpine       3.19         5a3621c427e9   4 weeks ago   7.74MB
alpine       old-latest   5a3621c427e9   4 weeks ago   7.74MB
alpine       3.20         c157a85ed455   4 weeks ago   8.83MB
alpine       latest       c157a85ed455   4 weeks ago   8.83MB

$ target_tag="latest"
$ docker images | awk -v tag="$target_tag" '$2 == tag {print $1 ":" $2}' | xargs docker rmi
Untagged: alpine:latest

$ docker images
REPOSITORY   TAG          IMAGE ID       CREATED       SIZE
alpine       3.19         5a3621c427e9   4 weeks ago   7.74MB
alpine       old-latest   5a3621c427e9   4 weeks ago   7.74MB
alpine       3.20         c157a85ed455   4 weeks ago   8.83MB
```
