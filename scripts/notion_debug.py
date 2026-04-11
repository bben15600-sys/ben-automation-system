#!/usr/bin/env python3
"""Find parent of Weekly Schedule DB, then create Rotation Schedule DB there."""
import os, re, json
from notion_client import Client

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

NOTION_TOKEN   = _clean(os.environ.get("NOTION_TOKEN", ""))
WEEKLY_DB_ID_KNOWN = "33fbb07d-d7b9-8146-af34-cf7af4b5e4f2"  # from earlier debug

notion = Client(auth=NOTION_TOKEN)

# Find parent of Weekly Schedule DB
print("Finding parent of Weekly Schedule DB...")
try:
    db = notion.databases.retrieve(database_id=WEEKLY_DB_ID_KNOWN)
    parent = db.get("parent", {})
    parent_page_id = parent.get("page_id")
    print(f"  Weekly Schedule DB parent page: {parent_page_id}")

    # Check if Rotation Schedule DB already exists under this page
    print("\nSearching for existing Rotation Schedule DB under this page...")
    results = notion.search(filter={"property": "object", "value": "database"})
    rotation_db_id = None
    for item in results.get("results", []):
        item_parent = item.get("parent", {})
        title = item.get("title", [{}])[0].get("plain_text", "") if item.get("title") else ""
        if item_parent.get("page_id") == parent_page_id and "rotation" in title.lower():
            print(f"  Found existing: {item['id']} '{title}'")
            rotation_db_id = item["id"]

    if not rotation_db_id:
        print("\nCreating new Rotation Schedule DB under Weekly Schedule page...")
        def sel(opts):
            return {"select": {"options": [{"name": o} for o in opts]}}
        def msel(opts):
            return {"multi_select": {"options": [{"name": o} for o in opts]}}

        new_db = notion.databases.create(
            parent={"page_id": parent_page_id},
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
        rotation_db_id = new_db["id"]
        print(f"  ✅ Created new Rotation Schedule DB: {rotation_db_id}")
        print(f"\n⚠️  UPDATE GitHub Secret ROTATION_DB_ID to: {rotation_db_id}")
    else:
        print(f"\n✅ Use this as ROTATION_DB_ID: {rotation_db_id}")

except Exception as e:
    print(f"Failed: {e}")
