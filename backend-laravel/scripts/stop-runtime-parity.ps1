$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path (Join-Path $root '.runtime-logs') 'runtime-pids.json'

if (-not (Test-Path $pidFile)) {
    Write-Host 'No runtime PID file found.'
    exit 0
}

$pids = Get-Content $pidFile | ConvertFrom-Json

foreach ($processId in @($pids.nestPid, $pids.laravelPid)) {
    if (-not $processId) {
        continue
    }

    try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
    } catch {
    }
}

Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
Write-Host 'Runtime parity processes stopped.'
