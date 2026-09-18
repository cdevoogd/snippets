---
title: Argument Parsing
---

Below is an example script that shows how to parse command-line flags in bash. Included is a help flag, a flag for toggling and option, and a flag that's used to pass additional information like a file path (or in the example's case a tag). The example also demonstrates how to properly handle shifting and checking arguments to prevent errors when using the `set -u` option in bash.

```bash
#!/usr/bin/env bash
set -euo pipefail

SKIP_VERIFICATION=false
TAG=
POSITIONAL_ARGS=()

print_usage() {
    cat <<EOF
USAGE:
  $(basename "$0") [OPTIONS...] [--] [ARGS...]

OPTIONS:
  -h, --help            Print this help message
  -t, --tag string      Set the tag
  --skip-verification   Skip verification when doing X
EOF
}

handle_missing_arg() {
    echo "Missing argument: $1" >&2
    exit 1
}

parse_arguments() {
    while (( $# > 0 )); do
        case $1 in
            -h | --help)
                print_usage
                exit 0
                ;;
            # Example of a basic boolean flag
            --skip-verification)
                SKIP_VERIFICATION=true
                ;;
            # Example of a flag with a value following it. This shifts forward to get the value
            # following the flag into $1, checks that there is a value there, and then sets it.
            -t | --tag)
                shift
                if (( $# == 0 )); then handle_missing_arg "tag"; fi
                TAG="$1"
                ;;
            # If you want to support the --flag=value syntax, you can do something like this.
            --tag=*)
                TAG="${1#*=}"
                ;;
            # This helps to add support for `--` which is typically used to signal to stop parsing
            # flags. Everything after it should be treated as a positional argument.
            --)
                shift
                POSITIONAL_ARGS+=("$@")
                break
                ;;
            -*)
                echo "Unknown flag: $1" >&2
                exit 1
                ;;
            *)
                POSITIONAL_ARGS+=("$1")
                ;;
        esac
        shift
    done
}

main() {
    parse_arguments "$@"
    echo "SKIP_VERIFICATION: $SKIP_VERIFICATION"
    echo "TAG: $TAG"
    echo "POSITIONAL_ARGS: ${POSITIONAL_ARGS[*]:-}"
}

main "$@"
```
