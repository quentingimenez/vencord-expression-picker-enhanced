# Keeps the enhanced expression picker loader present even after Vencord updates.
# Started hidden at logon by VencordPickerResize.vbs.
$ErrorActionPreference = "SilentlyContinue"

$root = Join-Path $env:LOCALAPPDATA "VencordPickerResize"
$installer = Join-Path $root "install.ps1"
$log = Join-Path $root "watcher.log"
$dist = Join-Path $env:APPDATA "Vencord\dist"
$preload = Join-Path $dist "preload.js"
$marker = "VC_PICKER_RESIZE_LOADER_START"

function Write-Log($message) {
    try {
        Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $message" -Encoding UTF8
    } catch { }
}

function Ensure-Patch {
    if (-not (Test-Path $preload)) { return }
    try {
        $content = [System.IO.File]::ReadAllText($preload)
        if ($content.Contains($marker)) { return }
    } catch { }

    for ($i = 0; $i -lt 20; $i++) {
        try {
            & powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File $installer -FromWatcher
            Write-Log "Loader re-applied (attempt $($i + 1))"
            return
        } catch {
            Start-Sleep -Milliseconds 500
        }
    }
    Write-Log "Failed to re-apply loader"
}

Ensure-Patch

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $dist
$watcher.Filter = "preload.js"
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::Size
$watcher.EnableRaisingEvents = $true

while ($true) {
    $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 60000)
    if (-not $change.TimedOut) {
        Start-Sleep -Milliseconds 700
        Ensure-Patch
    } else {
        Ensure-Patch
    }
}
