#Requires -Version 5.1
# Vencord Expression Picker Enhanced - uninstaller
$ErrorActionPreference = "Stop"

$vencordRoot = Join-Path $env:APPDATA "Vencord"
$preloadPath = Join-Path $vencordRoot "dist\preload.js"
$installDir = Join-Path $env:LOCALAPPDATA "VencordPickerResize"
$installedWatcher = Join-Path $installDir "watcher.ps1"
$startupFile = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup\VencordPickerResize.vbs"

Write-Host "Vencord Expression Picker Enhanced - uninstaller" -ForegroundColor Cyan

# Stop the watcher if it is running.
Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq "powershell.exe" -and $_.CommandLine -and $_.CommandLine.Contains($installedWatcher) } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

# Remove the startup launcher.
Remove-Item $startupFile -Force -ErrorAction SilentlyContinue

# Restore preload.js from the backup, or remove the loader block.
if (Test-Path $preloadPath) {
    $pattern = '(?s)\r?\n?/\* VC_PICKER_RESIZE_LOADER_START \*/.*?/\* VC_PICKER_RESIZE_LOADER_END \*/'
    $backupPath = "$preloadPath.bak-picker-resize"
    $restored = $false

    if (Test-Path $backupPath) {
        $backup = [System.IO.File]::ReadAllText($backupPath)
        if (-not $backup.Contains("VC_PICKER_RESIZE_LOADER_START")) {
            Copy-Item $backupPath $preloadPath -Force
            $restored = $true
        }
    }

    if (-not $restored) {
        $content = [System.IO.File]::ReadAllText($preloadPath)
        $content = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, "")
        [System.IO.File]::WriteAllText($preloadPath, $content, [System.Text.UTF8Encoding]::new($false))
    }

    Remove-Item $backupPath -Force -ErrorAction SilentlyContinue
}

# Remove the local script, watcher and saved size.
Remove-Item $installDir -Recurse -Force -ErrorAction SilentlyContinue

# Remove the Windows "Apps & features" entry.
$uninstallKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\VencordExpressionPickerEnhanced"
Remove-Item $uninstallKey -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Uninstalled." -ForegroundColor Green
Write-Host "Restart Discord to finish."
