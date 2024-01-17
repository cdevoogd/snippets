## Trim Files

Using the `head` and `tail` commands, you can quickly trim files down. This may be useful for something like a long log file where you only care about the logs after some specific line.

### Get First N Lines

```bash
head -n 3 "$file"
```

### Get Last N Lines

```bash
tail -n 3 "$file"
```

### Get All Lines After Line N

You can use tail with `-n +<num>` to get the last `[num]` lines of the file. Note that that the `+` is important here as it signals to `tail` that the number is relative to the beginning of the file and not the end.

```bash
tail -n +4 "$file"
```
