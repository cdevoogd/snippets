---
title: Loading GitHub Keys for SSH
---

GitHub provides an API in the format `https://github.com/<username>.keys` that allows you to easily
query for the public keys that are tied to a user's account. This can be super useful for quickly
importing your SSH keys onto a machine using a simple `curl` command:

```bash
curl https://github.com/<username>.keys > ~/.ssh/authorized_keys
```

Sometimes, however, you want to import the keys of multiple users in bulk and using Ansible makes a
bit more sense. I wanted to do just that, but had a few more requirements that I felt the need to
handle:
1. The GitHub URL should be queried from the host that is running the playbook in case the machine
that's being configured doesn't have internet access.
2. The keys for a user should only be queried once regardless of the number of hosts being
configured. The keys are not expected to change during the run.

In the end, I ended up with a playbook similar to this:

```yaml
- name: Setup authorized_keys using GitHub public keys
  hosts: all
  strategy: linear
  vars:
    user: "{{ ansible_env.SUDO_USER | default(ansible_user_id) }}"
    github_accounts:
      - userA
      - userB
  tasks:
    - name: "Preload public keys" # noqa: run-once[task] Linear (the default) is explicitly set
      run_once: true
      connection: local
      delegate_to: localhost
      block:
        - name: Query the keys for all GitHub accounts
          ansible.builtin.uri:
            url: https://github.com/{{ item }}.keys
            return_content: true
          register: key_responses
          loop: "{{ github_accounts }}"

        - name: Format the keys into a dictionary
          ansible.builtin.set_fact:
            keys: "{{ keys | default({}) | combine({item.item: item.content}) }}"
          loop: "{{ key_responses.results }}"
          loop_control:
            label: "{{ item.item }}"

    - name: Add GitHub public keys as SSH authorized keys
      ansible.posix.authorized_key:
        user: "{{ user }}"
        key: "{{ item.value }}"
        comment: "GitHub user {{ item.key }} via Ansible"
        state: present
      loop: "{{ keys | dict2items }}"
      loop_control:
        label: "{{ item.key }}"
```

For a quick idea on what this playbook is doing, we can look at what the different responses and
variables would look like. When making a response to the GitHub endpoint, you will recieve a
response that just has the public keys listed out in plaintext. The format is the same as what is
used in SSH's `authorized_keys` file. A user may also have multiple keys.

```
GET https://github.com/userA.keys

ssh-ed25519 AAAA...
ssh-rsa AAAA....
```

The playbook makes these request on the local machine (`connection` and `delegate_to`) and only does
so once during the entire run (`run_once`). It loops over each of the GitHub accounts and stores
the responses in a single `key_responses` variable. Here's an example of what that looks like with a
lot of the extra details trimmed out.

```json
{
  "key_responses": {
    "results": [
      {
        "status": 200,
        "item": "userA",
        "url": "https://github.com/userA.keys",
        "content": "ssh-ed25519 AAAA...\nssh-rsa AAAA...\n"
      },
      {
        "status": 200,
        "item": "userB",
        "url": "https://github.com/userB.keys",
        "content": "ssh-ed25519 AAAA...\n"
      }
    ]
  }
}
```

We can then loop over those results and format them into a dictionary that maps the user to their
keys from the responses.

```json
{
  "keys": {
    "userA": "ssh-ed25519 AAAA...\nssh-rsa AAAA...\n",
    "userB": "ssh-ed25519 AAAA...\n"
  }
}
```

Finally, the playbook just iterates over that dictionary and ensures that the keys for each user are
present in the `authorized_keys` file. Information about the user is added as a comment so that you
can easily tell which keys belong to which user.
