"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const installScript = fs.readFileSync(path.join(ROOT, "install.ps1"), "utf8");
const uninstallScript = fs.readFileSync(path.join(ROOT, "uninstall.ps1"), "utf8");
const watcherScript = fs.readFileSync(path.join(ROOT, "src", "watcher.ps1"), "utf8");
const loaderScript = fs.readFileSync(path.join(ROOT, "src", "loader.js"), "utf8");
const packageReleaseScript = fs.readFileSync(path.join(ROOT, "scripts", "package-release.ps1"), "utf8");
const installCmd = fs.readFileSync(path.join(ROOT, "install.cmd"), "utf8");
const uninstallCmd = fs.readFileSync(path.join(ROOT, "uninstall.cmd"), "utf8");

const START_MARKER = "/* VC_PICKER_RESIZE_LOADER_START */";
const END_MARKER = "/* VC_PICKER_RESIZE_LOADER_END */";

function getLoaderBlock(source) {
    const start = source.indexOf(START_MARKER);
    const end = source.indexOf(END_MARKER, start);
    assert.ok(start >= 0, "loader start marker is missing");
    assert.ok(end > start, "loader end marker is missing");
    return source.slice(start, end + END_MARKER.length);
}

function getPatternLine(source) {
    return source.split(/\r?\n/).find((line) => line.trimStart().startsWith("$pattern = "));
}

function removeLoaderBlock(source) {
    return source.replace(
        /\r?\n?\/\* VC_PICKER_RESIZE_LOADER_START \*\/[\s\S]*?\/\* VC_PICKER_RESIZE_LOADER_END \*\//g,
        ""
    );
}

describe("installer loader", () => {
    test("the shared loader exposes the preload bridge", () => {
        const loader = getLoaderBlock(loaderScript);

        assert.match(loader, /require\("fs"\)/);
        assert.match(loader, /require\("path"\)/);
        assert.match(loader, /process\.env\.LOCALAPPDATA/);
        assert.match(loader, /process\.platform === "win32"/);
        assert.match(loader, /VencordPickerResize/);
        assert.match(loader, /picker-resize\.js/);
        assert.match(loader, /__dirname, "picker-resize"/);
        assert.match(loader, /__dirname, "\.\.", "picker-resize"/);
        assert.match(loader, /size\.json/);
        assert.match(loader, /settings\.json/);
        assert.match(loader, /contextBridge\.exposeInMainWorld\("VencordPickerResize"/);
        assert.match(loader, /savedHeight: __vcPickerHeight/);
        assert.match(loader, /__vcPickerMinHeight = 320/);
        assert.match(loader, /__vcPickerMaxHeight = 5000/);
        assert.match(loader, /height < __vcPickerMinHeight/);
        assert.match(loader, /height > __vcPickerMaxHeight/);
        assert.match(loader, /webFrame\s*\.executeJavaScript/);
    });

    test("the shared loader resolves the renderer inside Vencord's dist", () => {
        const temp = fs.mkdtempSync(path.join(os.tmpdir(), "vc-picker-loader-"));
        const dist = path.join(temp, "dist");
        const picker = path.join(dist, "picker-resize");
        let exposed = null;
        let executed = null;

        try {
            fs.mkdirSync(picker, { recursive: true });
            fs.writeFileSync(path.join(picker, "picker-resize.js"), "globalThis.__pickerLoaded = true;", "utf8");
            fs.writeFileSync(path.join(picker, "size.json"), JSON.stringify({ height: 480 }), "utf8");

            const fakeElectron = {
                contextBridge: {
                    exposeInMainWorld(name, api) {
                        exposed = { name, api };
                    }
                },
                webFrame: {
                    executeJavaScript(source) {
                        executed = source;
                        return Promise.resolve();
                    }
                }
            };
            const loader = new Function("require", "__dirname", "process", "console", getLoaderBlock(loaderScript));
            loader(
                (id) => {
                    if (id === "fs") return fs;
                    if (id === "path") return path;
                    if (id === "electron/renderer") return fakeElectron;
                    throw new Error(`Unexpected require: ${id}`);
                },
                dist,
                { platform: "linux", env: {} },
                console
            );

            assert.equal(exposed.name, "VencordPickerResize");
            assert.equal(exposed.api.savedHeight, 480);
            assert.match(executed, /__pickerLoaded/);

            exposed.api.saveHeight(500);
            const saved = JSON.parse(fs.readFileSync(path.join(picker, "size.json"), "utf8"));
            assert.equal(saved.height, 500);
        } finally {
            fs.rmSync(temp, { recursive: true, force: true });
        }
    });

    test("install.ps1 copies the runtime files and starts the watcher", () => {
        assert.match(installScript, /Resolve-Source "picker-resize\.js"/);
        assert.match(installScript, /Resolve-Source "watcher\.ps1"/);
        assert.match(installScript, /Resolve-Source "loader\.js"/);
        assert.match(installScript, /Resolve-Source "uninstall\.ps1"/);
        assert.match(installScript, /Copy-FileIfChanged \$sourceScript \$installedScript/);
        assert.match(installScript, /Copy-FileIfChanged \$sourceLoader \$installedLoader/);
        assert.match(installScript, /VencordPickerResize\.vbs/);
        assert.match(installScript, /\$FromWatcher/);
        assert.match(installScript, /VC_PICKER_RESIZE_LOADER_START/);
    });

    test("install and uninstall use the same removal pattern", () => {
        const installPattern = getPatternLine(installScript);
        const uninstallPattern = getPatternLine(uninstallScript);

        assert.ok(installPattern, "install.ps1 removal pattern is missing");
        assert.ok(uninstallPattern, "uninstall.ps1 removal pattern is missing");
        assert.equal(uninstallPattern.trim(), installPattern.trim());
        assert.match(installPattern, /VC_PICKER_RESIZE_LOADER_START/);
        assert.match(installPattern, /VC_PICKER_RESIZE_LOADER_END/);
    });

    test("the loader block removal pattern is idempotent", () => {
        const sample = ["before", START_MARKER, "loader code", END_MARKER, "after"].join("\n");

        const cleaned = removeLoaderBlock(sample);
        assert.equal(cleaned, "before\nafter");
        assert.equal(removeLoaderBlock(cleaned), "before\nafter");
    });

    test("uninstall strips the loader from the current preload instead of restoring a stale backup", () => {
        assert.match(uninstallScript, /\.bak-picker-resize/);
        assert.match(uninstallScript, /\$loaderMarker = "VC_PICKER_RESIZE_LOADER_START"/);
        assert.match(uninstallScript, /if \(\$content\.Contains\(\$loaderMarker\)\)/);
        assert.match(uninstallScript, /Write-FileAtomic \$preloadPath \$cleaned/);
        assert.match(uninstallScript, /\$cleanupFailed/);
        assert.match(uninstallScript, /exit 1/);
        assert.doesNotMatch(uninstallScript, /elseif \(Test-Path \$backupPath\)/);
        assert.match(uninstallScript, /Remove-Item \$installDir/);
        assert.match(uninstallScript, /VencordExpressionPickerEnhanced/);
    });

    test("install and uninstall share the same atomic writer", () => {
        const extract = (source) => {
            const match = source.match(/function Write-FileAtomic[\s\S]*?\n\}\n/);
            assert.ok(match, "Write-FileAtomic is missing");
            return match[0]
                .split("\n")
                .filter((line) => !line.trimStart().startsWith("#"))
                .join("\n")
                .replace(/\s+/g, " ")
                .trim();
        };

        assert.equal(extract(uninstallScript), extract(installScript));
    });

    test("file hashing uses the .NET API instead of the optional Get-FileHash cmdlet", () => {
        assert.match(installScript, /Get-FileSha256/);
        assert.doesNotMatch(installScript, /Get-FileHash/);
        assert.match(packageReleaseScript, /Get-FileSha256/);
        assert.doesNotMatch(packageReleaseScript, /Get-FileHash/);
    });

    test("preload writes are atomic and verified", () => {
        assert.match(installScript, /function Write-FileAtomic/);
        assert.match(installScript, /\[System\.IO\.File\]::Replace/);
        assert.match(installScript, /Atomic write verification failed/);
        assert.match(installScript, /Write-FileAtomic \$preloadPath \$patched/);
        assert.match(uninstallScript, /function Write-FileAtomic/);
        assert.match(uninstallScript, /Write-FileAtomic \$preloadPath \$cleaned/);
    });

    test(
        "Write-FileAtomic replaces files and leaves no temporary file",
        {
            skip: process.platform !== "win32"
        },
        () => {
            const match = installScript.match(
                /function Write-FileAtomic\(\[string\]\$path, \[string\]\$content\) \{[\s\S]*?\n\}\n/
            );
            assert.ok(match, "Write-FileAtomic is missing from install.ps1");

            const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vc-picker-atomic-"));
            const file = path.join(directory, "preload.js");
            fs.writeFileSync(file, "original", "utf8");

            const quote = (value) => `'${value.replace(/'/g, "''")}'`;
            const command = [
                match[0],
                `Write-FileAtomic ${quote(file)} ${quote("patched-content")}`,
                `if ([System.IO.File]::ReadAllText(${quote(file)}) -ne ${quote("patched-content")}) { exit 1 }`,
                `Write-FileAtomic ${quote(file)} ${quote("second-content")}`,
                `if ([System.IO.File]::ReadAllText(${quote(file)}) -ne ${quote("second-content")}) { exit 2 }`
            ].join("; ");

            const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], {
                encoding: "utf8",
                windowsHide: true
            });

            try {
                assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
                assert.deepEqual(fs.readdirSync(directory), ["preload.js"]);
            } finally {
                fs.rmSync(directory, { recursive: true, force: true });
            }
        }
    );

    test("the installer refuses to patch a preload without exactly one loader block", () => {
        assert.match(installScript, /\$startCount -ne 1 -or \$endCount -ne 1/);
        assert.match(installScript, /Refusing to patch preload\.js/);
        assert.match(installScript, /the loader was not appended at the end/);
    });

    test("the watcher reinstalls the loader after a Vencord update", () => {
        assert.match(watcherScript, /VC_PICKER_RESIZE_LOADER_START/);
        assert.match(watcherScript, /-FromWatcher/);
        assert.match(watcherScript, /System\.IO\.FileSystemWatcher/);
        assert.match(watcherScript, /preload\.js/);
        assert.match(watcherScript, /Ensure-Patch/);
    });

    test("the watcher survives a missing Vencord folder and prevents duplicates", () => {
        assert.match(watcherScript, /VencordPickerResizeWatcher/);
        assert.match(watcherScript, /New-PreloadWatcher/);
        assert.match(watcherScript, /Cannot watch/);
        assert.match(watcherScript, /Cannot recreate watcher/);
        assert.match(watcherScript, /while \(-not \$watcher\)/);
    });

    test(
        "install and uninstall run against a temporary Vencord tree",
        {
            skip: process.platform !== "win32"
        },
        () => {
            const appData = fs.mkdtempSync(path.join(os.tmpdir(), "vc-picker-appdata-"));
            const localAppData = fs.mkdtempSync(path.join(os.tmpdir(), "vc-picker-localappdata-"));
            const dist = path.join(appData, "Vencord", "dist");
            const preload = path.join(dist, "preload.js");
            const backup = `${preload}.bak-picker-resize`;
            const startup = path.join(
                appData,
                "Microsoft",
                "Windows",
                "Start Menu",
                "Programs",
                "Startup",
                "VencordPickerResize.vbs"
            );
            const installedDir = path.join(localAppData, "VencordPickerResize");
            const originalPreload = "// fake Vencord preload\n";
            const env = { ...process.env, APPDATA: appData, LOCALAPPDATA: localAppData };
            const run = (script, args) =>
                spawnSync(
                    "powershell.exe",
                    ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", script, ...args],
                    {
                        encoding: "utf8",
                        env,
                        cwd: ROOT,
                        windowsHide: true
                    }
                );
            const count = (text, marker) => (text.match(new RegExp(marker, "g")) || []).length;

            try {
                fs.mkdirSync(dist, { recursive: true });
                fs.mkdirSync(path.dirname(startup), { recursive: true });
                fs.writeFileSync(preload, originalPreload, "utf8");

                const install = run(path.join(ROOT, "install.ps1"), ["-FromWatcher"]);
                assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);

                for (const file of ["install.ps1", "picker-resize.js", "loader.js", "uninstall.ps1", "watcher.ps1"]) {
                    assert.ok(fs.existsSync(path.join(installedDir, file)), `${file} was not installed`);
                }
                assert.equal(fs.existsSync(startup), true, "the startup launcher was not created");
                assert.match(fs.readFileSync(startup, "utf8"), /watcher\.ps1/);

                let patched = fs.readFileSync(preload, "utf8");
                assert.equal(count(patched, "VC_PICKER_RESIZE_LOADER_START"), 1);
                assert.equal(count(patched, "VC_PICKER_RESIZE_LOADER_END"), 1);
                assert.equal(fs.readFileSync(backup, "utf8"), originalPreload);

                // Running the installer again must stay idempotent.
                const reinstall = run(path.join(ROOT, "install.ps1"), ["-FromWatcher"]);
                assert.equal(reinstall.status, 0, `${reinstall.stdout}\n${reinstall.stderr}`);
                patched = fs.readFileSync(preload, "utf8");
                assert.equal(count(patched, "VC_PICKER_RESIZE_LOADER_START"), 1);
                assert.equal(fs.readFileSync(backup, "utf8"), originalPreload);

                const uninstall = run(path.join(installedDir, "uninstall.ps1"), ["-NoRegistry"]);
                assert.equal(uninstall.status, 0, `${uninstall.stdout}\n${uninstall.stderr}`);
                assert.equal(fs.readFileSync(preload, "utf8"), originalPreload);
                assert.equal(fs.existsSync(backup), false);
                assert.equal(fs.existsSync(installedDir), false);
                assert.equal(fs.existsSync(startup), false);
            } finally {
                fs.rmSync(appData, { recursive: true, force: true });
                fs.rmSync(localAppData, { recursive: true, force: true });
            }
        }
    );

    test(
        "uninstall keeps the installation when preload cleanup fails",
        {
            skip: process.platform !== "win32"
        },
        () => {
            const appData = fs.mkdtempSync(path.join(os.tmpdir(), "vc-picker-fail-appdata-"));
            const localAppData = fs.mkdtempSync(path.join(os.tmpdir(), "vc-picker-fail-localappdata-"));
            const dist = path.join(appData, "Vencord", "dist");
            const preload = path.join(dist, "preload.js");
            const installedDir = path.join(localAppData, "VencordPickerResize");
            const marker = path.join(installedDir, "keep.txt");
            const env = { ...process.env, APPDATA: appData, LOCALAPPDATA: localAppData };

            try {
                fs.mkdirSync(dist, { recursive: true });
                // A directory at the preload path makes ReadAllText fail and
                // reproduces an uncleanable preload without locking a file.
                fs.mkdirSync(preload);
                fs.mkdirSync(installedDir, { recursive: true });
                fs.writeFileSync(marker, "keep", "utf8");

                const result = spawnSync(
                    "powershell.exe",
                    [
                        "-NoProfile",
                        "-NonInteractive",
                        "-ExecutionPolicy",
                        "Bypass",
                        "-File",
                        path.join(ROOT, "uninstall.ps1"),
                        "-NoRegistry"
                    ],
                    { encoding: "utf8", env, cwd: ROOT, windowsHide: true }
                );

                assert.equal(result.status, 1, `${result.stdout}\n${result.stderr}`);
                assert.equal(fs.readFileSync(marker, "utf8"), "keep");
            } finally {
                fs.rmSync(appData, { recursive: true, force: true });
                fs.rmSync(localAppData, { recursive: true, force: true });
            }
        }
    );

    test("the cmd wrappers call the PowerShell scripts", () => {
        assert.match(installCmd, /install\.ps1/);
        assert.match(uninstallCmd, /uninstall\.ps1/);
    });

    test(
        "all PowerShell files parse without syntax errors",
        {
            skip: process.platform !== "win32"
        },
        () => {
            const files = [
                path.join(ROOT, "install.ps1"),
                path.join(ROOT, "uninstall.ps1"),
                path.join(ROOT, "src", "watcher.ps1"),
                path.join(ROOT, "installer", "build-setup.ps1"),
                path.join(ROOT, "scripts", "package-release.ps1")
            ];

            for (const file of files) {
                const escaped = file.replace(/'/g, "''");
                const command = [
                    "$tokens = $null",
                    "$errors = $null",
                    `[System.Management.Automation.Language.Parser]::ParseFile('${escaped}', [ref]$tokens, [ref]$errors) | Out-Null`,
                    "if ($errors.Count -gt 0) {",
                    "  $errors | ForEach-Object { Write-Output $_.Message }",
                    "  exit 1",
                    "}"
                ].join("; ");

                const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], {
                    encoding: "utf8",
                    windowsHide: true
                });

                assert.equal(
                    result.status,
                    0,
                    `${path.basename(file)} has a syntax error:\n${result.stdout}\n${result.stderr}`
                );
            }
        }
    );
});
