param(
    [Parameter(Mandatory = $true)]
    [string]$OldApiBase,

    [Parameter(Mandatory = $true)]
    [string]$NewApiBase
)

$ErrorActionPreference = 'Stop'

$env:OLD_API_BASE = $OldApiBase
$env:NEW_API_BASE = $NewApiBase

node (Join-Path $PSScriptRoot 'compare-backends.mjs')
