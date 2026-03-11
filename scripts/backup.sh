#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# backup.sh — Create a versioned git tag snapshot before every push
#
# Usage:
#   ./scripts/backup.sh                  # auto-name: backup-v<date>-<shortsha>
#   ./scripts/backup.sh "before-redesign" # custom label
#
# Backups are stored as lightweight git tags and pushed to GitHub.
# List backups:   git tag -l "backup-*"
# Restore:        ./scripts/restore.sh <tag-name>
# ─────────────────────────────────────────────────────────────────────────────
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

LABEL="${1:-}"
DATE=$(date +%Y-%m-%d-%H%M)
SHA=$(git rev-parse --short HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ -n "$LABEL" ]; then
  TAG="backup-${DATE}-${LABEL}"
else
  TAG="backup-${DATE}-${SHA}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦  Creating backup snapshot..."
echo "    Tag    : $TAG"
echo "    Branch : $BRANCH"
echo "    Commit : $SHA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create annotated tag with metadata message
git tag -a "$TAG" -m "Backup snapshot
Date:   $DATE
Branch: $BRANCH
Commit: $SHA
Label:  ${LABEL:-auto}"

# Push the tag to GitHub
git push origin "$TAG"

echo ""
echo "✅  Backup created: $TAG"
echo "    View on GitHub: https://github.com/bondw19-jpg/PX-1687-Manager-App/releases/tag/$TAG"
echo ""
echo "    To restore this backup later, run:"
echo "    ./scripts/restore.sh $TAG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
