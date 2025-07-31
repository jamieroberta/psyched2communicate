#!/bin/bash
echo "=== NUCLEAR OPTION: Complete Git Reset ==="
echo "This will completely restart your git repository"

# Remove git history
rm -rf .git

# Reinitialize git
git init

# Add everything (respecting .gitignore)
git add .

# Make initial commit
git commit -m "Initial commit - clean repository"

# Add remote
git remote add origin git@github.com:jamieroberta/psyched2communicate.git

# Push to GitHub
git branch -M main
git push -u origin main --force

echo "=== Git repository reset complete! ==="
