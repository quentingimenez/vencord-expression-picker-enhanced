#Requires -Version 5.1
# Builds the Windows installer/uninstaller for Vencord Expression Picker Enhanced.
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$compilerCandidates = @(
    (Join-Path $env:WINDIR "Microsoft.NET\Framework64\v4.0.30319\csc.exe"),
    (Join-Path $env:WINDIR "Microsoft.NET\Framework\v4.0.30319\csc.exe")
)
$compiler = $compilerCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $compiler) {
    throw "The .NET Framework C# compiler (csc.exe) was not found."
}

$dist = Join-Path $root "dist"
New-Item -ItemType Directory -Force -Path $dist | Out-Null
$output = Join-Path $dist "VencordExpressionPickerEnhanced-Setup.exe"

$resources = @(
    (Join-Path $root "install.ps1"),
    (Join-Path $root "uninstall.ps1"),
    (Join-Path $root "src\picker-resize.js"),
    (Join-Path $root "src\watcher.ps1"),
    (Join-Path $root "assets\app.ico")
)
foreach ($resource in $resources) {
    if (-not (Test-Path $resource)) {
        throw "Missing build resource: $resource"
    }
}

& $compiler `
    /nologo /codepage:65001 /target:winexe /platform:anycpu /optimize+ `
    /out:"$output" `
    /win32icon:"$root\assets\app.ico" `
    /win32manifest:"$PSScriptRoot\app.manifest" `
    /r:System.Windows.Forms.dll /r:System.Drawing.dll `
    /resource:"$root\install.ps1",payload.install.ps1 `
    /resource:"$root\uninstall.ps1",payload.uninstall.ps1 `
    /resource:"$root\src\picker-resize.js",payload.picker-resize.js `
    /resource:"$root\src\watcher.ps1",payload.watcher.ps1 `
    /resource:"$root\assets\app.ico",payload.app.ico `
    "$PSScriptRoot\Installer.cs"

if ($LASTEXITCODE -ne 0) {
    throw "csc.exe failed with exit code $LASTEXITCODE."
}

Get-Item $output | Select-Object FullName, Length | Format-List
