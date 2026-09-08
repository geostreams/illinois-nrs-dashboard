#!/usr/bin/env python3
"""
Exports a Strapi backup and uploads it to Box.

Expected env vars (or .env file in this script's directory):
  BOX_JWT_CONFIG_PATH  — absolute path to the Box JWT JSON config file
  BOX_FOLDER_ID        — ID of the destination Box folder
  CMS_DIR              — absolute path to the Strapi cms directory
"""

import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

from boxsdk import JWTAuth, Client
from dotenv import load_dotenv

def load_config() -> tuple[str, str, Path]:
    """Loads required env vars (from the environment or a .env file in this
    script's directory) and returns them.

    Raises a RuntimeError with a clean message (caught by main's caller) if
    a required var is missing, instead of letting a KeyError propagate at
    import time.
    """
    load_dotenv(Path(__file__).parent / ".env")

    required_vars = ("BOX_JWT_CONFIG_PATH", "BOX_FOLDER_ID", "CMS_DIR")
    missing = [name for name in required_vars if name not in os.environ]
    if missing:
        raise RuntimeError(
            f"Missing required env var(s): {', '.join(missing)} "
            f"(set them in the environment or in a .env file in {Path(__file__).parent})"
        )

    box_jwt_config_path = os.environ["BOX_JWT_CONFIG_PATH"]
    box_folder_id = os.environ["BOX_FOLDER_ID"]
    cms_dir = Path(os.environ["CMS_DIR"])
    return box_jwt_config_path, box_folder_id, cms_dir


def run_strapi_export(cms_dir: Path, filename_stem: str) -> Path:
    """Runs `npm run strapi export` and returns the path to the produced archive."""
    cmd = [
        "npm", "run", "strapi", "export", "--",
        "--file", filename_stem,
        "--no-encrypt",
    ]
    print(f"Running export: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=cms_dir, capture_output=True, text=True)

    if result.returncode != 0:
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
        raise RuntimeError(f"Strapi export failed with exit code {result.returncode}")

    print(result.stdout)

    # Strapi appends .tar.gz automatically
    archive = cms_dir / f"{filename_stem}.tar.gz"
    if not archive.exists():
        raise FileNotFoundError(f"Expected export archive not found: {archive}")

    return archive


def upload_to_box(client: Client, folder_id: str, file_path: Path) -> None:
    """Uploads file_path to the Box folder with the given ID."""
    folder = client.folder(folder_id)

    # Check if a file with the same name already exists and version it
    existing_items = {item.name: item for item in folder.get_items()}
    file_name = file_path.name

    with open(file_path, "rb") as f:
        if file_name in existing_items:
            existing_items[file_name].update_contents(f)
            print(f"Updated existing file '{file_name}' in Box folder {folder_id}")
        else:
            folder.upload_stream(f, file_name)
            print(f"Uploaded '{file_name}' to Box folder {folder_id}")


def delete_local_export(archive_path: Path) -> None:
    """Deletes the local export archive after a successful upload."""
    archive_path.unlink()
    print(f"Deleted local archive: {archive_path}")


def main() -> None:
    box_jwt_config_path, box_folder_id, cms_dir = load_config()

    date_str = datetime.now().strftime("%Y-%m-%d")
    filename_stem = f"strapi-backup-{date_str}"

    archive_path = run_strapi_export(cms_dir, filename_stem)
    print(f"Export produced: {archive_path}")

    auth = JWTAuth.from_settings_file(box_jwt_config_path)
    client = Client(auth)

    me = client.user().get()
    print(f"Authenticated as Box user: {me.login}")

    upload_to_box(client, box_folder_id, archive_path)
    delete_local_export(archive_path)

    print("Backup complete.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
