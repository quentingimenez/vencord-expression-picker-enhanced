#Requires -Version 5.1
# Vencord Expression Picker Enhanced - uninstaller
param(
    # Used by the test suite to avoid touching the real HKCU uninstall entry.
    [switch]$NoRegistry
)
$ErrorActionPreference = "Stop"

$vencordRoot = Join-Path $env:APPDATA "Vencord"
$preloadPath = Join-Path $vencordRoot "dist\preload.js"
$installDir = Join-Path $env:LOCALAPPDATA "VencordPickerResize"
$installedWatcher = Join-Path $installDir "watcher.ps1"
$startupFile = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup\VencordPickerResize.vbs"

# Replace a file atomically and verify the written content. preload.js is a
# critical Vencord file and must stay readable even if the write is interrupted.
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

Write-Host "Vencord Expression Picker Enhanced - uninstaller" -ForegroundColor Cyan

# Stop the watcher if it is running.
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq "powershell.exe" -and $_.CommandLine -and $_.CommandLine.Contains($installedWatcher) } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

# Remove the loader block from the current preload.js instead of restoring
# an old backup: after a Vencord update the backup can be stale and restoring
# it would downgrade Vencord's preload.
$pattern = '(?s)\r?\n?/\* VC_PICKER_RESIZE_LOADER_START \*/.*?/\* VC_PICKER_RESIZE_LOADER_END \*/'
$loaderMarker = "VC_PICKER_RESIZE_LOADER_START"
$backupPath = "$preloadPath.bak-picker-resize"
$cleanupFailed = $false

if (Test-Path $preloadPath) {
    try {
        $content = [System.IO.File]::ReadAllText($preloadPath)
        if ($content.Contains($loaderMarker)) {
            $cleaned = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, "")
            if ($cleaned.Contains($loaderMarker)) {
                throw "the loader block could not be removed completely"
            }
            Write-FileAtomic $preloadPath $cleaned
            Write-Host "Loader removed from preload.js."
        } else {
            Write-Host "preload.js has no loader block; leaving it unchanged."
        }
    } catch {
        $cleanupFailed = $true
        Write-Host "Warning: could not clean preload.js: $($_.Exception.Message)" -ForegroundColor Yellow
        try {
            $currentLength = 0
            if (Test-Path $preloadPath) {
                $currentLength = (Get-Item $preloadPath -ErrorAction SilentlyContinue).Length
            }
            if ($currentLength -eq 0 -and (Test-Path $backupPath)) {
                Copy-Item $backupPath $preloadPath -Force
                Write-Host "Restored preload.js from backup because the current file was empty." -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Warning: could not restore preload.js from backup: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "preload.js not found; nothing to clean."
}

if ($cleanupFailed) {
    Write-Host ""
    Write-Host "Uninstall incomplete: preload.js could not be cleaned." -ForegroundColor Red
    Write-Host "The installed files and the Apps & features entry were kept so you can retry."
    Write-Host "Close Discord/Vencord, then run the uninstaller again."
    if (Test-Path $startupFile) {
        try {
            Start-Process -FilePath "wscript.exe" -ArgumentList "`"$startupFile`"" -WindowStyle Hidden | Out-Null
        } catch { }
    }
    exit 1
}

# The preload is clean, so the installation can be removed safely.
Remove-Item $startupFile -Force -ErrorAction SilentlyContinue
Remove-Item $backupPath -Force -ErrorAction SilentlyContinue

# Remove the local script, watcher and saved size.
Remove-Item $installDir -Recurse -Force -ErrorAction SilentlyContinue

# Remove the Windows "Apps & features" entry.
if (-not $NoRegistry) {
    $uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\VencordExpressionPickerEnhanced"
    Remove-Item $uninstallKey -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Uninstalled." -ForegroundColor Green
Write-Host "Restart Discord to finish."
