---
title: Argument Parsing
---

Below is an example script that shows how to parse command-line flags in bash. Included is a help flag, a flag for toggling and option, and a flag that's used to pass additional information like a file path (or in the examples case a tag). The example also demonstrates how to properly handle shifting and checking arguments to prevent errors when using the `set -u` option in bash.

```bash
#!/usr/bin/env bash
set -euo pipefail

# Prepare some variables that can be set by the flags
SKIP_VERIFICATION=false
TAG=

print_usage() {
    echo "USAGE:"
    echo "  $0 [OPTIONS...]"
    echo
    echo "OPTIONS:"
    echo "  -h, --help            Print this help message"
    echo "  -t, --tag string      Set the tag"
    echo "  --skip-verification   Skip verification when doing X"
}

handle_missing_arg() {
    echo "Missing argument: $1"
    print_usage
    exit 1
}

parse_arguments() {
    while [ $# -ne 0 ] && [ "$1" != "" ]; do
        case $1 in
        -h | --help)
            print_usage
            ;;
        # An example of a boolean flag. This flag would not have anything following.
        --skip-verification)
            SKIP_VERIFICATION=true
            ;;
        # An example of a flag that has a value following it
        -t | --tag)
            # Shift forward so the associated value is in $1
            shift
            # Make sure the user actually passed a value
            if [[ $# -eq 0 ]]; then handle_missing_arg "tag"; fi
            # Now we can set it
            TAG=$1
            ;;
        # This wildcard would catch any flag that has not already been caught.
        # If it wasn't handled, that means it's probably an unknown flag.
        *)
            echo "Unknown argument: $1"
            print_usage
            exit 1
            ;;
        esac
        # After each iteration we shift $1 so the next loop works on a new flag
        shift
    done
}

main() {
    # In this example, the script requires that arguments be passed
    # If there are none, print the help text and exit
    if [ $# -eq 0 ]; then
        print_usage
        exit 1
    fi

    parse_arguments "$@"
    echo "SKIP_VERIFICATION: $SKIP_VERIFICATION"
    echo "TAG: $TAG"
}

main "$@"
```
