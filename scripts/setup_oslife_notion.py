#!/usr/bin/env python3
"""
Setup helper for the oslife Dashboard Notion workspace.

Discovers databases under the "oslife Dashboard" page, creates the Rotation
database if it does not exist, and prints the IDs to paste into env vars
(GitHub Actions secrets + Vercel project env vars).

Uses stdlib only (urllib) — no pip install required.

Usage (locally):
    NOTION_TOKEN=ntn_xxx python scripts/setup_oslife_notion.py

Usage (GitHub Actions):
    workflow_dispatch on .github/workflows/setup-oslife-notion.yml
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any

NOTION_API = "https://api.notion.com/v1"
NOTION_VERSION = "2022-06-28"

PARENT_PAGE_TITLE = "oslife Dashboard"
ROTATION_DB_NAME = "Rotation"

# Expected schema per DB name (Hebrew titles as they appear in oslife Dashboard)
EXPECTED_SCHEMAS: dict[str, dict[str, str]] = {
    "לוז יומי": {
        "Name": "title",
        "Date": "date",
        "Category": "select",
        "Done": "checkbox",
    },
    "תקציב": {
        "Name": "title",
        "Amount": "number",
        "Category": "select",
        "Date": "date",
    },
    "השקעות": {
        "Name": "title",
        "Value": "number",
        "Change": "number",
        "Type": "select",
    },
    "יעדים שבועיים": {
        "Name": "title",
        "Done": "number",
        "Target": "number",
    },
}


def _headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
    }


def _req(method: str, path: str, token: str, body: dict | None = None) -> dict:
    url = f"{NOTION_API}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        url, data=data, headers=_headers(token), method=method
    )
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"\n❌ Notion API error: {e.code} {e.reason}")
        print(f"   Path: {method} {path}")
        print(f"   Body: {err_body}")
        sys.exit(1)


def _title_text(title_array: list[dict[str, Any]]) -> str:
    return "".join(t.get("plain_text", "") for t in title_array)


def find_parent_page(token: str) -> str | None:
    """Search for the oslife Dashboard page the integration has access to."""
    results = _req(
        "POST",
        "/search",
        token,
        {
            "query": PARENT_PAGE_TITLE,
            "filter": {"property": "object", "value": "page"},
        },
    )
    candidates = []
    for page in results.get("results", []):
        # Page title is in properties.title.title (for regular pages)
        props = page.get("properties", {})
        title_prop = props.get("title") or props.get("Name")
        if not title_prop or "title" not in title_prop:
            continue
        title = _title_text(title_prop["title"])
        if title.strip().lower() == PARENT_PAGE_TITLE.lower():
            candidates.append(page["id"])
    if not candidates:
        return None
    # If multiple matches, prefer the one with sub-databases
    if len(candidates) == 1:
        return candidates[0]
    print(f"⚠️  Found {len(candidates)} pages titled '{PARENT_PAGE_TITLE}'.")
    for pid in candidates:
        print(f"   candidate: {pid}")
    # Use the first; the user can override via PARENT_PAGE_ID
    return candidates[0]


def list_child_databases(token: str, parent_id: str) -> list[dict]:
    """Return all databases whose parent is the given page."""
    results = _req(
        "POST",
        "/search",
        token,
        {"filter": {"property": "object", "value": "database"}, "page_size": 100},
    )
    children = []
    norm_parent = parent_id.replace("-", "")
    for db in results.get("results", []):
        parent = db.get("parent", {})
        if parent.get("type") != "page_id":
            continue
        if parent.get("page_id", "").replace("-", "") != norm_parent:
            continue
        title = _title_text(db.get("title", [])) or "(untitled)"
        fields = {name: p.get("type") for name, p in db.get("properties", {}).items()}
        children.append({"id": db["id"], "title": title, "fields": fields})
    return children


def create_rotation_db(token: str, parent_id: str) -> dict:
    """Create the Rotation DB (schema matches weekly_scheduler.py expectations)."""
    body = {
        "parent": {"type": "page_id", "page_id": parent_id},
        "title": [
            {"type": "text", "text": {"content": "Rotation"}},
        ],
        "properties": {
            "Name": {"title": {}},
            "Week Type": {
                "select": {
                    "options": [
                        {"name": "Base", "color": "gray"},
                        {"name": "Home", "color": "blue"},
                    ]
                }
            },
            "Date": {"date": {}},
            "Basketball Days": {
                "multi_select": {
                    "options": [
                        {"name": d}
                        for d in ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
                    ]
                }
            },
            "VR Events Count": {"number": {"format": "number"}},
            "Schedule Created": {"checkbox": {}},
            "Plan JSON": {"rich_text": {}},
        },
    }
    return _req("POST", "/databases", token, body)


def validate_schema(name: str, actual: dict[str, str]) -> list[str]:
    """Return list of warnings if expected fields are missing or wrong type."""
    expected = EXPECTED_SCHEMAS.get(name)
    if not expected:
        return []
    warnings = []
    for field, expected_type in expected.items():
        if field not in actual:
            warnings.append(f"חסר שדה '{field}' (צפוי: {expected_type})")
        elif actual[field] != expected_type:
            warnings.append(
                f"שדה '{field}' הוא {actual[field]} — צפוי {expected_type}"
            )
    return warnings


def main() -> None:
    token = os.environ.get("NOTION_TOKEN") or os.environ.get("NOTION_API_TOKEN")
    if not token:
        print("❌ ERROR: set NOTION_TOKEN (or NOTION_API_TOKEN) env var.")
        print("   Use the token from your 'oslife' integration at notion.com/my-integrations")
        sys.exit(1)

    print(f"🔎 מחפש דף '{PARENT_PAGE_TITLE}' ב-Notion...")
    parent_id = os.environ.get("PARENT_PAGE_ID") or find_parent_page(token)
    if not parent_id:
        print(f"❌ לא נמצא דף בשם '{PARENT_PAGE_TITLE}'.")
        print("   ודא שהאינטגרציה 'oslife' משותפת עם הדף.")
        sys.exit(1)
    print(f"✓ נמצא דף: {parent_id}")

    print("\n📋 דאטאבייסים קיימים תחת הדף:")
    dbs = list_child_databases(token, parent_id)
    if not dbs:
        print("   (אין) — ודא שהאינטגרציה משותפת עם הדאטאבייסים עצמם.")

    rotation = None
    for db in dbs:
        print(f"\n   • {db['title']}")
        print(f"     ID: {db['id']}")
        print(f"     Fields: {db['fields']}")
        warnings = validate_schema(db["title"], db["fields"])
        for w in warnings:
            print(f"     ⚠️  {w}")
        if db["title"].lower().startswith("rotation"):
            rotation = db

    if rotation:
        print(f"\n✓ Rotation DB כבר קיים: {rotation['id']}")
    else:
        print("\n🆕 יוצר Rotation DB חדש...")
        new_db = create_rotation_db(token, parent_id)
        rotation = {
            "id": new_db["id"],
            "title": "Rotation",
            "fields": {
                k: v.get("type") for k, v in new_db.get("properties", {}).items()
            },
        }
        print(f"✓ נוצר: {rotation['id']}")

    # Summary — ready to paste
    print("\n" + "=" * 60)
    print("📝 סיכום — העתק לסביבות")
    print("=" * 60)
    print("\n### GitHub Actions Secrets (Settings → Secrets → Actions)")
    print(f"ROTATION_DB_ID = {rotation['id']}")
    for db in dbs:
        if db["title"] == "לוז יומי":
            print(f"WEEKLY_DB_ID   = {db['id']}")

    print("\n### Vercel Environment Variables (aurora-dashboard → Settings → Env)")
    name_to_env = {
        "לוז יומי": "VITE_NOTION_SCHEDULE_DB_ID",
        "תקציב": "VITE_NOTION_BUDGET_DB_ID",
        "השקעות": "VITE_NOTION_INVESTMENTS_DB_ID",
        "יעדים שבועיים": "VITE_NOTION_GOALS_DB_ID",
    }
    for db in dbs:
        env_name = name_to_env.get(db["title"])
        if env_name:
            print(f"{env_name} = {db['id']}")

    print("\n✅ מוכן. העתק את הערכים למעלה למקומות המתאימים.")


if __name__ == "__main__":
    main()
