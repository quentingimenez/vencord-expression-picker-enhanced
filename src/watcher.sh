#!/bin/sh
# Keeps the enhanced expression picker loader present after Vencord updates.
# Started at login by launchd on macOS or the XDG autostart entry on Linux.
set -u

script_dir=$(CDPATH= cd "$(dirname "$0")" && pwd -P)
install_dir=$script_dir
case "$script_dir" in
    */dist/picker-resize) dist_dir=${script_dir%/picker-resize} ;;
    *) dist_dir=${script_dir%/picker-resize}/dist ;;
esac
preload="$dist_dir/preload.js"
installer="$install_dir/install.sh"
log="$install_dir/watcher.log"
lock_dir="$install_dir/watcher.lock"
pid_file="$install_dir/watcher.pid"
marker="VC_PICKER_RESIZE_LOADER_START"
max_log_bytes=1048576
last_throttled=0

log_message() {
    if [ -f "$log" ]; then
        size=$(wc -c <"$log" 2>/dev/null || printf '0')
        size=$(printf '%s' "$size" | tr -d ' ')
        if [ "${size:-0}" -gt "$max_log_bytes" ]; then
            mv -f "$log" "$log.1" 2>/dev/null || true
        fi
    fi
    printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >>"$log" 2>/dev/null || true
}

# Avoid filling the log with one line every two seconds when Vencord is absent.
log_throttled() {
    now=$(date +%s)
    if [ $((now - last_throttled)) -ge 300 ]; then
        last_throttled=$now
        log_message "$*"
    fi
}

cleanup() {
    rm -f "$pid_file" 2>/dev/null || true
    rm -f "$lock_dir/pid" 2>/dev/null || true
    rmdir "$lock_dir" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP

# Prevent two watcher instances from fighting over preload.js. A stale lock
# (dead PID) is removed and retried once.
acquire_lock() {
    if mkdir "$lock_dir" 2>/dev/null; then
        printf '%s\n' "$$" >"$lock_dir/pid"
        printf '%s\n' "$$" >"$pid_file"
        return 0
    fi

    old_pid=$(cat "$lock_dir/pid" 2>/dev/null || true)
    case "$old_pid" in
        '' | *[!0-9]*) old_pid="" ;;
    esac
    if [ -n "$old_pid" ] && kill -0 "$old_pid" 2>/dev/null; then
        return 1
    fi

    rm -rf "$lock_dir" 2>/dev/null || true
    rm -f "$pid_file" 2>/dev/null || true
    if mkdir "$lock_dir" 2>/dev/null; then
        printf '%s\n' "$$" >"$lock_dir/pid"
        printf '%s\n' "$$" >"$pid_file"
        return 0
    fi
    return 1
}

ensure_patch() {
    [ -f "$preload" ] || return 0
    [ -r "$preload" ] || return 0
    if grep -q "$marker" "$preload" 2>/dev/null; then
        return 0
    fi

    attempt=1
    while [ "$attempt" -le 20 ]; do
        if /bin/sh "$installer" --from-watcher >>"$log" 2>&1; then
            log_message "Loader re-applied (attempt $attempt)"
            return 0
        else
            status=$?
            log_message "Installer exited with code $status (attempt $attempt)"
        fi
        attempt=$((attempt + 1))
        sleep 1
    done
    log_message "Failed to re-apply loader"
    return 1
}

if ! acquire_lock; then
    exit 0
fi

log_message "Watcher started for $preload"
ensure_patch

last_signature=""
while :; do
    if [ -f "$preload" ]; then
        signature=$(cksum "$preload" 2>/dev/null || true)
        if [ -n "$signature" ] && [ "$signature" != "$last_signature" ]; then
            last_signature=$signature
            ensure_patch
        fi
    else
        log_throttled "Waiting for $preload"
    fi
    sleep 2
done
