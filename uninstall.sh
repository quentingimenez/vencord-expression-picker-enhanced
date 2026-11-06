#!/bin/sh
# Vencord Expression Picker Enhanced - uninstaller for macOS and Linux.
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

detect_platform
ALLOW_INSTALL_ONLY=1
find_vencord_install

say "$APP_NAME - uninstaller"
stop_watcher

# Remove the loader block from the current preload.js instead of restoring an
# old backup: after a Vencord update the backup can be stale and restoring it
# would downgrade Vencord's preload.
cleanup_failed=0
if [ -e "$PRELOAD" ]; then
    if [ ! -f "$PRELOAD" ] || [ ! -r "$PRELOAD" ]; then
        cleanup_failed=1
        warn "Could not read $PRELOAD."
    elif grep -q "$START_MARKER" "$PRELOAD" 2>/dev/null; then
        new_temp "$(dirname "$PRELOAD")"
        cleaned_temp=$REPLY
        if ! strip_loader "$PRELOAD" "$cleaned_temp"; then
            cleanup_failed=1
            warn "The loader block could not be removed completely."
        elif grep -q "$START_MARKER" "$cleaned_temp" 2>/dev/null; then
            cleanup_failed=1
            warn "The loader block could not be removed completely."
        elif write_atomic "$PRELOAD" "$cleaned_temp"; then
            say "Loader removed from preload.js."
        else
            cleanup_failed=1
            warn "The loader block could not be removed completely."
        fi
    else
        say "preload.js has no loader block; leaving it unchanged."
    fi
else
    say "preload.js not found; nothing to clean."
fi

if [ "$cleanup_failed" -eq 1 ]; then
    if [ -f "$BACKUP" ] && { [ ! -s "$PRELOAD" ] || [ ! -f "$PRELOAD" ]; }; then
        cp -p "$BACKUP" "$PRELOAD" 2>/dev/null || true
        say "Restored preload.js from backup because the current file was empty."
    fi
    say ""
    warn "Uninstall incomplete: preload.js could not be cleaned."
    say "The installed files and startup entry were kept so you can retry."
    say "Close Discord/Vencord, then run the uninstaller again."
    start_watcher
    exit 1
fi

remove_startup
rm -f "$BACKUP"
rm -rf "$INSTALL_DIR"

say ""
say "Uninstalled."
say "Restart Discord to finish."
