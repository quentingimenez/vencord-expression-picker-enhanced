# Vencord Expression Picker Enhanced

**A larger, resizable and persistent GIF / emoji picker for Vencord on Windows,
macOS and Linux, with local GIF import, favorites management, search and
automatic localization.**
Simple installer, no Vencord build required.

> Vencord officially supports Windows, macOS and Linux. This module supports
> the official Vencord installer on all three desktop platforms. Vesktop and
> BetterDiscord are not supported.

> Renamed from **Vencord Expression Picker Resize**. Existing installs and
> imported GIFs keep working; the internal storage paths are unchanged.

![Preview](assets/preview.svg)

## Features

- Much larger GIF / sticker / emoji picker by default.
- **Width + height** resizing with a small, discreet grip inside the
  top-left corner.
- Size remembered between openings and restarts
  (width is stored by Discord, height in `size.json`).
- No more blue flash: GIF tiles stay dark until their first frame is
  ready, then fade in.
- **Import local files** with the upload button in the top-right corner of
  the GIF page. GIF, PNG, JPEG, WebP, AVIF, APNG, BMP, MP4, WebM, MOV, MKV
  and M4V are accepted and converted to GIF automatically.
- Imported GIFs appear in a dedicated **Importés** category in the GIF
  picker, with the same masonry layout and search bar as native Favorites.
  Click one to attach it to the message box.
- Hovering an imported GIF in **Favorites** shows a delete button with the
  same design as Discord's favorite button. It removes both the native
  favorite and the local import in one click.
- Imported tiles also show the same star button as native GIFs. It removes
  the matching Discord favorite, or explains that the GIF must be sent once
  before it can be added to Discord's favorites.
- The category grid stays aligned while the window or the picker is
  resized.
- The picker remembers the last opened category (root categories,
  Favorites, Importés or a trending category) when it is closed and
  reopened.
- The interface follows the Discord client language automatically.
- Designed to survive Discord updates: selectors use stable prefixes and
  degrade independently if Discord changes its DOM.
- Survives Vencord updates thanks to a small watcher that re-applies the
  loader when `preload.js` is replaced.

## Why not a Vencord plugin?

The official Vencord installer does not load external plugins. Vencord
`userplugins` are only supported when Vencord is built from source, which
requires Node.js, pnpm, git and a full build.

This project uses a simpler approach: a small renderer script injected
through `preload.js`, plus a watcher that re-applies the hook after a
Vencord update. No Vencord build is required.

## Installation

Vencord must already be installed with the official installer on Discord
desktop (Windows, macOS or Linux).

### Windows

1. Download **`VencordExpressionPickerEnhanced-Setup.exe`** from the latest
   release:
   <https://github.com/quentingimenez/vencord-expression-picker-enhanced/releases/latest>
2. Close Discord (recommended).
3. Run the installer. No administrator rights are required.
4. Click **Installer**.
5. Restart Discord.

> The installer is unsigned. If Windows SmartScreen warns, click
> **More info** then **Run anyway**.

### macOS and Linux

1. Download **`VencordExpressionPickerEnhanced-vX.Y.Z-unix.tar.gz`** from the
   latest release:
   <https://github.com/quentingimenez/vencord-expression-picker-enhanced/releases/latest>
2. Extract the archive.
3. Close Discord (recommended).
4. Open a terminal in the extracted folder and run:

   ```sh
   sh install.sh
   ```

   No administrator rights are required.

5. Restart Discord.

If Vencord is installed in a non-standard location (for example a custom
Flatpak path), prefix the command with `VENCORD_DIR=/path/to/Vencord`.

> The scripts are unsigned. On macOS, Gatekeeper may ask you to confirm the
> first launch; on Linux, review the scripts before running them if your
> distribution warns about downloaded shell scripts.

### Manual installation (archive)

The Windows ZIP contains `install.cmd` and `uninstall.cmd`; double-click
`install.cmd` to install. The macOS/Linux `unix.tar.gz` contains `install.sh`
and `uninstall.sh`; run `sh install.sh` or `sh uninstall.sh`.

> Requirements: Windows 10/11, macOS or Linux; Discord desktop and Vencord
> installed with the official installer. Vencord does not support the Snap
> build of Discord; the installer detects native and Flatpak Vencord paths.

## Usage

Open the GIF picker from the message bar. A small diagonal grip is
available in the **top-left corner** of the panel:

- drag it up/left to enlarge the picker;
- drag it down/right to shrink it;
- focus the grip and use the arrow keys (Shift for larger steps) for
  keyboard resizing;
- the size is remembered automatically.

Discord's native width-only handle on the left edge is hidden; the custom
grip handles both dimensions.

### Importing local GIFs

1. Open the GIF picker.
2. Click the **upload icon** in the top-right corner of the GIF page.
3. Select one or more files. Accepted formats: GIF, PNG, JPEG, WebP, AVIF,
   APNG, BMP, MP4, WebM, MOV, MKV and M4V.
4. Images and videos are converted to GIF automatically (max 480 px,
   6 seconds, 8 MB output; videos are sampled at 10 fps).
5. Open the **Importés** category in the GIF picker. The first tile has the
   same function as the top-right upload button, so you can import more
   files from there. Imported GIFs use the same masonry sizing as native
   Favorites. Click one to attach it to the message box; the picker closes
   automatically. Press Enter to send it.
6. Use the search bar at the top of **Importés** to filter imports by
   filename. The last opened category is remembered for the next time you
   open the picker.

Imported GIFs are stored **locally** in this Discord installation
(IndexedDB). They are not synced to other devices, and they are sent as
normal file attachments rather than provider GIF links. They stay visible
in **Importés** even if you also save them in Discord's native favorites.
The delete button removes both the native favorite and the local import in
one click; the same button appears on hover on the matching tile in
**Favorites**. The star button on an imported tile removes the matching
native favorite. Discord favorites need an uploaded URL, so a GIF that has
never been sent cannot be added to favorites yet; the star explains this.

Limits: input files up to 100 MB; converted GIFs up to 8 MB.

## Languages

The interface is translated automatically from the Discord client language.
Supported languages: English, French, Spanish, German, Italian, Portuguese,
Dutch, Polish, Russian, Japanese, Korean, Chinese (Simplified and
Traditional) and Turkish. Other client languages fall back to English.

## Uninstall

### Windows

Use **Windows Settings → Apps → Installed apps → Vencord Expression Picker
Enhanced → Uninstall**, or run the Setup again and click **Désinstaller**.
Then restart Discord.

### macOS and Linux

Run `sh uninstall.sh` from the extracted archive, or
`sh "<Vencord>/dist/picker-resize/uninstall.sh"` if the archive is gone. Then
restart Discord.

The uninstaller removes the loader block from Vencord's current `preload.js`,
the startup entry and the module. Imported GIFs are stored in Discord's
IndexedDB and are **not** deleted, so they come back if you reinstall the
module.

The installer keeps a backup of the original `preload.js` at
`preload.js.bak-picker-resize`. The uninstaller does not restore that backup
over a newer Vencord file; it only strips the loader from the current file.
The backup is kept solely as a last-resort restore if the current file is
empty after a failed cleanup.

## Updates

- **Discord updates**: Vencord automatically re-patches the new `app.asar`;
  no action is required.
- **Vencord updates**: the watcher monitors Vencord's `dist/preload.js` and
  re-applies the loader automatically. The path is
  `%APPDATA%\Vencord\dist\preload.js` on Windows,
  `~/Library/Application Support/Vencord/dist/preload.js` on macOS (or
  `~/.config/Vencord/dist/preload.js` depending on the Vencord installer
  version), and `~/.config/Vencord/dist/preload.js` on Linux (or the
  `~/.var/app/com.discordapp.Discord/config/Vencord` Flatpak path).
  The watcher starts at login through the Windows Startup folder, a macOS
  LaunchAgent, or an XDG autostart entry on Linux. If the grip ever
  disappears after an update, run the installer again (`install.cmd` on
  Windows, `sh install.sh` on macOS/Linux) and restart Discord.

### Robustness

- `preload.js` is replaced atomically (temporary file + `File.Replace` on
  Windows, same-directory rename on macOS/Linux) and the result is verified
  before the old file is discarded. The installer refuses to write a patch
  that does not contain exactly one loader block.
- The loader itself is wrapped in `try/catch`: if Vencord's preload or
  Electron APIs change, the error is logged and Discord keeps working.
- The uninstaller removes the loader block from the **current** `preload.js`
  instead of restoring an old backup, so a Vencord update cannot cause a
  downgrade during uninstallation. If the file cannot be cleaned, it stops
  and keeps the installed files and uninstall entry so you can retry after
  closing Discord/Vencord.
- The watcher waits for Vencord's folder to exist, uses a mutex (Windows) or
  an atomic lock directory (macOS/Linux) to avoid duplicate instances, and
  recreates its file watcher if it fails.
- Each renderer feature (resize, imports, category card, view restore) runs
  in its own guarded step. A broken selector or a transient DOM change only
  disables that step until the next maintenance tick.
- Discord selectors prefer stable class prefixes and discover the current
  card class at runtime.

## How it works

The installer:

1. copies `picker-resize.js`, `loader.js`, the watcher and the uninstaller to
   `%LOCALAPPDATA%\VencordPickerResize\` on Windows, or to
   `<Vencord>/dist/picker-resize/` on macOS and Linux;
2. appends a loader to Vencord's `dist/preload.js`;
3. creates a startup entry (Windows Startup folder, macOS LaunchAgent or
   Linux XDG autostart);
4. starts the watcher, which keeps the loader in place after updates;
5. registers **Vencord Expression Picker Enhanced** in Windows
   **Apps & features** with a working uninstaller (Windows only).

The module lives in `<Vencord>/dist/picker-resize` on macOS/Linux (inside the
directory Flatpak already grants to Vencord) and in
`%LOCALAPPDATA%\VencordPickerResize` on Windows, so Vencord updates only
replace `preload.js` and leave the module in place. Imported GIFs are stored
in Discord's IndexedDB (local to this installation). Conversion runs entirely
in the renderer using the bundled `gifenc` encoder; no network access, no
telemetry.

### Building the releases

Run `npm run release`. It detects the current platform:

- **Windows**: builds the renderer, compiles the C# setup, creates a clean
  manual-install ZIP and writes `dist\SHA256SUMS.txt`. The C# compiler is the
  one included with the .NET Framework; the setup executable is written to
  `dist\VencordExpressionPickerEnhanced-Setup.exe`.
- **macOS / Linux**: builds the renderer and writes
  `dist/VencordExpressionPickerEnhanced-vX.Y.Z-unix.tar.gz` plus
  `dist/SHA256SUMS-unix.txt`. The archive only needs Node.js, a POSIX shell
  and `tar` to build.

You can also call `npm run release:windows` or `npm run release:unix`
explicitly. CI runs the full suite and packages the release on Windows,
Ubuntu and macOS.

### Development

The renderer is still shipped as one injected file because the preload loader
executes a single script in the page world. Its source is split into focused
fragments under `src/renderer/` (core, resize, i18n, imports, styles and
bootstrap). `npm run build` concatenates them into the generated
`dist/picker-resize.js`; the installer ships that bundle. Never edit the
generated file directly.

Discord's hashed selectors are centralized in `SELECTORS`; native styling
hooks live in `NATIVE_CLASSES`; user-visible strings live in `MESSAGES`. Keep
them in sync when Discord changes its DOM or a translation is added.

Install the development tools, then run the checks:

```console
npm install
npm run build
npm test
npm run lint
npm run format:check
```

`npm test` also builds the bundle automatically. The suite uses Node.js's
built-in test runner and has no runtime dependencies. It covers size
persistence, drag clamping, localization and plurals, the last-opened-view
cookie, native favorite matching, masonry layout, image/video conversion, GIF
encoding, import validation, maintenance, and real install/uninstall cycles
against temporary Vencord trees (Windows PowerShell plus a POSIX test on
macOS/Linux). `npm run test:coverage` prints the coverage report. Node.js
22.13+ or 24+ is required. Prettier and ESLint are development-only
dependencies; the vendored `gifenc` block is excluded from both. The quality
audit and the rationale behind the current structure are documented in
[`AUDIT.md`](AUDIT.md).

## Troubleshooting

- **"Vencord was not found"**: Vencord is not installed at the standard path,
  or you are using Vesktop. This project targets the official Vencord
  installer. The expected `preload.js` is under
  `%APPDATA%\Vencord\dist\` on Windows,
  `~/Library/Application Support/Vencord/dist/` (or
  `~/.config/Vencord/dist/`) on macOS, and `~/.config/Vencord/dist/` (or the
  Flatpak config path) on Linux.
- **Nothing happens after restarting**: run the installer again
  (`install.cmd` on Windows, `sh install.sh` on macOS/Linux), then restart
  Discord. Check that `preload.js` contains
  `VC_PICKER_RESIZE_LOADER_START`.
- **The grip disappeared after an update**: the watcher was probably not
  running. Run the installer again. The watcher log is
  `%LOCALAPPDATA%\VencordPickerResize\watcher.log` on Windows and
  `<Vencord>/dist/picker-resize/watcher.log` on macOS/Linux.
- **Antivirus / PowerShell / Gatekeeper**: the scripts are readable and only
  copy local files and modify `preload.js`. `install.cmd` starts PowerShell
  with `-ExecutionPolicy Bypass` to allow unsigned scripts. On macOS, allow
  the downloaded script if Gatekeeper asks. On Linux, review the shell
  scripts before running them if your distribution warns.

## Disclaimer

Unofficial project, not affiliated with Discord or Vencord. Modifying
`preload.js` can break after an incompatible update. Use at your own risk.

## License

MIT — see [LICENSE](LICENSE).

The bundled GIF encoder is [gifenc](https://github.com/mattdesl/gifenc),
also MIT — see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
