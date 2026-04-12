"""
cloud_trigger/main.py — Google Cloud Function
Triggered by Cloud Scheduler every Sunday at 17:00 UTC (20:00 Israel).

Logic before firing:
  1. Check if the workflow already ran successfully this week (idempotent).
  2. If yes  → skip, log, return 200.
  3. If no   → trigger workflow_dispatch via GitHub API.
  4. Retry policy is handled by Cloud Scheduler (max_retry_attempts=3).

Required env vars (set in Cloud Function config / Secret Manager):
    GITHUB_TOKEN   — Personal Access Token with  actions:write  scope
    GITHUB_OWNER   — e.g. bben15600-sys
    GITHUB_REPO    — e.g. ben-automation-system
    WORKFLOW_FILE  — e.g. weekly-planner-bot.yml
    GITHUB_REF     — branch to run on, e.g. master
"""

import os
import json
import logging
from datetime import date, timedelta

import functions_framework
import requests

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("weekly-trigger")

# ── Config ────────────────────────────────────────────────────────────────────

GITHUB_TOKEN  = os.environ["GITHUB_TOKEN"]
GITHUB_OWNER  = os.environ.get("GITHUB_OWNER",  "bben15600-sys")
GITHUB_REPO   = os.environ.get("GITHUB_REPO",   "ben-automation-system")
WORKFLOW_FILE = os.environ.get("WORKFLOW_FILE",  "weekly-planner-bot.yml")
GITHUB_REF    = os.environ.get("GITHUB_REF",     "master")

BASE = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}"
HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept":        "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def get_week_start() -> date:
    """Monday of the current/upcoming week (Sun night → next Mon)."""
    today = date.today()
    wd = today.weekday()   # Mon=0 … Sun=6
    return today + timedelta(days=1) if wd == 6 else today - timedelta(days=wd)


def workflow_already_ran_this_week() -> bool:
    """
    Returns True if the workflow already completed successfully
    (conclusion=success) in a run created on or after this week's Monday.
    """
    week_start = get_week_start()
    url = f"{BASE}/actions/workflows/{WORKFLOW_FILE}/runs"
    params = {
        "branch":   GITHUB_REF,
        "status":   "success",
        "per_page": 5,
        "created":  f">={week_start.isoformat()}",
    }
    try:
        r = requests.get(url, headers=HEADERS, params=params, timeout=15)
        r.raise_for_status()
        runs = r.json().get("workflow_runs", [])
        if runs:
            log.info("Workflow already ran this week (run id=%s). Skipping.", runs[0]["id"])
            return True
    except requests.RequestException as e:
        log.warning("Could not check existing runs: %s — will attempt trigger anyway.", e)
    return False


def trigger_workflow() -> tuple[bool, str]:
    """POST to workflow_dispatch. Returns (success, message)."""
    url = f"{BASE}/actions/workflows/{WORKFLOW_FILE}/dispatches"
    payload = {"ref": GITHUB_REF}
    try:
        r = requests.post(url, headers=HEADERS, json=payload, timeout=15)
        if r.status_code == 204:
            return True, "✅ Workflow dispatched successfully."
        return False, f"❌ GitHub API returned {r.status_code}: {r.text[:300]}"
    except requests.RequestException as e:
        return False, f"❌ Network error: {e}"


# ── Entry point ───────────────────────────────────────────────────────────────

@functions_framework.http
def trigger(request):          # noqa: ANN001
    """HTTP entry point — called by Cloud Scheduler."""
    log.info("Weekly planner trigger invoked. Week start: %s", get_week_start())

    # ── Guard: already ran? ───────────────────────────────────────────────────
    if workflow_already_ran_this_week():
        body = {"status": "skipped", "reason": "workflow already ran this week"}
        return (json.dumps(body), 200, {"Content-Type": "application/json"})

    # ── Trigger ───────────────────────────────────────────────────────────────
    ok, msg = trigger_workflow()
    log.info(msg)

    status_code = 200 if ok else 500
    body = {"status": "triggered" if ok else "error", "message": msg}
    return (json.dumps(body), status_code, {"Content-Type": "application/json"})
