[CmdletBinding()]
param(
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$laravelDir = Join-Path $root 'backend-laravel'
$phpPath = 'C:\Users\apdir\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe'
$mysqlAdminPath = 'C:\xampp\mysql\bin\mysqladmin.exe'
$mysqlPath = 'C:\xampp\mysql\bin\mysql.exe'
$mysqldPath = 'C:\xampp\mysql\bin\mysqld.exe'
$mysqlDefaultsFile = 'C:\xampp\mysql\bin\my.ini'

if (-not (Get-Process mysqld -ErrorAction SilentlyContinue)) {
    Start-Process -FilePath $mysqldPath -ArgumentList "--defaults-file=$mysqlDefaultsFile", '--standalone' | Out-Null
    Start-Sleep -Seconds 2
}

& $mysqlAdminPath --protocol=tcp --host=127.0.0.1 --port=3307 -u root ping | Out-Null
& $mysqlPath --protocol=tcp --host=127.0.0.1 --port=3307 -u root -e "CREATE DATABASE IF NOT EXISTS ies_laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | Out-Null

$arguments = @(
    '-c',
    (Join-Path $laravelDir 'php.ini'),
    (Join-Path $laravelDir 'scripts\migrate_legacy_sqlite_to_mysql.php')
)

if ($Force) {
    $arguments += '--force'
}

& $phpPath @arguments
