/* VC_PICKER_RESIZE_LOADER_START */
try {
    const __vcPickerFs = require("fs");
    const __vcPickerPath = require("path");
    const __vcPickerRoots = [];

    // Windows keeps the historical location outside Vencord so reinstalling
    // Vencord never touches the saved size or the renderer.
    if (process.platform === "win32") {
        const __vcPickerLocalAppData =
            process.env.LOCALAPPDATA || __vcPickerPath.join(process.env.USERPROFILE || "", "AppData", "Local");
        __vcPickerRoots.push(__vcPickerPath.join(__vcPickerLocalAppData, "VencordPickerResize"));
    }

    // On macOS, Linux and Flatpak, keep the files inside Vencord's dist
    // directory. __dirname is <Vencord>/dist, and the Vencord installer grants
    // Flatpak access to that directory, so the loader can read and write here
    // even inside a sandbox. The sibling location is kept as a fallback for
    // older or custom installations.
    __vcPickerRoots.push(__vcPickerPath.join(__dirname, "picker-resize"));
    __vcPickerRoots.push(__vcPickerPath.join(__dirname, "..", "picker-resize"));

    const __vcPickerRoot =
        __vcPickerRoots.find((root) => __vcPickerFs.existsSync(__vcPickerPath.join(root, "picker-resize.js"))) ||
        __vcPickerRoots[__vcPickerRoots.length - 1];
    const __vcPickerFile = __vcPickerPath.join(__vcPickerRoot, "picker-resize.js");

    if (__vcPickerFs.existsSync(__vcPickerFile)) {
        const __vcPickerSizeFile = __vcPickerPath.join(__vcPickerRoot, "size.json");
        const __vcPickerSettingsFile = __vcPickerPath.join(__dirname, "..", "settings", "settings.json");
        let __vcPickerHeight = null;

        // Keep these bounds in sync with src/renderer/03-core.js.
        const __vcPickerMinHeight = 320;
        const __vcPickerMaxHeight = 5000;

        try {
            const __vcPickerSize = JSON.parse(__vcPickerFs.readFileSync(__vcPickerSizeFile, "utf8"));
            if (
                Number.isFinite(__vcPickerSize.height) &&
                __vcPickerSize.height >= __vcPickerMinHeight &&
                __vcPickerSize.height <= __vcPickerMaxHeight
            ) {
                __vcPickerHeight = Math.round(__vcPickerSize.height);
            }
        } catch {
            // Missing or invalid size.json: fall back to Vencord settings.
        }

        if (__vcPickerHeight == null) {
            try {
                const __vcPickerSettings = JSON.parse(__vcPickerFs.readFileSync(__vcPickerSettingsFile, "utf8"));
                const __vcPickerLegacy = __vcPickerSettings.vcExpressionPickerSize;
                if (
                    __vcPickerLegacy &&
                    Number.isFinite(__vcPickerLegacy.height) &&
                    __vcPickerLegacy.height >= __vcPickerMinHeight &&
                    __vcPickerLegacy.height <= __vcPickerMaxHeight
                ) {
                    __vcPickerHeight = Math.round(__vcPickerLegacy.height);
                }
            } catch {
                // Missing or invalid settings.json: keep the default height.
            }
        }

        const __vcPickerElectron = require("electron/renderer");
        __vcPickerElectron.contextBridge.exposeInMainWorld("VencordPickerResize", {
            savedHeight: __vcPickerHeight,
            saveHeight(height) {
                try {
                    if (!Number.isFinite(height) || height < __vcPickerMinHeight || height > __vcPickerMaxHeight)
                        return;
                    __vcPickerFs.mkdirSync(__vcPickerRoot, { recursive: true });
                    __vcPickerFs.writeFileSync(
                        __vcPickerSizeFile,
                        JSON.stringify({ height: Math.round(height) }, null, 2)
                    );
                } catch (err) {
                    console.error("[PickerResize] Failed to save height", err);
                }
            }
        });

        __vcPickerElectron.webFrame
            .executeJavaScript(__vcPickerFs.readFileSync(__vcPickerFile, "utf8"))
            .catch((err) => console.error("[PickerResize]", err));
    }
} catch (err) {
    console.error("[PickerResize]", err);
}
/* VC_PICKER_RESIZE_LOADER_END */
