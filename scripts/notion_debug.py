#!/usr/bin/env python3
"""Quick Notion connection debug — find parent pages of both DBs."""
import os, re
from notion_client import Client

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

NOTION_TOKEN   = _clean(os.environ.get("NOTION_TOKEN", ""))
ROTATION_DB_ID = _clean(os.environ.get("ROTATION_DB_ID", ""))
WEEKLY_DB_ID   = _clean(os.environ.get("WEEKLY_DB_ID", ""))

notion = Client(auth=NOTION_TOKEN)

def get_parent(db_id, label):
    print(f"\n{label} ({db_id}):")
    try:
        db = notion.databases.retrieve(database_id=db_id)
        parent = db.get("parent", {})
        print(f"  Parent type: {parent.get('type')}")
        print(f"  Parent ID:   {parent.get('page_id') or parent.get('database_id') or parent.get('workspace')}")
        print(f"  DB URL: {db.get('url')}")
    except Exception as e:
        print(f"  Failed: {e}")

get_parent(ROTATION_DB_ID, "Rotation Schedule DB")
get_parent(WEEKLY_DB_ID,   "Weekly Schedule DB")
