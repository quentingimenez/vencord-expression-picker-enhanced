#!/bin/sh
# Vencord Expression Picker Enhanced - installer for macOS and Linux.
set -eu

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd -P)

common="$script_dir/unix-common.sh"
if [ ! -f "$common" ]; then
    common="$script_dir/src/unix-common.sh"
fi
if [ ! -f "$common" ]; then
    printf 'Error: missing unix-common.sh.\n' >&2
    exit 1
fi
. "$common"

FROM_WATCHER=0
for argument in "$@"; do
    case "$argument" in
        --from-watcher) FROM_WATCHER=1 ;;
        -h | --help)
            cat <<EOF
Usage: sh install.sh [--from-watcher]

Installs Vencord Expression Picker Enhanced for Discord desktop patched by
the official Vencord installer on macOS or Linux.

Options:
  --from-watcher  Internal: re-apply the loader without restarting the watcher.
  -h, --help      Show this help.
EOF
            exit 0
            ;;
        *) die "Unknown option: $argument" ;;
    esac
done

detect_platform
find_vencord_install

say "$APP_NAME - installer"
say "Vencord: $CONFIG_ROOT"

picker_source=$(resolve_source "picker-resize.js") || die "Missing picker-resize.js. Run npm run build first."
watcher_source=$(resolve_source "watcher.sh") || die "Missing watcher.sh."
loader_source=$(resolve_source "loader.js") || die "Missing loader.js."
uninstaller_source=$(resolve_source "uninstall.sh") || die "Missing uninstall.sh."
common_source=$(resolve_source "unix-common.sh") || die "Missing unix-common.sh."
installer_source="$script_dir/install.sh"
[ -f "$installer_source" ] || die "Missing install.sh."

if [ "$FROM_WATCHER" -eq 0 ]; then
    stop_watcher
fi

mkdir -p "$INSTALL_DIR" || die "Could not create $INSTALL_DIR."
copy_if_changed "$picker_source" "$INSTALL_DIR/picker-resize.js" 644
copy_if_changed "$watcher_source" "$INSTALL_DIR/watcher.sh" 755
copy_if_changed "$loader_source" "$INSTALL_DIR/loader.js" 644
copy_if_changed "$uninstaller_source" "$INSTALL_DIR/uninstall.sh" 755
copy_if_changed "$common_source" "$INSTALL_DIR/unix-common.sh" 644
copy_if_changed "$installer_source" "$INSTALL_DIR/install.sh" 755

# Remove a previous loader before appending the current one so upgrades also
# refresh the loader code. Keep a backup of the untouched preload only when
# this is a fresh installation.
cleaned_source="$PRELOAD"
if grep -q "$START_MARKER" "$PRELOAD" 2>/dev/null; then
    new_temp "$(dirname "$PRELOAD")"
    cleaned_temp=$REPLY
    if ! strip_loader "$PRELOAD" "$cleaned_temp"; then
        die "Refusing to patch preload.js: the existing loader block is incomplete."
    fi
    cleaned_source="$cleaned_temp"
else
    write_atomic "$BACKUP" "$PRELOAD" || die "Could not back up preload.js."
fi

new_temp "$(dirname "$PRELOAD")"
patched_temp=$REPLY
cp -p "$PRELOAD" "$patched_temp" || die "Could not read $PRELOAD."
cat "$cleaned_source" >"$patched_temp" || die "Could not prepare $patched_temp."

# Ensure the loader starts on a new line even when preload.js does not end
# with a newline.
if [ -s "$patched_temp" ] && [ -n "$(tail -c 1 "$patched_temp")" ]; then
    printf '\n' >>"$patched_temp"
fi

loader_content=$(cat "$loader_source") || die "Could not read $loader_source."
case "$loader_content" in
    "/* VC_PICKER_RESIZE_LOADER_START */"*) ;;
    *) die "loader.js is missing the start marker." ;;
esac
case "$loader_content" in
    *"/* VC_PICKER_RESIZE_LOADER_END */") ;;
    *) die "loader.js is missing the end marker." ;;
esac
printf '%s' "$loader_content" >>"$patched_temp"

start_count=$(count_marker "$patched_temp" "$START_MARKER")
end_count=$(count_marker "$patched_temp" "$END_MARKER")
if [ "$start_count" -ne 1 ] || [ "$end_count" -ne 1 ]; then
    die "Refusing to patch preload.js: expected exactly one loader block, found $start_count start and $end_count end markers."
fi

cleaned_size=$(wc -c <"$cleaned_source" | tr -d ' ')
if [ "$cleaned_size" -gt 0 ]; then
    if ! head -c "$cleaned_size" "$patched_temp" | cmp -s - "$cleaned_source"; then
        die "Refusing to patch preload.js: the original content was not preserved."
    fi
fi
if ! tail -n 1 "$patched_temp" | grep -q "$END_MARKER"; then
    die "Refusing to patch preload.js: the loader was not appended at the end of the file."
fi

mv -f "$patched_temp" "$PRELOAD" || die "Could not replace $PRELOAD."
say "Loader installed in preload.js."

if [ "$FROM_WATCHER" -eq 0 ]; then
    start_watcher
fi

say ""
say "Installed successfully."
say "1. Restart Discord."
say "2. Open the GIF picker and use the small grip in its top-left corner."
say ""
say "Uninstall: sh \"$INSTALL_DIR/uninstall.sh\""
