#!/bin/sh
# Builds the macOS/Linux manual-install archive and its SHA-256 checksum.
set -eu

root=$(CDPATH= cd "$(dirname "$0")/.." && pwd -P)
cd "$root"

version=$(node -e "process.stdout.write(require('./package.json').version)")
dist="$root/dist"
stage=$(mktemp -d "${TMPDIR:-/tmp}/VencordExpressionPickerEnhanced.XXXXXX")
archive_name="VencordExpressionPickerEnhanced-v$version-unix.tar.gz"
archive="$dist/$archive_name"
sums="$dist/SHA256SUMS-unix.txt"

cleanup() {
    rm -rf "$stage"
}
trap cleanup EXIT HUP INT TERM

node "$root/scripts/build-renderer.js"

mkdir -p "$stage/src" "$stage/assets" "$stage/docs" "$dist"
chmod 755 "$stage"
cp "$root/install.sh" "$root/uninstall.sh" "$stage/"
cp "$root/src/watcher.sh" "$root/src/unix-common.sh" "$root/src/loader.js" "$stage/src/"
cp "$root/dist/picker-resize.js" "$stage/"
cp "$root/README.md" "$root/LICENSE" "$root/THIRD_PARTY_NOTICES.md" "$stage/"
cp "$root/docs/AUDIT.md" "$stage/docs/"
cp "$root/assets/preview.svg" "$stage/assets/"
chmod 755 "$stage/install.sh" "$stage/uninstall.sh" "$stage/src/watcher.sh"

rm -f "$archive"
tar -czf "$archive" -C "$stage" .

if command -v sha256sum >/dev/null 2>&1; then
    hash=$(sha256sum "$archive" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
    hash=$(shasum -a 256 "$archive" | awk '{print $1}')
else
    printf 'Error: neither sha256sum nor shasum is available.\n' >&2
    exit 1
fi
printf '%s  %s\n' "$hash" "$archive_name" >"$sums"

printf 'Release artifacts ready:\n'
ls -l "$archive" "$sums"
