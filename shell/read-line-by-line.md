## Read and Process Line by Line

There are a few different methods to process a file or command output line by line. In addition to this document, [this Bash FAQ page](https://mywiki.wooledge.org/BashFAQ/001) has a ton of good information about this (and other topics).

### Reading From a File

```bash
file="/tmp/some-file.txt"
while IFS= read -r line; do
    printf '%s\n' "$line"
done < "$file"
```

### Reading From a Variable

```bash
variable="foo"$'\n'"bar"
while IFS= read -r line; do
    printf '%s\n' "$line"
done <<< "$variable"
```

### Reading From a Here-Document

```bash
while IFS= read -r line; do
    printf '%s\n' "$line"
done << EOF
hello
world
EOF
```

### Reading Output From a Command

This approach will use a subshell which means that if you try to change state in the script it won't
work.

```bash
echo 'command in a subshell' | while IFS= read -r line; do
    printf '%s\n' "$line"
done
```

If you do want the ability ot change state you can use process substitution instead.

```bash
while IFS= read -r line; do
    printf '%s\n' "$line"
done < <(echo "command using process substitution")
```
