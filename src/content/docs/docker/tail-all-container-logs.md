---
title: Tail All Container Logs
---

The script below will print recent logs from all of the containers that are currently on the host.
The number of logs to query can be controlled with `-n/--number` just like with `tail` and
`docker logs`. If you want to go container-by-container and read the logs from the previous
container before moving on, you can use the `-w/--wait` flag. This will cause the script to prompt
you for confirmation before moving on to the next container.

```bash
#!/usr/bin/env bash
set -euo pipefail

DEFAULT_LOG_NUMBER=10
LOG_NUMBER="$DEFAULT_LOG_NUMBER"
SHOULD_WAIT="false"

print_usage() {
    echo "USAGE:"
    echo "  $(basename "$0") [OPTIONS...]"
    echo
    echo "OPTIONS:"
    echo "  -h, --help          Print this help message"
    echo "  -w, --wait          Wait for confirmation before moving on to the next container"
    echo "  -n, --number int    Set the number of logs to print for each container (default: $DEFAULT_LOG_NUMBER)"
}

handle_missing_arg() {
    echo "Missing argument: $1"
    print_usage
    exit 1
}

is_integer() {
    [[ "$1" =~ ^[0-9]+$ ]]
}

parse_arguments() {
    while [[ $# -ne 0 ]] && [[ "$1" != "" ]]; do
        case $1 in
        -h | --help)
            print_usage
            exit
            ;;
        -w | --wait)
            SHOULD_WAIT="true"
            ;;
        -n | --number)
            shift
            if [[ $# -eq 0 ]]; then handle_missing_arg "tag"; fi
            if ! is_integer "$1"; then echo "$1 is not an integer"; exit 1; fi
            LOG_NUMBER="$1"
            ;;
        *)
            echo "Unknown argument: $1"
            print_usage
            exit 1
            ;;
        esac
        shift
    done
}

get_all_containers() {
    docker ps --all --format '{{.Names}}' | sort
}

get_container_status() {
    local container_name="$1"
    docker ps --all --format '{{.Status}}' --filter "name=$container_name"
}

print_header() {
    local style='\033[37;44;1m' # blue background, white foreground
    local reset='\033[0m'
    echo -e "${style} ${1} ${reset}"
}

print_container_logs() {
    local container="$1"

    if [[ "$SHOULD_WAIT" == "true" ]]; then
        echo "Next container: $container"
        read -r -n 1 -p "Press enter to continue to the next container or any other character to cancel: "
        echo
        if [[ "$REPLY" != "" ]]; then
            echo "Quitting"
            exit 1
        fi
    fi

    print_header "Logs for '$container_name' [$(get_container_status "$container_name")]"
    docker logs -n "$LOG_NUMBER" "$container_name"
    echo
}

main() {
    parse_arguments "$@"
    # This loop is explicitly changing the file descriptor used for data to 3 so
    # that it doesn't use stdin which is needed by the 'read' command. Without
    # it this loop and the 'read' command used to confirm moving to the next
    # container would both use stdin which breaks the read command
    while IFS= read -r container_name <&3; do
        print_container_logs "$container_name"
    done 3< <(docker ps --all --format '{{.Names}}' | sort)
}

main "$@"
```
