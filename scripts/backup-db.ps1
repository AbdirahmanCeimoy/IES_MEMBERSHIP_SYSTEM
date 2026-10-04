# =============================================================================
#  IES Membership System — MySQL Backup Script
# =============================================================================
#  Dumps the ies_laravel database to a timestamped .sql file, keeps the last
#  N backups, and (optionally) copies the newest dump into a cloud-synced
#  folder so a dead PC does not take the data with it.
#
#  Run manually:
#      powershell -ExecutionPolicy Bypass -File .\scripts\backup-db.ps1
#
#  Schedule it (Windows Task Scheduler): see scripts\README-BACKUPS.md
# =============================================================================

# ---- CONFIG --- edit these if your setup changes ----------------------------
$MysqlDumpExe   = 'C:\xampp\mysql\bin\mysqldump.exe'
$DbHost         = '127.0.0.1'
$DbPort         = 3307
$DbUser         = 'root'
$DbPassword     = ''                              # empty for XAMPP default
$Database       = 'ies_laravel'

# Local backup folder — kept with the project (NOT in Git, see .gitignore note)
$LocalBackupDir = 'D:\IES-PROJECT\IES_MEMBERSHIP_SYSTEM\scripts\backups'

# Off-site copy — set to $null to skip, or point at a cloud-synced folder
# (OneDrive / Google Drive / Dropbox) so the backup leaves this machine.
$CloudBackupDir = $null
# Example:
# $CloudBackupDir = 'C:\Users\Abdirahman Ceimoy\OneDrive\IES-DB-Backups'

# How many timestamped dumps to keep locally (older ones are removed)
$KeepLast       = 30
# -----------------------------------------------------------------------------

$ErrorActionPreference = 'Stop'
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
$outFile = Join-Path $LocalBackupDir "ies_laravel_$stamp.sql"

# Make sure the local folder exists
New-Item -ItemType Directory -Force -Path $LocalBackupDir | Out-Null

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Backing up '$Database' to $outFile ..."

# Build mysqldump arguments
$dumpArgs = @(
    "-h", $DbHost
    "-P", "$DbPort"
    "-u", $DbUser
    "--single-transaction"      # consistent snapshot without locking tables
    "--routines"                # stored procedures + functions
    "--triggers"
    "--events"
    "--default-character-set=utf8mb4"
    "--add-drop-database"
    "--databases", $Database
)
if ($DbPassword -ne '') { $dumpArgs += "--password=$DbPassword" }

# Run mysqldump and send its stdout straight to the .sql file
& $MysqlDumpExe @dumpArgs | Out-File -FilePath $outFile -Encoding utf8
if ($LASTEXITCODE -ne 0 -or -not (Test-Path $outFile) -or (Get-Item $outFile).Length -lt 500) {
    throw "mysqldump failed (exit $LASTEXITCODE) or produced an empty file."
}

$sizeKB = [math]::Round((Get-Item $outFile).Length / 1KB, 1)
Write-Host "[$(Get-Date -Format 'HH:mm:ss')] OK - wrote $sizeKB KB."

# Rotate: keep only the newest $KeepLast dumps
$all = Get-ChildItem $LocalBackupDir -Filter 'ies_laravel_*.sql' | Sort-Object LastWriteTime -Descending
if ($all.Count -gt $KeepLast) {
    $old = $all | Select-Object -Skip $KeepLast
    foreach ($f in $old) {
        Remove-Item $f.FullName -Force
        Write-Host "  rotated out: $($f.Name)"
    }
}

# Off-site copy
if ($CloudBackupDir) {
    New-Item -ItemType Directory -Force -Path $CloudBackupDir | Out-Null
    Copy-Item -Path $outFile -Destination $CloudBackupDir -Force
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Copied to cloud folder: $CloudBackupDir"
}

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Done."
