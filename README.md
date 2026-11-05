# Vencord Expression Picker Enhanced

**A larger, resizable and persistent GIF / emoji picker for Vencord on Windows,
with local GIF import, favorites management, search and automatic localization.**
One-click installer, no Vencord build required.

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
  picker, with the same masonry layout, color filter and search bar as
  native Favorites. Click one to attach it to the message box.
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
- Survives Discord updates.
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

1. Download **`VencordExpressionPickerEnhanced-Setup.exe`** from the latest
   release:
   <https://github.com/quentingimenez/vencord-expression-picker-enhanced/releases/latest>
2. Close Discord (recommended).
3. Run the installer. No administrator rights are required.
4. Click **Installer**.
5. Restart Discord.

> The installer is unsigned. If Windows SmartScreen warns, click
> **More info** then **Run anyway**.

### Manual installation (ZIP)

Download the ZIP from the same release, extract it, then double-click
**`install.cmd`**. The ZIP includes `uninstall.cmd` for manual removal.

> Windows 10/11, Discord desktop and Vencord installed with the official
> installer. Vesktop and BetterDiscord are not supported.

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
   6 seconds, 10 fps, 8 MB output).
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

Use **Windows Settings → Apps → Installed apps → Vencord Expression Picker
Enhanced → Uninstall**, or run the Setup again and click **Désinstaller**.
Then restart Discord.

The uninstaller restores Vencord's `preload.js` and removes the module.
Imported GIFs are stored in Discord's IndexedDB and are **not** deleted, so
they come back if you reinstall the module.

The installer keeps a backup of `preload.js` at
`preload.js.bak-picker-resize` and restores it during uninstallation.

## Updates

- **Discord updates**: Vencord automatically re-patches the new `app.asar`;
  no action is required.
- **Vencord updates**: the watcher monitors
  `%APPDATA%\Vencord\dist\preload.js` and re-applies the loader
  automatically. If the grip ever disappears after an update, run
  `install.cmd` again and restart Discord.

## How it works

The installer:

1. copies `picker-resize.js`, `watcher.ps1` and `uninstall.ps1` to
   `%LOCALAPPDATA%\VencordPickerResize\`;
2. appends a loader to `%APPDATA%\Vencord\dist\preload.js`;
3. creates `VencordPickerResize.vbs` in the Startup folder;
4. starts the watcher, which keeps the loader in place after updates;
5. registers **Vencord Expression Picker Enhanced** in Windows
   **Apps & features** with a working uninstaller.

The script and saved height live outside Vencord, so reinstalling Vencord
does not remove them. Imported GIFs are stored in Discord's IndexedDB
(local to this installation). Conversion runs entirely in the renderer
using the bundled `gifenc` encoder; no network access, no telemetry.

### Building the installer

Run `installer\build-setup.ps1`. It uses the C# compiler included with
the .NET Framework and writes `dist\VencordExpressionPickerEnhanced-Setup.exe`.

### Development

The renderer is a single injected file, `src/picker-resize.js`, because the
preload loader executes one script in the page world. It is organized in one
IIFE with shared utilities, then the resize feature and the import feature.
Discord's hashed selectors are centralized in `SELECTORS`; user-visible
strings live in `MESSAGES`. Keep both in sync when Discord changes its DOM
or a translation is added.

Install the development tools, then run the checks:

```powershell
npm install
npm test
npm run lint
npm run format:check
```

The test suite itself uses Node.js's built-in test runner and has no runtime
dependencies. It covers size persistence, drag clamping, localization and
plurals, the last-opened-view cookie, native favorite matching, masonry
layout, GIF encoding, import validation, and the installer/watcher scripts.
Node.js 20 or newer is required. Prettier and ESLint are development-only
dependencies; the bundled `gifenc` block is excluded from both. The quality
audit and the rationale behind the current structure are documented in
[`AUDIT.md`](AUDIT.md).

## Troubleshooting

- **"Vencord was not found"**: Vencord is not installed at the standard
  path, or you are using Vesktop. This project targets the official
  Vencord installer.
- **Nothing happens after restarting**: run `install.cmd` again, then
  restart Discord. Check that
  `%APPDATA%\Vencord\dist\preload.js` contains
  `VC_PICKER_RESIZE_LOADER_START`.
- **The grip disappeared after an update**: the watcher was probably not
  running. Run `install.cmd` again.
- **Antivirus / PowerShell**: the scripts are readable and only copy local
  files and modify `preload.js`. `install.cmd` starts PowerShell with
  `-ExecutionPolicy Bypass` to allow unsigned scripts.

## Disclaimer

Unofficial project, not affiliated with Discord or Vencord. Modifying
`preload.js` can break after an incompatible update. Use at your own risk.

## License

MIT — see [LICENSE](LICENSE).

The bundled GIF encoder is [gifenc](https://github.com/mattdesl/gifenc),
also MIT — see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
