#Requires -Version 5.1
# Builds the setup executable, the manual-install ZIP and SHA256SUMS.txt.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$package = Get-Content (Join-Path $root "package.json") -Raw | ConvertFrom-Json
$version = $package.version
$dist = Join-Path $root "dist"
$stage = Join-Path $env:TEMP ("VencordExpressionPickerEnhanced-" + [guid]::NewGuid().ToString("N"))
$setup = Join-Path $dist "VencordExpressionPickerEnhanced-Setup.exe"
$zip = Join-Path $dist "VencordExpressionPickerEnhanced-v$version.zip"
$sums = Join-Path $dist "SHA256SUMS.txt"

function Copy-ReleaseFile([string]$source, [string]$destination) {
    if (-not (Test-Path $source)) { throw "Missing release file: $source" }
    $parent = Split-Path -Parent $destination
    if ($parent) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
    Copy-Item $source $destination -Force
}

try {
    node (Join-Path $root "scripts\build-renderer.js")
    if ($LASTEXITCODE -ne 0) { throw "Renderer build failed." }

    & (Join-Path $root "installer\build-setup.ps1")
    if (-not (Test-Path $setup)) { throw "Setup executable was not produced." }

    New-Item -ItemType Directory -Force -Path $stage | Out-Null
    foreach ($file in @("install.cmd", "install.ps1", "uninstall.cmd", "uninstall.ps1", "README.md", "LICENSE", "THIRD_PARTY_NOTICES.md", "AUDIT.md")) {
        Copy-ReleaseFile (Join-Path $root $file) (Join-Path $stage $file)
    }
    Copy-ReleaseFile (Join-Path $dist "picker-resize.js") (Join-Path $stage "picker-resize.js")
    Copy-ReleaseFile (Join-Path $root "src\watcher.ps1") (Join-Path $stage "src\watcher.ps1")
    Copy-ReleaseFile (Join-Path $root "src\loader.js") (Join-Path $stage "src\loader.js")
    Copy-ReleaseFile (Join-Path $root "assets\preview.svg") (Join-Path $stage "assets\preview.svg")

    Remove-Item $zip -Force -ErrorAction SilentlyContinue
    Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zip -Force

    $lines = @()
    foreach ($file in @($setup, $zip)) {
        $hash = (Get-FileHash $file -Algorithm SHA256).Hash.ToLower()
        $lines += "$hash  $([System.IO.Path]::GetFileName($file))"
    }
    Set-Content -Path $sums -Value $lines -Encoding ASCII

    Write-Host "Release artifacts ready:" -ForegroundColor Green
    Get-Item $setup, $zip, $sums | Select-Object Name, Length | Format-Table -AutoSize
} finally {
    Remove-Item $stage -Recurse -Force -ErrorAction SilentlyContinue
}
