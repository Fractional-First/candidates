#!/bin/bash
# Stop hook: Run full verification before Claude finishes
# Called when Claude is about to stop responding

set -e

echo "=== Running verification checks ==="

errors=0
warnings=0

# Run type check if tsconfig exists
if [ -f "tsconfig.json" ]; then
  echo ""
  echo "--- Type Checking ---"
  if ! npx tsc --noEmit 2>&1 | tail -20; then
    echo "WARNING: Type errors found"
    warnings=$((warnings + 1))
  else
    echo "Types OK"
  fi
fi

# Run tests if vitest config exists
if [ -f "vitest.config.ts" ] || [ -f "vitest.config.js" ]; then
  echo ""
  echo "--- Running Tests ---"
  if ! npm run test:run 2>&1 | tail -30; then
    echo "ERROR: Tests failed"
    errors=$((errors + 1))
  else
    echo "Tests OK"
  fi
fi

# Run lint
if grep -q '"lint"' package.json 2>/dev/null; then
  echo ""
  echo "--- Running Lint ---"
  if ! npm run lint 2>&1 | tail -15; then
    echo "WARNING: Lint issues found"
    warnings=$((warnings + 1))
  else
    echo "Lint OK"
  fi
fi

# Check for uncommitted changes
echo ""
echo "--- Git Status ---"
if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  echo "Uncommitted changes:"
  git status --short
else
  echo "Working tree clean"
fi

echo ""
echo "=== Verification complete ==="

if [ $errors -gt 0 ]; then
  echo "FAILED: $errors error(s), $warnings warning(s)"
  exit 2  # Block Claude from stopping
else
  if [ $warnings -gt 0 ]; then
    echo "PASSED with $warnings warning(s)"
  else
    echo "All checks passed"
  fi
  exit 0
fi
