"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const installScript = fs.readFileSync(path.join(ROOT, "install.ps1"), "utf8");
const uninstallScript = fs.readFileSync(path.join(ROOT, "uninstall.ps1"), "utf8");
const watcherScript = fs.readFileSync(path.join(ROOT, "src", "watcher.ps1"), "utf8");
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
    test("install.ps1 embeds the preload bridge", () => {
        const loader = getLoaderBlock(installScript);

        assert.match(loader, /require\("fs"\)/);
        assert.match(loader, /require\("path"\)/);
        assert.match(loader, /process\.env\.LOCALAPPDATA/);
        assert.match(loader, /VencordPickerResize/);
        assert.match(loader, /picker-resize\.js/);
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

    test("install.ps1 copies the runtime files and starts the watcher", () => {
        assert.match(installScript, /Resolve-Source "picker-resize\.js"/);
        assert.match(installScript, /Resolve-Source "watcher\.ps1"/);
        assert.match(installScript, /Resolve-Source "uninstall\.ps1"/);
        assert.match(installScript, /Copy-FileIfChanged \$sourceScript \$installedScript/);
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

    test("uninstall restores the backup or strips the loader", () => {
        assert.match(uninstallScript, /\.bak-picker-resize/);
        assert.match(uninstallScript, /-not \$backup\.Contains\("VC_PICKER_RESIZE_LOADER_START"\)/);
        assert.match(uninstallScript, /Remove-Item \$installDir/);
        assert.match(uninstallScript, /VencordExpressionPickerEnhanced/);
    });

    test("the watcher reinstalls the loader after a Vencord update", () => {
        assert.match(watcherScript, /VC_PICKER_RESIZE_LOADER_START/);
        assert.match(watcherScript, /-FromWatcher/);
        assert.match(watcherScript, /System\.IO\.FileSystemWatcher/);
        assert.match(watcherScript, /preload\.js/);
        assert.match(watcherScript, /Ensure-Patch/);
    });

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
                path.join(ROOT, "src", "watcher.ps1")
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
