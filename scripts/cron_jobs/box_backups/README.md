# Strapi → Box Backup Script

Exports a Strapi backup archive and uploads it to a Box folder using JWT (service account) authentication. Designed to run as a cron job on the same server that hosts Strapi.

---

## Prerequisites

- Python 3.9+
- Host Node.js/npm on `PATH` (if using nvm, set cron `PATH` — see below)
- A Box app configured with JWT authentication (see below)

---

## Box JWT Setup

1. Go to the [Box Developer Console](https://developer.box.com/) and open your app (or create one).
2. Choose **Custom App** → **Server Authentication (with JWT)**.
3. Under **Application Access**, leave it as **App Access Only** (the default).
4. Under **Application Scopes**, enable **Read and write all files and folders stored in Box**.
5. Click **Generate a Public/Private Keypair** — this downloads a JSON config file. Save it somewhere secure on the server (e.g. `/etc/box/jwt_config.json`).
6. Note the **Service Account email** shown on the Configuration page (it looks like `AutomationUser_12345@boxdevedition.com`).
7. **A Box Admin must authorize the app once**: Admin Console → **Apps** → **Custom Apps Manager** → find your app → **Authorize**. This is required for all JWT apps.
8. After authorization, share the **CMS Backups** folder with the service account email at **Editor** or **Co-owner** level.

---

## Finding the Box Folder ID

1. Open Box in a browser and navigate to **Files > Illinois NRS Resource Dump > CMS Backups**.
2. The folder ID is the number at the end of the URL:
   ```
   https://illinois.box.com/folder/123456789
                                    ^^^^^^^^^
   ```
3. Use that number as `BOX_FOLDER_ID` in your `.env`.

---

## Installation

Run these commands from the `box_backups` directory:

```bash
cd scripts/cron_jobs/box_backups

# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Configuration

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
BOX_JWT_CONFIG_PATH=/etc/box/jwt_config.json
BOX_FOLDER_ID=123456789
CMS_DIR=/home/deploy/illinois-nrs-dashboard/cms
```

---

## Running Manually

```bash
# From the box_backups directory with the venv active
source .venv/bin/activate
python backup_strapi.py
```

---

## Setting Up the Cron Job

### 1. Find the absolute paths you need

```bash
which python3   # prefer: .../box_backups/.venv/bin/python
which npm       # nvm: ~/.nvm/versions/node/.../bin/npm
```

### 2. Open the crontab editor

```bash
crontab -e
```

### 3. Add the cron entry

Cron does not load nvm. Put npm’s `bin` on `PATH` and log under your home directory:

```cron
PATH=/home/deploy/.nvm/versions/node/v21.7.3/bin:/usr/bin:/bin
0 2 * * * /home/deploy/illinois-nrs-dashboard/scripts/cron_jobs/box_backups/.venv/bin/python /home/deploy/illinois-nrs-dashboard/scripts/cron_jobs/box_backups/backup_strapi.py >> /home/deploy/logs/strapi-backup.log 2>&1
```

> Adjust paths (`dirname $(which npm)` for `PATH`). Use the venv Python so you don’t need to activate it.

### 4. Cron schedule reference

```
┌─── minute (0-59)
│ ┌─── hour (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─── month (1-12)
│ │ │ │ ┌─── day of week (0-7, 0 and 7 = Sunday)
│ │ │ │ │
0 2 * * *   → every day at 2:00 AM
0 2 * * 0   → every Sunday at 2:00 AM
0 2 1 * *   → first of every month at 2:00 AM
```

### 5. Verify the cron job was added

```bash
crontab -l
```

---

## Log Output

```bash
tail -f ~/logs/strapi-backup.log
```

---

## What the Script Does

1. Generates a date-stamped filename, e.g. `strapi-backup-2026-06-30`.
2. Runs `npm run strapi export -- --file strapi-backup-2026-06-30 --no-encrypt` inside the `CMS_DIR`.
3. Uploads the resulting `strapi-backup-2026-06-30.tar.gz` to the configured Box folder.
4. Deletes the local archive after a successful upload.
5. Exits with code `1` on any failure so cron can detect and report errors.
