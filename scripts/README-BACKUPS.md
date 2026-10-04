# IES Membership System — Database Backups

Short, practical guide for keeping the `ies_laravel` MySQL database safe on
XAMPP (MariaDB 10.4, port **3307**).

## Files in this folder

| File | What it does |
|---|---|
| `backup-db.ps1` | Dumps `ies_laravel` to a timestamped `.sql` under `scripts\backups\`, rotates to the last 30 copies, optionally copies the dump to a cloud-synced folder. |
| `restore-db.ps1` | Restores a `.sql` back into `ies_laravel`. Defaults to the newest backup; pass `-SqlFile` for a specific one. |
| `backups\` | Local timestamped dumps live here (git-ignored). |

## 1. Run a backup right now (one command)

```powershell
powershell -ExecutionPolicy Bypass -File "D:\IES-PROJECT\IES_MEMBERSHIP_SYSTEM\scripts\backup-db.ps1"
```

Expected output:

```
[22:35:14] Backing up 'ies_laravel' to ...\backups\ies_laravel_2026-10-04_223514.sql ...
[22:35:15] OK — wrote 42.1 KB.
[22:35:15] Done.
```

## 2. Automate it — Windows Task Scheduler (every day at 3 AM)

1. Open **Task Scheduler** (Start → type "Task Scheduler").
2. **Create Basic Task** → Name: `IES DB Backup` → Next.
3. Trigger: **Daily** → Start at **03:00 AM** → Next.
4. Action: **Start a program** → Next.
5. **Program/script**: `powershell.exe`
   **Add arguments**:
   ```
   -ExecutionPolicy Bypass -File "D:\IES-PROJECT\IES_MEMBERSHIP_SYSTEM\scripts\backup-db.ps1"
   ```
6. Finish. Then open the task's **Properties** →
   - Check **"Run whether user is logged on or not"**.
   - Check **"Run with highest privileges"** (so it can read `C:\xampp`).

Verify after one day — a new `.sql` should appear in `scripts\backups\`.

## 3. Off-site copy — the single most important step

**A backup on the same PC does not survive if the PC dies.** Open
`backup-db.ps1`, find the `$CloudBackupDir` line, and point it at a folder
that syncs to the cloud:

```powershell
$CloudBackupDir = 'C:\Users\Abdirahman Ceimoy\OneDrive\IES-DB-Backups'
# or
$CloudBackupDir = 'C:\Users\Abdirahman Ceimoy\Google Drive\IES-DB-Backups'
# or
$CloudBackupDir = 'C:\Users\Abdirahman Ceimoy\Dropbox\IES-DB-Backups'
```

OneDrive is already installed on Windows and syncs automatically. Create the
folder once in File Explorer; the script will reuse it.

## 4. Restore (practice before you need it)

```powershell
# Restore the newest backup
powershell -ExecutionPolicy Bypass -File "D:\IES-PROJECT\IES_MEMBERSHIP_SYSTEM\scripts\restore-db.ps1"

# Restore a specific file
powershell -ExecutionPolicy Bypass -File "D:\IES-PROJECT\IES_MEMBERSHIP_SYSTEM\scripts\restore-db.ps1" `
    -SqlFile "D:\IES-PROJECT\IES_MEMBERSHIP_SYSTEM\scripts\backups\ies_laravel_2026-10-04_030000.sql"
```

The script asks for a `YES` confirmation before overwriting.

**Do a test restore on a scratch database at least once** so you know the
process works. Change `$Database = 'ies_laravel'` in `restore-db.ps1` to
`$Database = 'ies_laravel_test'`, run it, and check the row counts match.

## 5. Rules of thumb

- **3-2-1 rule**: 3 copies of the data, on 2 different media, with 1 copy
  off-site. The script + OneDrive sync covers this: local disk + OneDrive cloud + 30 historical versions.
- Keep **daily backups**, not just "the latest". A corruption you didn't
  notice for a week is harmless if you have 7 days of history.
- **Never store the backup folder inside Git.** It is already excluded by
  `scripts/backups/.gitignore` (see note below).
- Run the backup **before every big change** (migrations, schema edits,
  seed data imports). Takes 1 second.
- Once a quarter, **actually restore** a backup into a scratch DB and open
  it in phpMyAdmin. An untested backup is not a backup.

## 6. What this won't protect you from

- **Live data corruption** (the `ibdata1` disaster you just had): the backup
  catches whatever state the DB was in at dump time; if the DB was already
  corrupt at that moment, the dump will be too. That's why scheduled, daily
  dumps matter — yesterday's backup is still clean even if today's is broken.
- **Deleted rows between backups**: a daily backup at 3 AM won't recover a
  row the user deleted at 2 PM the same day. For that, you'd need binary
  log replication, which is a production concern — not needed yet.
- **Secret leakage**: `.sql` dumps contain real data, including hashed
  passwords and emails. If you push `scripts\backups\` to GitHub by mistake,
  that data is public. The `.gitignore` entry in `scripts\backups\` is
  there to prevent exactly this.
