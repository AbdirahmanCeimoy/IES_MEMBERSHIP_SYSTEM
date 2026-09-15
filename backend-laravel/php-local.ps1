[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$PhpArgs
)

$ErrorActionPreference = 'Stop'

$phpExe = 'C:\Users\apdir\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe'
$phpIni = Join-Path $PSScriptRoot 'php.ini'

if (-not (Test-Path $phpExe)) {
    throw "PHP executable not found at $phpExe"
}

if (-not (Test-Path $phpIni)) {
    throw "Project php.ini not found at $phpIni"
}

& $phpExe -c $phpIni @PhpArgs
exit $LASTEXITCODE
