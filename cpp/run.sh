#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/output"

if (( $# != 1 )); then
    echo "A single source file is required as an argument"
    echo "  build.sh foo.cpp"
    exit 1
fi

source_file="$1"
binary_file="$BUILD_DIR/$source_file.out"
mkdir -p "$BUILD_DIR"
clang++ \
    -o "$binary_file" \
    -std=c++17 \
    -g \
    -O1 \
    -fsanitize=address \
    -fno-omit-frame-pointer \
    -fno-optimize-sibling-calls \
    -fsanitize-address-use-after-return=always \
    -fsanitize-address-use-after-scope \
    "$source_file"
"$binary_file"
