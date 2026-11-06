#!/bin/sh
# Shared helpers for the macOS/Linux installer and uninstaller.
# Keep the loader removal and atomic-write behavior in sync with install.ps1
# and uninstall.ps1. POSIX sh only: no bash arrays or GNU-specific flags.

APP_NAME="Vencord Expression Picker Enhanced"
APP_ID="com.quentingimenez.vencord-expression-picker-enhanced"
START_MARKER="VC_PICKER_RESIZE_LOADER_START"
END_MARKER="VC_PICKER_RESIZE_LOADER_END"

say() {
    printf '%s\n' "$*"
}

warn() {
    printf 'Warning: %s\n' "$*" >&2
}

die() {
    printf 'Error: %s\n' "$*" >&2
    exit 1
}

TEMP_FILES=""
cleanup() {
    old_ifs=$IFS
    IFS='
'
    for file in $TEMP_FILES; do
        [ -n "$file" ] && rm -f "$file"
    done
    IFS=$old_ifs
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP

new_temp() {
    directory=$1
    REPLY=$(mktemp "$directory/.vencord-picker.XXXXXX") || die "Could not create a temporary file in $directory."
    TEMP_FILES="$TEMP_FILES$REPLY
"
}

detect_platform() {
    case "$(uname -s)" in
        Darwin) PLATFORM=macos ;;
        Linux) PLATFORM=linux ;;
        *) die "Unsupported operating system: $(uname -s). This installer supports macOS and Linux." ;;
    esac
}

CANDIDATES=""
append_candidate() {
    [ -n "$1" ] || return 0
    CANDIDATES="$CANDIDATES$1
"
}

find_vencord_install() {
    [ -n "${HOME:-}" ] || die "HOME is not set."
    CANDIDATES=""

    # When this script runs from <Vencord>/dist/picker-resize (or the legacy
    # <Vencord>/picker-resize), its location tells us exactly which Vencord
    # tree is in use, including custom or Flatpak paths.
    case "$script_dir" in
        */dist/picker-resize) append_candidate "${script_dir%/dist/picker-resize}" ;;
        */picker-resize) append_candidate "${script_dir%/picker-resize}" ;;
    esac

    append_candidate "${VENCORD_DIR:-}"
    append_candidate "${VENCORD_USER_DATA_DIR:-}"
    if [ -n "${DISCORD_USER_DATA_DIR:-}" ]; then
        append_candidate "$(dirname "$DISCORD_USER_DATA_DIR")/VencordData"
    fi

    case "$PLATFORM" in
        macos)
            append_candidate "$HOME/Library/Application Support/Vencord"
            append_candidate "${XDG_CONFIG_HOME:-$HOME/.config}/Vencord"
            append_candidate "$HOME/Library/Application Support/VencordData"
            ;;
        linux)
            append_candidate "${XDG_CONFIG_HOME:-$HOME/.config}/Vencord"
            append_candidate "$HOME/.var/app/com.discordapp.Discord/config/Vencord"
            append_candidate "$HOME/.var/app/com.discordapp.DiscordCanary/config/Vencord"
            append_candidate "$HOME/.var/app/com.discordapp.DiscordPTB/config/Vencord"
            append_candidate "${XDG_CONFIG_HOME:-$HOME/.config}/VencordData"
            append_candidate "$HOME/.var/app/com.discordapp.Discord/config/VencordData"
            ;;
    esac

    CONFIG_ROOT=""
    old_ifs=$IFS
    IFS='
'
    for candidate in $CANDIDATES; do
        if [ -f "$candidate/dist/preload.js" ]; then
            CONFIG_ROOT=$candidate
            break
        fi
        if [ "${ALLOW_INSTALL_ONLY:-0}" = 1 ] && { [ -d "$candidate/dist/picker-resize" ] || [ -d "$candidate/picker-resize" ]; }; then
            CONFIG_ROOT=$candidate
            break
        fi
    done
    IFS=$old_ifs

    if [ -z "$CONFIG_ROOT" ]; then
        printf 'Vencord was not found. Looked for dist/preload.js in:\n' >&2
        old_ifs=$IFS
        IFS='
'
        for candidate in $CANDIDATES; do
            [ -n "$candidate" ] && printf '  %s\n' "$candidate" >&2
        done
        IFS=$old_ifs
        die "Install Vencord desktop first (official installer)."
    fi

    PRELOAD="$CONFIG_ROOT/dist/preload.js"
    INSTALL_DIR="$CONFIG_ROOT/dist/picker-resize"
    BACKUP="$PRELOAD.bak-picker-resize"
    WATCHER="$INSTALL_DIR/watcher.sh"
    INSTALLER="$INSTALL_DIR/install.sh"
    VENCORD_CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
    LAUNCH_AGENT="$HOME/Library/LaunchAgents/$APP_ID.plist"
    AUTOSTART_FILE="$VENCORD_CONFIG_HOME/autostart/vencord-expression-picker-enhanced.desktop"
}

resolve_source() {
    for directory in "$script_dir/dist" "$script_dir/src" "$script_dir"; do
        if [ -f "$directory/$1" ]; then
            printf '%s\n' "$directory/$1"
            return 0
        fi
    done
    return 1
}

# Replace a file atomically and verify the written content. preload.js is a
# critical Vencord file: a power loss or a full disk must never leave it
# truncated. Returns non-zero on failure so the uninstaller can keep the
# installation in place.
write_atomic() {
    target=$1
    source_file=$2
    directory=$(dirname "$target")
    new_temp "$directory"
    temp=$REPLY
    if [ -e "$target" ]; then
        cp -p "$target" "$temp" || {
            warn "Could not read $target."
            return 1
        }
        cat "$source_file" >"$temp" || {
            warn "Could not write $temp."
            return 1
        }
    else
        cat "$source_file" >"$temp" || {
            warn "Could not write $temp."
            return 1
        }
    fi
    if ! cmp -s "$source_file" "$temp"; then
        warn "Atomic write verification failed for $target."
        return 1
    fi
    mv -f "$temp" "$target" || {
        warn "Could not replace $target."
        return 1
    }
}

copy_if_changed() {
    source_file=$1
    destination=$2
    mode=$3
    if [ "$source_file" = "$destination" ]; then
        chmod "$mode" "$destination" 2>/dev/null || true
        return 0
    fi
    if [ -f "$destination" ] && cmp -s "$source_file" "$destination"; then
        chmod "$mode" "$destination" 2>/dev/null || true
        return 0
    fi
    new_temp "$(dirname "$destination")"
    temp=$REPLY
    cat "$source_file" >"$temp" || die "Could not copy $source_file."
    chmod "$mode" "$temp" || die "Could not set permissions on $destination."
    mv -f "$temp" "$destination" || die "Could not replace $destination."
}

strip_loader() {
    input=$1
    output=$2
    awk '
        /VC_PICKER_RESIZE_LOADER_START/ { inside = 1; next }
        inside && /VC_PICKER_RESIZE_LOADER_END/ { inside = 0; next }
        inside { next }
        { print }
        END { if (inside) exit 3 }
    ' "$input" >"$output"
}

count_marker() {
    count=$(grep -c "$2" "$1" 2>/dev/null || true)
    printf '%s\n' "${count:-0}"
}

xml_escape() {
    printf '%s' "$1" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g'
}

escape_desktop_exec() {
    printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/`/\\`/g' -e 's/\$/\\$/g' -e 's/%/%%/g'
}

write_launch_agent() {
    mkdir -p "$HOME/Library/LaunchAgents" || die "Could not create the LaunchAgents folder."
    new_temp "$HOME/Library/LaunchAgents"
    temp=$REPLY
    {
        cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$APP_ID</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/sh</string>
        <string>$(xml_escape "$WATCHER")</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>$(xml_escape "$INSTALL_DIR")</string>
    <key>StandardOutPath</key>
    <string>/dev/null</string>
    <key>StandardErrorPath</key>
    <string>/dev/null</string>
</dict>
</plist>
EOF
    } >"$temp"
    mv -f "$temp" "$LAUNCH_AGENT" || die "Could not write $LAUNCH_AGENT."
}

write_autostart() {
    directory=$(dirname "$AUTOSTART_FILE")
    mkdir -p "$directory" || die "Could not create $directory."
    new_temp "$directory"
    temp=$REPLY
    {
        printf '%s\n' '[Desktop Entry]'
        printf '%s\n' 'Type=Application'
        printf '%s\n' 'Name=Vencord Expression Picker Enhanced'
        printf '%s\n' 'Comment=Keeps the expression picker loader installed after Vencord updates'
        printf 'Exec=/bin/sh "%s"\n' "$(escape_desktop_exec "$WATCHER")"
        printf '%s\n' 'Terminal=false'
        printf '%s\n' 'NoDisplay=true'
        printf '%s\n' 'X-GNOME-Autostart-enabled=true'
    } >"$temp"
    mv -f "$temp" "$AUTOSTART_FILE" || die "Could not write $AUTOSTART_FILE."
}

stop_watcher() {
    if [ "$PLATFORM" = macos ]; then
        launchctl bootout "gui/$(id -u)/$APP_ID" >/dev/null 2>&1 || true
        launchctl unload "$LAUNCH_AGENT" >/dev/null 2>&1 || true
    fi

    pid_file="$INSTALL_DIR/watcher.pid"
    if [ -f "$pid_file" ]; then
        pid=$(cat "$pid_file" 2>/dev/null || true)
        case "$pid" in
            '' | *[!0-9]*) ;;
            *) kill "$pid" >/dev/null 2>&1 || true ;;
        esac
    fi
    pkill -f "$WATCHER" >/dev/null 2>&1 || true
}

start_watcher() {
    case "$PLATFORM" in
        macos)
            write_launch_agent
            if launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENT" >/dev/null 2>&1; then
                :
            elif launchctl load "$LAUNCH_AGENT" >/dev/null 2>&1; then
                :
            else
                warn "Could not load the macOS LaunchAgent. Run: launchctl load \"$LAUNCH_AGENT\""
            fi
            ;;
        linux)
            write_autostart
            if command -v nohup >/dev/null 2>&1; then
                nohup /bin/sh "$WATCHER" >/dev/null 2>&1 &
            else
                /bin/sh "$WATCHER" >/dev/null 2>&1 &
            fi
            ;;
    esac
}

remove_startup() {
    case "$PLATFORM" in
        macos)
            launchctl bootout "gui/$(id -u)/$APP_ID" >/dev/null 2>&1 || true
            launchctl bootout "gui/$(id -u)" "$LAUNCH_AGENT" >/dev/null 2>&1 || true
            launchctl unload "$LAUNCH_AGENT" >/dev/null 2>&1 || true
            rm -f "$LAUNCH_AGENT"
            ;;
        linux)
            rm -f "$AUTOSTART_FILE"
            ;;
    esac
}
