# Moodle + GitHub Disaster Recovery Runbook
## Last Updated: March 6, 2026

## Goal
Protect GroupsGuru from local disk failure by keeping:
1. Project/version files in a private GitHub repository.
2. Full Moodle runtime backups (database + moodledata + code snapshot + GroupsGuru workspace snapshot) in an offsite folder (OneDrive recommended).

GitHub alone is not enough for Moodle recovery because `moodledata` and database dumps are runtime data.

## Current Environment Snapshot (March 6, 2026)
- Moodle root detected: `C:\moodle\server\moodle`
- Moodle data detected (from `config.php`): `C:\moodle\moodledata`
- mysqldump detected: `C:\moodle\server\mysql\bin\mysqldump.exe`
- Latest validated backup run: `20260306-075323`

## What Goes to GitHub
- Sprints, architecture docs, scripts, CSV planning assets, automation tooling.
- Backup scripts and recovery documentation.

## What Must NOT Go to GitHub
- `moodledata` runtime folder.
- SQL dumps.
- DB passwords, API keys, private certificates.
- Temporary backup folders (`_BACKUPS`, `moodle_backups`).

`.gitignore` in this repo already blocks these items.

## Step 1: Prepare GitHub (GitHub Desktop)
1. Open GitHub Desktop.
2. Add local repository: `c:\Users\jayar\OneDrive\Desktop\groupsguru`.
3. Publish repository as **Private**.
4. Commit and push regularly (daily or after each working session).

## Step 2: Configure Backup Script
1. Copy `_SCRIPTS/moodle_backup_config.example.ps1` to `_SCRIPTS/moodle_backup_config.ps1`.
2. Fill real values only if your paths differ from defaults.
3. Backup runner auto-reads Moodle `config.php` (when found) to pull:
   - `dataroot`
   - `dbname`
   - `dbuser`
   - `dbhost`
   - `dbport`
   - `dbpass` (only used in runtime, never written to Git)
4. Set DB password in `MOODLE_DB_PASSWORD` environment variable or config file if needed.
5. Runner auto-starts local MySQL when it is not reachable.
6. Run one command:

```powershell
powershell -ExecutionPolicy Bypass -File _SCRIPTS\run_moodle_backup.ps1
```

Safe default:
- Old backups are NOT pruned automatically.
- Use `-PruneOldBackups` only when you want cleanup.

Backup output contains:
- `db/<dbname>.sql`
- `moodle_code/`
- `moodledata/` (excluding volatile caches)
- `groupsguru_project/` (full project workspace snapshot)
- optional `*.zip` archive when `ZipRun = $true`
- `backup-manifest.json` with SHA-256 for DB dump

## Step 3: Schedule Daily Backups (Task Scheduler)
Create a daily Windows task (for example 2:30 AM):

```powershell
powershell.exe -ExecutionPolicy Bypass -File "c:\Users\jayar\OneDrive\Desktop\groupsguru\_SCRIPTS\run_moodle_backup.ps1"
```

## Restore Procedure (After Disk Failure)
1. Reinstall XAMPP (Apache + MariaDB), same major versions if possible.
2. Clone private GitHub repo with GitHub Desktop (for scripts/docs/version history).
3. Restore Moodle code from latest backup `moodle_code/` to `C:\xampp\htdocs\moodle`.
4. Restore `moodledata/` to `C:\moodledata`.
5. Create DB and import latest SQL dump:

```powershell
C:\xampp\mysql\bin\mysql.exe -u root -p groupsguru < C:\Users\jayar\OneDrive\MoodleBackups\<run-id>\db\groupsguru.sql
```

6. Update `config.php` (db creds, `$CFG->dataroot`, URLs).
7. Run Moodle upgrade if prompted: `php admin/cli/upgrade.php`.
8. Verify login, courses, quiz attempts, payments, cron.

## Monthly Safety Drill
1. Pick latest backup.
2. Perform test restore on a non-production machine.
3. Confirm site opens and critical data is present.
4. Log drill date and result in `Sprints/SPRINT-13-EXECUTION-LOG.md`.
