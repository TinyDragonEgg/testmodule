#!/bin/bash

# Simple script to push updates to GitHub
# GitHub Actions will automatically create a release

echo "Pushing updates to GitHub..."
echo ""

# Add all changes
git add .

# Commit with version from module.json
VERSION=$(grep '"version"' module.json | sed 's/.*: "\(.*\)".*/\1/')
echo "Version detected: $VERSION"
echo ""

git commit -m "Release v$VERSION"

# Push to GitHub
git push origin main

echo ""
echo "✓ Pushed to GitHub!"
echo "✓ GitHub Actions will automatically create release v$VERSION"
echo ""
echo "Check progress at: https://github.com/TinyDragonEgg/testmodule/actions"
echo ""
