#!/bin/bash
# Post-edit hook: Run ESLint on changed files (fast feedback)
# Exit 0 = success (non-blocking), Exit 2 = blocking error

set -e

# Read tool input from stdin
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Skip if no file path or not a JS/TS file
if [ -z "$file_path" ] || ! echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx)$'; then
  exit 0
fi

# Run ESLint on the specific file (suppress errors for missing files)
if [ -f "$file_path" ]; then
  # Check if npm run lint exists
  if grep -q '"lint"' package.json 2>/dev/null; then
    npm run lint -- "$file_path" 2>&1 | head -30 || true
  fi
fi

# Don't block on lint errors - just show them
exit 0
