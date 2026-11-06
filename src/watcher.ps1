# Keeps the enhanced expression picker loader present even after Vencord updates.
# Started hidden at logon by VencordPickerResize.vbs.
$ErrorActionPreference = "SilentlyContinue"

$root = Join-Path $env:LOCALAPPDATA "VencordPickerResize"
$installer = Join-Path $root "install.ps1"
$log = Join-Path $root "watcher.log"
$dist = Join-Path $env:APPDATA "Vencord\dist"
$preload = Join-Path $dist "preload.js"
$marker = "VC_PICKER_RESIZE_LOADER_START"
$maxLogBytes = 1MB
$lastWatchLog = [datetime]::MinValue

function Write-Log($message) {
    try {
        if ((Test-Path $log) -and (Get-Item $log -ErrorAction SilentlyContinue).Length -gt $maxLogBytes) {
            Move-Item $log "$log.1" -Force -ErrorAction SilentlyContinue
        }
        Add-Content -Path $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $message" -Encoding UTF8
    } catch { }
}

# Avoid filling the log with one line every five seconds when Vencord is absent.
function Write-ThrottledLog($message) {
    $now = Get-Date
    if (($now - $lastWatchLog).TotalMinutes -lt 5) { return }
    $script:lastWatchLog = $now
    Write-Log $message
}

function Ensure-Patch {
    if (-not (Test-Path $preload)) { return }
    if (-not (Test-Path $installer)) {
        Write-Log "Installer not found: $installer"
        return
    }

    try {
        $content = [System.IO.File]::ReadAllText($preload)
        if ($content.Contains($marker)) { return }
    } catch { }

    for ($i = 0; $i -lt 20; $i++) {
        try {
            & powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File $installer -FromWatcher
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Loader re-applied (attempt $($i + 1))"
                return
            }
            Write-Log "Installer exited with code $LASTEXITCODE (attempt $($i + 1))"
        } catch {
            Write-Log "Installer threw: $($_.Exception.Message)"
        }
        Start-Sleep -Milliseconds 500
    }
    Write-Log "Failed to re-apply loader"
}

# Prevent two watcher instances from fighting over preload.js.
$mutex = $null
try {
    $mutex = New-Object System.Threading.Mutex -ArgumentList @($false, "VencordPickerResizeWatcher")
    try {
        if (-not $mutex.WaitOne(0)) { exit 0 }
    } catch [System.Threading.AbandonedMutexException] {
        # The previous watcher crashed; this process now owns the mutex.
    }
} catch {
    Write-Log "Could not create watcher mutex: $($_.Exception.Message)"
}

Ensure-Patch

function New-PreloadWatcher {
    if (-not (Test-Path $dist)) { return $null }

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $dist
    $watcher.Filter = "preload.js"
    $watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::Size
    $watcher.EnableRaisingEvents = $true
    return $watcher
}

# Vencord may not be installed yet at logon. Wait for its dist folder instead
# of crashing the watcher process.
$watcher = $null
while (-not $watcher) {
    try {
        $watcher = New-PreloadWatcher
    } catch {
        Write-ThrottledLog "Cannot watch $dist yet: $($_.Exception.Message)"
    }
    if (-not $watcher) {
        Start-Sleep -Seconds 5
    }
}

Write-Log "Watcher started for $preload"

while ($true) {
    try {
        $change = $watcher.WaitForChanged([System.IO.WatcherChangeTypes]::All, 60000)
        if (-not $change.TimedOut) {
            Start-Sleep -Milliseconds 700
        }
        Ensure-Patch
    } catch {
        Write-Log "Watcher error: $($_.Exception.Message)"
        try { $watcher.Dispose() } catch { }
        $watcher = $null
        while (-not $watcher) {
            try {
                $watcher = New-PreloadWatcher
            } catch {
                Write-ThrottledLog "Cannot recreate watcher: $($_.Exception.Message)"
            }
            if (-not $watcher) {
                Start-Sleep -Seconds 5
            }
        }
        Start-Sleep -Seconds 2
    }
}
