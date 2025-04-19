---
title: Run Multiple Commands Over SSH
---

## Using a Heredoc

If you just want to run multiple commands at the same time, you can use the `ssh` connection to run
`bash`, and then just use a heredoc to send a shell script.

```bash
ssh user@some-host /bin/bash << EOF
    set -euo pipefail
    pwd
    ls
    echo "multiple commands"
EOF
```

## Using an SSH Control Socket

You can also create a control socket with `ssh` and reuse that connection to send multiple commands.
Here are some basic commands to create and interact with a control socket:

```bash
# Create the control socket
ssh -f -N -o 'ControlMaster=yes' -S "$HOME/.ssh/ssh-%r-%h-%p" some-host
# Send a command using the socket
ssh -S "$HOME/.ssh/ssh-%r-%h-%p" some-host pwd
# Check that the socket is still connected
ssh -S "$HOME/.ssh/ssh-%r-%h-%p" -O check some-host
# Close the control socket
ssh -S "$HOME/.ssh/ssh-%r-%h-%p" -O exit some-host
```

Here's an example scipt that creates a socket, runs some commands, and then closes it:

```bash
remote_host="some-host"
ssh_socket="$HOME/.ssh/ssh-%r-%h-%p"

ssh_sock() { ssh -S "$ssh_socket" "$@"; }
close_control_socket() { ssh_sock -O exit 2> /dev/null; }

ssh_sock -f -N -o 'ControlMaster=yes' "$remote_host"
trap 'close_control_socket' SIGINT SIGHUP SIGTERM EXIT

ssh_sock "$remote_host" pwd
ssh_sock "$remote_host" ls
```
