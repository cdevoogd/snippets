---
title: Accessing Docker Over SSH
---

In [Docker 18.09](https://docs.docker.com/engine/release-notes/18.09/#18090), the Docker CLI was
updated to [support remote connections over SSH](https://github.com/docker/cli/pull/1014). If your
local machine and the remote machine have a Docker version higher than 18.09, you can run docker
commands over SSH.

If you are using the `docker` CLI directly, you can pass the `-H` or `--host` flag to run commands
like this:

```shell
$ docker -H ssh://cam@testing ps -a
CONTAINER ID   IMAGE         COMMAND     CREATED         STATUS                     PORTS     NAMES
b86624ce8dac   alpine:3.20   "/bin/sh"   3 seconds ago   Exited (0) 2 seconds ago             hello_from_testing
```

You can also override the `DOCKER_HOST` environment variable to accomplish the same thing. This is
particularly useful if you aren't using the Docker CLI directly, but rather another tool like
[lazydocker](https://github.com/jesseduffield/lazydocker).

```shell
❯ DOCKER_HOST=ssh://cam@testing docker ps -a
CONTAINER ID   IMAGE         COMMAND     CREATED          STATUS                     PORTS     NAMES
b7f8bf27efb3   alpine:3.20   "/bin/sh"   10 seconds ago   Exited (0) 9 seconds ago             hello_from_testing
```

You can also just `export` the overridden variable to persist the value when you want to run multiple commands,

```shell
$ export DOCKER_HOST=ssh://cam@testing
$ docker ps -a
CONTAINER ID   IMAGE         COMMAND     CREATED         STATUS                     PORTS     NAMES
40c70193bd5e   alpine:3.20   "/bin/sh"   3 seconds ago   Exited (0) 2 seconds ago             hello_from_testing

$ docker rm hello_from_testing
hello_from_testing

$ docker ps -a
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```
