#!/usr/bin/env bash

# This script requires that the Bitwarden CLI is installed. If you have not already set your
# BW_SESSION environment variable, it will prompt you to unlock your vault.
#
# This script searches your vault for items that have http URLs and replaces them with https
# URLs. A lot of sites seem to add with http, even if you were using the https site when you
# created the entry. Bitwarden has a page that complains about these URLs and urges you to
# replace them with their https counterparts, so that is what this script does. It searches
# the vault for items that match the http pattern, then loop through each one, replaces http
# with https, and updates bitwarden with the updated item.

MATCH_PATTERN="http://"
REPLACE_PATTERN="https://"

main() {
    if [ -z "$BW_SESSION" ]; then
        # Unlock the vault
        export BW_SESSION=$(bw unlock --raw)
    fi

    # Get a list of all items that have an http URL. The -c argument is added to jq so that each
    # entry is compact and on its own line. This will allow us to loop over each line.
    local items=$(bw list items --search "$MATCH_PATTERN" | jq -c '.[]')

    while IFS= read -r item; do
        # Replace all http URLs with https
        local updated=$(echo "$item" | sed "s|$MATCH_PATTERN|$REPLACE_PATTERN|g")
        local id=$(echo "$updated" | jq -r '.id')
        local urls=$(echo "$updated" | jq -r -c '.login.uris[].uri' | tr '\n' ',')
        echo "$id: $urls"
        echo "$updated" | bw encode | bw edit item "$id" > /dev/null
    done <<< "$items"
}

main
