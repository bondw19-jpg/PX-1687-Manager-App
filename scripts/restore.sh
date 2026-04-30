#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# restore.sh — Restore code to a previous backup snapshot
#
# Usage:
#   ./scripts/restore.sh                          # interactive list picker
#   ./scripts/restore.sh backup-2026-03-11-abc123 # restore specific tag
#
# What it does:
#   1. Creates a safety backup of your CURRENT state first
#   2. Creates a new restore branch from the backup tag
#   3. Lets you review before merging
# ─────────────────────────────────────────────────────────────────────────────
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄  Panda Manager Hub — Restore Tool"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# List available backups
echo ""
echo "📋  Available backups (newest first):"
echo ""
git tag -l "backup-*" --sort=-version:refname | head -20 | nl -w2 -s ') '
echo ""

TARGET_TAG="${1:-}"

if [ -z "$TARGET_TAG" ]; then
  echo "Usage: ./scripts/restore.sh <tag-name>"
  echo "Example: ./scripts/restore.sh backup-2026-03-11-1200-abc123"
  exit 1
fi

# Verify tag exists
if ! git tag -l | grep -q "^${TARGET_TAG}$"; then
  echo "❌  Tag '$TARGET_TAG' not found."
  echo "    Run: git tag -l 'backup-*' to see all backups."
  exit 1
fi

CURRENT_SHA=$(git rev-parse --short HEAD)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
RESTORE_BRANCH="restore-${TARGET_TAG}"
DATE=$(date +%Y-%m-%d-%H%M)

echo "⚠️   You are about to restore to: $TARGET_TAG"
echo "    Current state ($CURRENT_BRANCH @ $CURRENT_SHA) will be saved first."
echo ""
read -p "    Continue? [y/N] " -n 1 -r REPLY
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "↩️   Restore cancelled."
  exit 0
fi

# Step 1: Save current state as a safety backup
SAFETY_TAG="backup-${DATE}-before-restore-${TARGET_TAG}"
echo ""
echo "💾  Saving safety backup of current state → $SAFETY_TAG"
git tag -a "$SAFETY_TAG" -m "Safety backup before restoring to $TARGET_TAG"
git push origin "$SAFETY_TAG"

# Step 2: Create restore branch from tag
echo "🌿  Creating restore branch: $RESTORE_BRANCH"
git checkout -b "$RESTORE_BRANCH" "$TARGET_TAG"

# Step 3: Push restore branch
echo "⬆️   Pushing restore branch to GitHub..."
git push -u origin "$RESTORE_BRANCH"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅  Restore branch ready: $RESTORE_BRANCH"
echo ""
echo "    Next steps:"
echo "    1. Review the restored code on this branch"
echo "    2. To make it live: merge $RESTORE_BRANCH → main"
echo "    3. Or go back:      git checkout $CURRENT_BRANCH"
echo ""
echo "    Safety backup of your previous state: $SAFETY_TAG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
