$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $root 'backend'
$laravelDir = Join-Path $root 'backend-laravel'
$logDir = Join-Path $root '.runtime-logs'
$pidFile = Join-Path $logDir 'runtime-pids.json'
$phpPath = 'C:\Users\apdir\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe'
$mysqlAdminPath = 'C:\xampp\mysql\bin\mysqladmin.exe'
$mysqlPath = 'C:\xampp\mysql\bin\mysql.exe'
$mysqldPath = 'C:\xampp\mysql\bin\mysqld.exe'
$mysqlDefaultsFile = 'C:\xampp\mysql\bin\my.ini'
$nestBase = 'http://127.0.0.1:5000/api'
$laravelPort = 8001
$laravelBase = "http://127.0.0.1:$laravelPort/api"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Wait-HttpReady {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                return
            }
        } catch {
        }

        Start-Sleep -Seconds 1
    }

    throw "Timed out waiting for $Url"
}

if (-not (Get-Process mysqld -ErrorAction SilentlyContinue)) {
    Start-Process -FilePath $mysqldPath -ArgumentList "--defaults-file=$mysqlDefaultsFile", '--standalone' | Out-Null
    Start-Sleep -Seconds 2
}

& $mysqlAdminPath --protocol=tcp --host=127.0.0.1 --port=3307 -u root ping | Out-Null
& $mysqlPath --protocol=tcp --host=127.0.0.1 --port=3307 -u root -e "CREATE DATABASE IF NOT EXISTS ies_laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | Out-Null
& $phpPath -c (Join-Path $laravelDir 'php.ini') artisan migrate --force | Out-Null
$nestStdout = Join-Path $logDir 'nest.stdout.log'
$nestStderr = Join-Path $logDir 'nest.stderr.log'
$laravelStdout = Join-Path $logDir 'laravel.stdout.log'
$laravelStderr = Join-Path $logDir 'laravel.stderr.log'

$nestProcess = Start-Process -FilePath 'cmd.exe' `
    -ArgumentList '/c', 'npm run start:dev' `
    -WorkingDirectory $backendDir `
    -RedirectStandardOutput $nestStdout `
    -RedirectStandardError $nestStderr `
    -PassThru

$laravelProcess = Start-Process -FilePath $phpPath `
    -ArgumentList '-c', (Join-Path $laravelDir 'php.ini'), '-S', "127.0.0.1:$laravelPort", '-t', 'public', 'public\index.php' `
    -WorkingDirectory $laravelDir `
    -RedirectStandardOutput $laravelStdout `
    -RedirectStandardError $laravelStderr `
    -PassThru

@{
    nestPid = $nestProcess.Id
    laravelPid = $laravelProcess.Id
} | ConvertTo-Json | Set-Content $pidFile

Wait-HttpReady -Url "$nestBase/health/live"
Wait-HttpReady -Url "$laravelBase/health/live"

$env:OLD_API_BASE = $nestBase
$env:NEW_API_BASE = $laravelBase
node (Join-Path $PSScriptRoot 'compare-backends.mjs')

Write-Host "Parity runtime completed. Logs: $logDir"
