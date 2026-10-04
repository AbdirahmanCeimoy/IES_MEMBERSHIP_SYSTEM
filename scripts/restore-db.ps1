# =============================================================================
#  IES Membership System — MySQL Restore Script
# =============================================================================
#  Restores the ies_laravel database from a .sql backup produced by
#  scripts\backup-db.ps1 (or any phpMyAdmin / mysqldump export).
#
#  Usage:
#      # Restore the newest backup in scripts\backups\
#      powershell -ExecutionPolicy Bypass -File .\scripts\restore-db.ps1
#
#      # Restore a specific file
#      powershell -ExecutionPolicy Bypass -File .\scripts\restore-db.ps1 `
#          -SqlFile 'D:\path\to\ies_laravel_2026-10-04_030000.sql'
# =============================================================================

param(
    [string]$SqlFile
)

$MysqlExe       = 'C:\xampp\mysql\bin\mysql.exe'
$DbHost         = '127.0.0.1'
$DbPort         = 3307
$DbUser         = 'root'
$DbPassword     = ''
$Database       = 'ies_laravel'
$LocalBackupDir = 'D:\IES-PROJECT\IES_MEMBERSHIP_SYSTEM\scripts\backups'

$ErrorActionPreference = 'Stop'

if (-not $SqlFile) {
    $newest = Get-ChildItem $LocalBackupDir -Filter 'ies_laravel_*.sql' -ErrorAction SilentlyContinue |
              Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $newest) { throw "No .sql files found in $LocalBackupDir and no -SqlFile given." }
    $SqlFile = $newest.FullName
}

if (-not (Test-Path -LiteralPath $SqlFile)) { throw "File not found: $SqlFile" }

$size = [math]::Round((Get-Item -LiteralPath $SqlFile).Length / 1KB, 1)
Write-Host "About to restore '$Database' from:"
Write-Host "  $SqlFile  ($size KB)"
Write-Host ""
Write-Host "This will REPLACE every table in '$Database'. Current data in that database will be lost."
$confirm = Read-Host "Type YES to proceed"
if ($confirm -ne 'YES') { Write-Host "Aborted."; return }

$pwdArg = if ($DbPassword -ne '') { "--password=$DbPassword" } else { '' }

# Pipe the .sql file into mysql via cmd (preserves file encoding reliably)
$cmd = "`"$MysqlExe`" -h $DbHost -P $DbPort -u $DbUser $pwdArg --default-character-set=utf8mb4 < `"$SqlFile`""
Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Restoring ..."
cmd /c $cmd
if ($LASTEXITCODE -ne 0) { throw "Restore failed with exit $LASTEXITCODE." }

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Done."
Write-Host ""
Write-Host "Row counts after restore:"
& $MysqlExe -h $DbHost -P $DbPort -u $DbUser -e "SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA='$Database' ORDER BY TABLE_NAME;"
