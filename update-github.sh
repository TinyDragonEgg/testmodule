#!/bin/bash

echo "Updating GitHub repository..."
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "Initializing git repository..."
    git init
    git remote add origin https://github.com/TinyDragonEgg/testmodule.git
    git branch -M main
fi

echo "Adding all changed files..."
git add .

echo ""
echo "Committing changes..."
git commit -m "Update to v1.0.1 - Built-in cultural origins"

echo ""
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "Done! Now create a release at:"
echo "https://github.com/TinyDragonEgg/testmodule/releases/new"
echo ""
echo "Release details:"
echo "  Tag: 1.0.1"
echo "  Title: v1.0.1 - Built-in Cultural Origins"
echo "  Upload: module.zip"
echo ""
read -p "Press Enter to continue..."
