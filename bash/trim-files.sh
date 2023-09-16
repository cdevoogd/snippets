#!/usr/bin/env bash

tmp_file="/tmp/trim-files.txt"
cat << EOF > "$tmp_file"
1
2
3
4
5
6
7
8
9
10
EOF

echo "Get first 3 lines using 'head'"
head -n 3 "$tmp_file"

echo "Get last 3 lines using 'tail'"
tail -n 3 "$tmp_file"

# You can use tail with -n +<num> to get the last <num> lines of the file. Note that the + is
# important as it signals to tail that the number is relative to the beginning of the file and
# not the end.
echo "Get all lines from line 4 onwards"
tail -n +4 "$tmp_file"

rm "$tmp_file"
