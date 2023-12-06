## Running Tasks Locally

When you want to run a task locally, or if you just want to quickly test a command, you can simply set the connection to `local`. When running the playbook using `ansible-playbook <path>`, you will likly see a couple warnings since there isn't an inventory file or anything.

```yaml
- hosts: localhost
  connection: local
  tasks:
    - shell: echo 'hello world'
```
