#!/usr/bin/env bash

# This Bash FAQ page has a ton of good information about this (and other topics)
# https://mywiki.wooledge.org/BashFAQ/001

# Read a file line-by-line
FILE="/tmp/some-file.txt"
echo -e "line 1\nline 2" > "$FILE"

while IFS= read -r line; do
    printf '%s\n' "$line"
done < "$FILE"

rm "$FILE"

# You can also use different inputs like a variable
VARIABLE="foo"$'\n'"bar"

while IFS= read -r line; do
    printf '%s\n' "$line"
done <<< "$VARIABLE"

# Or a here document
while IFS= read -r line; do
    printf '%s\n' "$line"
done << EOF
hello
world
EOF

# You can also use the output of a command
# This will use a subshell which means any state changes wont persist
echo 'command in a subshell' | while IFS= read -r line; do
    printf '%s\n' "$line"
done

# This uses process substitution which will allow you to change state
while IFS= read -r line; do
    printf '%s\n' "$line"
done < <(echo "command using process substitution")
