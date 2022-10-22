#!/usr/bin/env bash

usage() {
    echo "USAGE:"
    echo "  $0 [flags]"
    echo
    echo "FLAGS:"
    echo "-t, --tag string: Set the tag"
    echo "--skip--verification: Skip verification when doing X"
}

# If no arguments are provided, print out the usage information and exit
if [ $# -eq 0 ]; then
    usage
    exit 1
fi

# Prepare some variables that can be set by the flags
SKIP_VERIFICATION=false
TAG=

# Loop through the arguments and handle them
while [ "$1" != "" ]; do
    case $1 in
    # An example of a boolean flag. This flag would not have anything following.
    --skip-verification)
        SKIP_VERIFICATION=true
        ;;
    # An example of a flag that *would* have information after it.
    # This would be passed as `--tag value` or `-t value`
    -t | --tag)
        shift   # Remove the from $1
        TAG=$1  # Now that the flag was moved, $1 should contain the value
        ;;
    -h | --help)
        usage
        ;;
    # This wildcard would catch any flag that has not already been caught.
    # If it wasn't handled, that means it's probably an unknown flag.
    *)
        usage
        exit 1
        ;;
    esac
    shift # After each iteration we shift $1 so the next loop works on a new flag
done

echo "SKIP_VERIFICATION: $SKIP_VERIFICATION"
echo "TAG: $TAG"
