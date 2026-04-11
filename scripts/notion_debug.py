#!/usr/bin/env python3
"""Quick Notion connection debug — no Telegram, no questionnaire."""
import os, re
from notion_client import Client

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

NOTION_TOKEN   = _clean(os.environ.get("NOTION_TOKEN", ""))
ROTATION_DB_ID = _clean(os.environ.get("ROTATION_DB_ID", ""))

notion = Client(auth=NOTION_TOKEN)

# Who am I?
try:
    me = notion.users.me()
    print(f"Integration user: {me.get('name')} (type={me.get('type')})")
except Exception as e:
    print(f"users.me failed: {e}")

# All databases I can access
print("\nAll accessible databases:")
try:
    results = notion.search(filter={"property": "object", "value": "database"})
    for db in results.get("results", []):
        title_parts = db.get("title", [])
        name = title_parts[0]["plain_text"] if title_parts else "(no title)"
        print(f"  {db['id']}  {name}")
except Exception as e:
    print(f"  search failed: {e}")

# Try to retrieve ROTATION_DB_ID directly
print(f"\nChecking ROTATION_DB_ID directly ({ROTATION_DB_ID}):")
try:
    db = notion.databases.retrieve(database_id=ROTATION_DB_ID)
    title_parts = db.get("title", [])
    name = title_parts[0]["plain_text"] if title_parts else "(no title)"
    print(f"  Found DB: {name}")
    print(f"  URL: {db.get('url', 'n/a')}")
    print(f"  Properties: {list(db.get('properties', {}).keys())}")
except Exception as e:
    print(f"  Failed: {e}")

# Query for entries
print("\nEntries in ROTATION_DB_ID:")
try:
    q = notion.databases.query(database_id=ROTATION_DB_ID)
    rows = q.get("results", [])
    print(f"  Found {len(rows)} entries")
    for row in rows:
        title = ""
        for prop in row.get("properties", {}).values():
            if prop.get("type") == "title":
                parts = prop.get("title", [])
                title = parts[0]["plain_text"] if parts else ""
                break
        print(f"  - {row['id']}  archived={row.get('archived')}  title={title}")
except Exception as e:
    print(f"  query failed: {e}")
