#Requires -Version 5.1
# Vencord Expression Picker Enhanced - installer
# Installs a small renderer script + a watcher that keeps it alive after Vencord updates.
param(
    [switch]$FromWatcher
)
$ErrorActionPreference = "Stop"

$repoRoot = $PSScriptRoot
$vencordRoot = Join-Path $env:APPDATA "Vencord"
$preloadPath = Join-Path $vencordRoot "dist\preload.js"
$installDir = Join-Path $env:LOCALAPPDATA "VencordPickerResize"
$installerPath = Join-Path $installDir "install.ps1"
$installedScript = Join-Path $installDir "picker-resize.js"
$installedWatcher = Join-Path $installDir "watcher.ps1"
$installedUninstaller = Join-Path $installDir "uninstall.ps1"
$startupDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
$startupFile = Join-Path $startupDir "VencordPickerResize.vbs"

function Resolve-Source([string]$name) {
    $candidates = @(
        (Join-Path $repoRoot "src\$name"),
        (Join-Path $repoRoot $name)
    )
    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) { return $candidate }
    }
    throw "Missing $name (looked in src\ and the installer folder)."
}

function Copy-IfDifferent([string]$source, [string]$destination) {
    $src = [System.IO.Path]::GetFullPath($source)
    $dst = [System.IO.Path]::GetFullPath($destination)
    if ($src -ne $dst) {
        Copy-Item $src $dst -Force
    }
}

Write-Host "Vencord Expression Picker Enhanced - installer" -ForegroundColor Cyan

if (-not (Test-Path $preloadPath)) {
    throw "Vencord was not found at:`n  $preloadPath`nInstall Vencord desktop first (official installer)."
}

$sourceScript = Resolve-Source "picker-resize.js"
$sourceWatcher = Resolve-Source "watcher.ps1"
$sourceUninstaller = Resolve-Source "uninstall.ps1"

if (Get-Process Discord -ErrorAction SilentlyContinue) {
    Write-Host "Discord is running. Restart it after installation." -ForegroundColor Yellow
}

New-Item -ItemType Directory -Force -Path $installDir | Out-Null
Copy-IfDifferent $sourceScript $installedScript
Copy-IfDifferent $sourceWatcher $installedWatcher
Copy-IfDifferent $sourceUninstaller $installedUninstaller

# Keep a self-contained installer in the install folder so the watcher can
# re-apply the loader after Vencord updates.
$currentInstaller = $MyInvocation.MyCommand.Path
if ($currentInstaller) {
    Copy-IfDifferent $currentInstaller $installerPath
}

# Stop an existing watcher (unless this installer was called by the watcher itself).
if (-not $FromWatcher) {
    Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -eq "powershell.exe" -and $_.CommandLine -and $_.CommandLine.Contains($installedWatcher) } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}

# Patch Vencord's preload.js
$content = [System.IO.File]::ReadAllText($preloadPath)
$backupPath = "$preloadPath.bak-picker-resize"
if (-not $content.Contains("VC_PICKER_RESIZE_LOADER_START")) {
    # Keep a backup of the current, unpatched preload (e.g. after a Vencord update).
    Copy-Item $preloadPath $backupPath -Force
}

$pattern = '(?s)\r?\n?/\* VC_PICKER_RESIZE_LOADER_START \*/.*?/\* VC_PICKER_RESIZE_LOADER_END \*/'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, "")

$loader = @'

/* VC_PICKER_RESIZE_LOADER_START */
try {
    const __vcPickerFs = require("fs");
    const __vcPickerPath = require("path");
    const __vcPickerRoot = __vcPickerPath.join(process.env.LOCALAPPDATA || "", "VencordPickerResize");
    const __vcPickerCandidates = [
        __vcPickerPath.join(__vcPickerRoot, "picker-resize.js"),
        __vcPickerPath.join(__dirname, "..", "picker-resize", "picker-resize.js")
    ];
    const __vcPickerFile = __vcPickerCandidates.find(file => __vcPickerFs.existsSync(file));

    if (__vcPickerFile) {
        const __vcPickerSizeFile = __vcPickerPath.join(__vcPickerRoot, "size.json");
        const __vcPickerSettingsFile = __vcPickerPath.join(__dirname, "..", "settings", "settings.json");
        let __vcPickerHeight = null;

        try {
            const __vcPickerSize = JSON.parse(__vcPickerFs.readFileSync(__vcPickerSizeFile, "utf8"));
            if (Number.isFinite(__vcPickerSize.height) && __vcPickerSize.height >= 320) {
                __vcPickerHeight = Math.round(__vcPickerSize.height);
            }
        } catch { }

        if (__vcPickerHeight == null) {
            try {
                const __vcPickerSettings = JSON.parse(__vcPickerFs.readFileSync(__vcPickerSettingsFile, "utf8"));
                const __vcPickerLegacy = __vcPickerSettings.vcExpressionPickerSize;
                if (__vcPickerLegacy && Number.isFinite(__vcPickerLegacy.height) && __vcPickerLegacy.height >= 320) {
                    __vcPickerHeight = Math.round(__vcPickerLegacy.height);
                }
            } catch { }
        }

        const __vcPickerElectron = require("electron/renderer");
        __vcPickerElectron.contextBridge.exposeInMainWorld("VencordPickerResize", {
            savedHeight: __vcPickerHeight,
            saveHeight(height) {
                try {
                    if (!Number.isFinite(height) || height < 320 || height > 5000) return;
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
            .catch(err => console.error("[PickerResize]", err));
    }
} catch (err) {
    console.error("[PickerResize]", err);
}
/* VC_PICKER_RESIZE_LOADER_END */
'@

[System.IO.File]::WriteAllText($preloadPath, $content + $loader, [System.Text.UTF8Encoding]::new($false))

# Startup launcher
$vbs = @'
Set sh = CreateObject("WScript.Shell")
path = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\VencordPickerResize\watcher.ps1"
sh.Run "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & path & """", 0, False
'@
[System.IO.File]::WriteAllText($startupFile, $vbs, [System.Text.UTF8Encoding]::new($false))

# Start the watcher now through the same detached launcher used at logon.
if (-not $FromWatcher) {
    Start-Process -FilePath "wscript.exe" -ArgumentList "`"$startupFile`"" -WindowStyle Hidden | Out-Null
}

Write-Host ""
Write-Host "Installed successfully." -ForegroundColor Green
Write-Host "1. Restart Discord."
Write-Host "2. Open the GIF picker and use the small grip in its top-left corner."
Write-Host ""
Write-Host "Uninstall: run uninstall.cmd (or uninstall.ps1), then restart Discord."
