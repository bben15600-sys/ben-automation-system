#!/usr/bin/env python3
"""Quick Notion connection debug — no Telegram, no questionnaire."""
import os, re
from notion_client import Client

def _clean(v: str) -> str:
    return re.sub(r'\s', '', v)

NOTION_TOKEN   = _clean(os.environ.get("NOTION_TOKEN", ""))
ROTATION_DB_ID = _clean(os.environ.get("ROTATION_DB_ID", ""))

# The page the user sees in Notion sidebar
USER_PAGE_ID = "33abb07d-d7b9-817d-a322-ff22c8fefaf6"

notion = Client(auth=NOTION_TOKEN)

# Who am I?
try:
    me = notion.users.me()
    print(f"Integration user: {me.get('name')} (type={me.get('type')})")
except Exception as e:
    print(f"users.me failed: {e}")

# Check current ROTATION_DB_ID
print(f"\nChecking ROTATION_DB_ID:")
try:
    db = notion.databases.retrieve(database_id=ROTATION_DB_ID)
    title_parts = db.get("title", [])
    name = title_parts[0]["plain_text"] if title_parts else "(no title)"
    print(f"  Found DB: {name}  URL: {db.get('url')}")
    q = notion.databases.query(database_id=ROTATION_DB_ID)
    rows = q.get("results", [])
    print(f"  Entries: {len(rows)}")
    for row in rows:
        title = ""
        for prop in row.get("properties", {}).values():
            if prop.get("type") == "title":
                parts = prop.get("title", [])
                title = parts[0]["plain_text"] if parts else ""
                break
        print(f"    - {title}")
except Exception as e:
    print(f"  Failed: {e}")

# Look inside the user's Rotation Schedule DB page
print(f"\nLooking inside user's page ({USER_PAGE_ID}):")
try:
    children = notion.blocks.children.list(block_id=USER_PAGE_ID)
    blocks = children.get("results", [])
    print(f"  Found {len(blocks)} blocks inside the page")
    for block in blocks:
        btype = block.get("type", "")
        bid = block.get("id", "")
        if btype == "child_database":
            db_title = block.get("child_database", {}).get("title", "")
            print(f"  ✅ Inline DB found: {bid}  title='{db_title}'")
        else:
            print(f"  Block: {btype} ({bid})")
except Exception as e:
    print(f"  Failed to list page children: {e}")
    print(f"  → Integration does NOT have access to this page yet")
