#!/usr/bin/env python3
"""Create Rotation Schedule DB under the correct parent (same as Weekly Schedule DB)."""
import os, re
from notion_client import Client

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

NOTION_TOKEN = _clean(os.environ.get("NOTION_TOKEN", ""))
notion = Client(auth=NOTION_TOKEN)

# Parent page of Weekly Schedule DB (confirmed from debug)
PARENT_PAGE_ID = "33abb07d-d7b9-8172-a1e1-fd85fbc4f868"

def sel(opts):
    return {"select": {"options": [{"name": o} for o in opts]}}
def msel(opts):
    return {"multi_select": {"options": [{"name": o} for o in opts]}}

print(f"Creating Rotation Schedule DB under page {PARENT_PAGE_ID}...")
try:
    new_db = notion.databases.create(
        parent={"page_id": PARENT_PAGE_ID},
        title=[{"type": "text", "text": {"content": "Rotation Schedule DB"}}],
        properties={
            "Name":             {"title": {}},
            "Date":             {"date": {}},
            "Week Type":        sel(["Home", "Base"]),
            "Basketball Days":  msel(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]),
            "VR Events Count":  {"number": {}},
            "Schedule Created": {"checkbox": {}},
            "Plan JSON":        {"rich_text": {}},
            "Notes":            {"rich_text": {}},
        }
    )
    new_id = new_db["id"]
    print(f"✅ Created! New ROTATION_DB_ID: {new_id}")
    print(f"\n→ עדכן את ה-secret ROTATION_DB_ID ל: {new_id}")
except Exception as e:
    print(f"Failed: {e}")
