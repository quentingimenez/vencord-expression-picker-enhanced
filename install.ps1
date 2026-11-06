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
$installedLoader = Join-Path $installDir "loader.js"
$installedUninstaller = Join-Path $installDir "uninstall.ps1"
$startupDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
$startupFile = Join-Path $startupDir "VencordPickerResize.vbs"

function Resolve-Source([string]$name) {
    $candidates = @(
        (Join-Path $repoRoot "dist\$name"),
        (Join-Path $repoRoot "src\$name"),
        (Join-Path $repoRoot $name)
    )
    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) { return $candidate }
    }
    throw "Missing $name (looked in dist\, src\ and the installer folder)."
}

function Copy-FileIfChanged([string]$source, [string]$destination) {
    $src = [System.IO.Path]::GetFullPath($source)
    $dst = [System.IO.Path]::GetFullPath($destination)
    if ($src -eq $dst) { return }

    if (Test-Path $dst) {
        $sourceHash = (Get-FileHash $src -Algorithm SHA256).Hash
        $destinationHash = (Get-FileHash $dst -Algorithm SHA256).Hash
        if ($sourceHash -eq $destinationHash) { return }
    }

    Copy-Item $src $dst -Force
}

# Replace a file atomically and verify the written content. preload.js is a
# critical Vencord file: a power loss or a full disk must never leave it
# truncated.
function Write-FileAtomic([string]$path, [string]$content) {
    $directory = Split-Path -Parent $path
    if (-not $directory) { $directory = "." }

    $name = [System.IO.Path]::GetFileName($path)
    $suffix = [guid]::NewGuid().ToString("N")
    $tempPath = Join-Path $directory ("." + $name + "." + $suffix + ".tmp")
    $backupPath = Join-Path $directory ("." + $name + "." + $suffix + ".bak")
    $replaced = $false
    $keepBackup = $false

    try {
        [System.IO.File]::WriteAllText($tempPath, $content, [System.Text.UTF8Encoding]::new($false))

        if ([System.IO.File]::Exists($path)) {
            # File.Replace is atomic on NTFS and keeps the original as a backup
            # until the new content has been verified.
            [System.IO.File]::Replace($tempPath, $path, $backupPath, $true)
            $replaced = $true
        } else {
            Move-Item -LiteralPath $tempPath -Destination $path -Force
            $replaced = $true
        }

        $written = [System.IO.File]::ReadAllText($path)
        if ($written -ne $content) {
            throw "Atomic write verification failed for $path"
        }

        Remove-Item $backupPath -Force -ErrorAction SilentlyContinue
    } catch {
        if ($replaced) {
            $restored = $false
            try {
                if (Test-Path $backupPath) {
                    Copy-Item $backupPath $path -Force
                    $restored = $true
                } else {
                    Remove-Item $path -Force -ErrorAction SilentlyContinue
                    $restored = $true
                }
            } catch { }
            if (-not $restored) {
                $keepBackup = $true
                Write-Warning "Could not restore $path. The backup was kept at $backupPath."
            }
        }
        throw
    } finally {
        Remove-Item $tempPath -Force -ErrorAction SilentlyContinue
        if (-not $keepBackup) {
            Remove-Item $backupPath -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "Vencord Expression Picker Enhanced - installer" -ForegroundColor Cyan

if (-not (Test-Path $preloadPath)) {
    throw "Vencord was not found at:`n  $preloadPath`nInstall Vencord desktop first (official installer)."
}

$sourceScript = Resolve-Source "picker-resize.js"
$sourceWatcher = Resolve-Source "watcher.ps1"
$sourceLoader = Resolve-Source "loader.js"
$sourceUninstaller = Resolve-Source "uninstall.ps1"

if (Get-Process Discord -ErrorAction SilentlyContinue) {
    Write-Host "Discord is running. Restart it after installation." -ForegroundColor Yellow
}

New-Item -ItemType Directory -Force -Path $installDir | Out-Null
Copy-FileIfChanged $sourceScript $installedScript
Copy-FileIfChanged $sourceWatcher $installedWatcher
Copy-FileIfChanged $sourceLoader $installedLoader
Copy-FileIfChanged $sourceUninstaller $installedUninstaller

# Keep a self-contained installer in the install folder so the watcher can
# re-apply the loader after Vencord updates.
$currentInstaller = $PSCommandPath
if (-not $currentInstaller) {
    $currentInstaller = $MyInvocation.MyCommand.Path
}
if ($currentInstaller) {
    Copy-FileIfChanged $currentInstaller $installerPath
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
    Write-FileAtomic $backupPath $content
}

# Keep this removal pattern in sync with uninstall.ps1 (covered by tests).
$pattern = '(?s)\r?\n?/\* VC_PICKER_RESIZE_LOADER_START \*/.*?/\* VC_PICKER_RESIZE_LOADER_END \*/'
$content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, "")

$loader = [System.IO.File]::ReadAllText($sourceLoader)
$loader = $loader.TrimEnd("`r", "`n")
if (-not $loader.StartsWith("/* VC_PICKER_RESIZE_LOADER_START */", [System.StringComparison]::Ordinal)) {
    throw "loader.js is missing the start marker."
}
if (-not $loader.EndsWith("/* VC_PICKER_RESIZE_LOADER_END */", [System.StringComparison]::Ordinal)) {
    throw "loader.js is missing the end marker."
}

$patched = $content + "`r`n" + $loader
$startCount = ([System.Text.RegularExpressions.Regex]::Matches(
    $patched,
    [System.Text.RegularExpressions.Regex]::Escape("VC_PICKER_RESIZE_LOADER_START")
)).Count
$endCount = ([System.Text.RegularExpressions.Regex]::Matches(
    $patched,
    [System.Text.RegularExpressions.Regex]::Escape("VC_PICKER_RESIZE_LOADER_END")
)).Count

if ($startCount -ne 1 -or $endCount -ne 1) {
    throw "Refusing to patch preload.js: expected exactly one loader block, found $startCount start and $endCount end markers."
}
if (-not $patched.StartsWith($content, [System.StringComparison]::Ordinal)) {
    throw "Refusing to patch preload.js: the original content was not preserved."
}
if (-not $patched.EndsWith($loader, [System.StringComparison]::Ordinal)) {
    throw "Refusing to patch preload.js: the loader was not appended at the end of the file."
}

Write-FileAtomic $preloadPath $patched

# Startup launcher
$vbs = @'
Set sh = CreateObject("WScript.Shell")
path = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\VencordPickerResize\watcher.ps1"
sh.Run "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & path & """", 0, False
'@
Write-FileAtomic $startupFile $vbs

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
