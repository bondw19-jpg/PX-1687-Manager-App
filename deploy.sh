#!/bin/bash
# deploy.sh — Deploy Panda Manager Hub to Firebase Hosting
# Usage: bash deploy.sh <FIREBASE_CI_TOKEN>
#
# To get your token:
#   1. On your computer run: firebase login:ci
#   2. Copy the token printed (starts with "1//")
#   3. Run: bash deploy.sh YOUR_TOKEN_HERE

set -e

TOKEN="${1:-$FIREBASE_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "❌  No Firebase CI token provided."
  echo ""
  echo "Get one by running this on your computer:"
  echo "  firebase login:ci"
  echo ""
  echo "Then run:"
  echo "  bash deploy.sh YOUR_TOKEN"
  exit 1
fi

echo "🔨  Building production bundle..."
cd /home/user/webapp
npm run build

echo ""
echo "🚀  Deploying to Firebase Hosting (px1687-manager-hub)..."
firebase deploy --only hosting --token "$TOKEN" --project px1687-manager-hub --non-interactive

echo ""
echo "✅  Deployed! Your app is live at:"
echo "    https://px1687-manager-hub.web.app"
echo "    https://px1687-manager-hub.firebaseapp.com"
