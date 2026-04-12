#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — Deploy Cloud Function + Cloud Scheduler to Google Cloud
#
# Prerequisites:
#   1. gcloud CLI installed and authenticated  (gcloud auth login)
#   2. A GCP project created
#   3. A GitHub Personal Access Token with  actions:write  scope
#
# Usage:
#   export PROJECT_ID="your-gcp-project-id"
#   export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
#   bash cloud_trigger/deploy.sh
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Required vars ─────────────────────────────────────────────────────────────
: "${PROJECT_ID:?Set PROJECT_ID env var}"
: "${GITHUB_TOKEN:?Set GITHUB_TOKEN env var}"

FUNCTION_NAME="weekly-planner-trigger"
REGION="us-central1"
SCHEDULE="0 17 * * 0"          # Every Sunday 17:00 UTC = 20:00 Israel
TIMEZONE="UTC"
OWNER="bben15600-sys"
REPO="ben-automation-system"
WORKFLOW="weekly-planner-bot.yml"
REF="master"

# ─────────────────────────────────────────────────────────────────────────────
echo "▶ Setting project to $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

echo "▶ Enabling required APIs…"
gcloud services enable \
  cloudfunctions.googleapis.com \
  cloudscheduler.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --quiet

# ── Store token in Secret Manager ────────────────────────────────────────────
echo "▶ Storing GITHUB_TOKEN in Secret Manager…"
echo -n "$GITHUB_TOKEN" | gcloud secrets create github-token \
  --data-file=- \
  --replication-policy="automatic" \
  --quiet 2>/dev/null || \
echo -n "$GITHUB_TOKEN" | gcloud secrets versions add github-token \
  --data-file=- --quiet

# ── Deploy Cloud Function (2nd gen) ──────────────────────────────────────────
echo "▶ Deploying Cloud Function '$FUNCTION_NAME'…"

# Get project number for service account
SA_EMAIL="${FUNCTION_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Create dedicated service account
gcloud iam service-accounts create "$FUNCTION_NAME" \
  --display-name="Weekly Planner Trigger" \
  --quiet 2>/dev/null || true

# Grant secret access to the service account
gcloud secrets add-iam-policy-binding github-token \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet

gcloud functions deploy "$FUNCTION_NAME" \
  --gen2 \
  --runtime=python311 \
  --region="$REGION" \
  --source="./cloud_trigger" \
  --entry-point=trigger \
  --trigger-http \
  --no-allow-unauthenticated \
  --service-account="${SA_EMAIL}" \
  --set-secrets="GITHUB_TOKEN=github-token:latest" \
  --set-env-vars="GITHUB_OWNER=${OWNER},GITHUB_REPO=${REPO},WORKFLOW_FILE=${WORKFLOW},GITHUB_REF=${REF}" \
  --timeout=30s \
  --min-instances=0 \
  --max-instances=1 \
  --quiet

FUNCTION_URL=$(gcloud functions describe "$FUNCTION_NAME" \
  --gen2 --region="$REGION" --format="value(serviceConfig.uri)")

echo "✅ Function URL: $FUNCTION_URL"

# ── Create Cloud Scheduler job ────────────────────────────────────────────────
echo "▶ Creating Cloud Scheduler job…"

# Service account for Scheduler to invoke the function
SCHEDULER_SA="${FUNCTION_NAME}-invoker@${PROJECT_ID}.iam.gserviceaccount.com"
gcloud iam service-accounts create "${FUNCTION_NAME}-invoker" \
  --display-name="Weekly Planner Scheduler Invoker" \
  --quiet 2>/dev/null || true

# Allow scheduler SA to invoke the function
gcloud functions add-invoker-policy-binding "$FUNCTION_NAME" \
  --region="$REGION" \
  --member="serviceAccount:${SCHEDULER_SA}" \
  --quiet

gcloud scheduler jobs create http "$FUNCTION_NAME" \
  --location="$REGION" \
  --schedule="$SCHEDULE" \
  --time-zone="$TIMEZONE" \
  --uri="$FUNCTION_URL" \
  --http-method=POST \
  --oidc-service-account-email="$SCHEDULER_SA" \
  --oidc-token-audience="$FUNCTION_URL" \
  --max-retry-attempts=3 \
  --min-backoff=60s \
  --max-backoff=300s \
  --attempt-deadline=60s \
  --quiet 2>/dev/null || \
gcloud scheduler jobs update http "$FUNCTION_NAME" \
  --location="$REGION" \
  --schedule="$SCHEDULE" \
  --time-zone="$TIMEZONE" \
  --uri="$FUNCTION_URL" \
  --http-method=POST \
  --oidc-service-account-email="$SCHEDULER_SA" \
  --oidc-token-audience="$FUNCTION_URL" \
  --max-retry-attempts=3 \
  --min-backoff=60s \
  --max-backoff=300s \
  --attempt-deadline=60s \
  --quiet

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅  DONE"
echo "   Function : $FUNCTION_URL"
echo "   Schedule : Every Sunday 20:00 Israel (17:00 UTC)"
echo "   Retries  : up to 3x (60s, 120s, 240s backoff)"
echo ""
echo "   To test NOW:"
echo "   gcloud scheduler jobs run $FUNCTION_NAME --location=$REGION"
echo "═══════════════════════════════════════════════════════"
