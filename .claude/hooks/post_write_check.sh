#!/usr/bin/env bash
set -euo pipefail
cd "$CLAUDE_PROJECT_DIR"
if command -v go >/dev/null 2>&1; then
  go vet ./... || true
fi
if [ -f "apps/web/package.json" ]; then
  (cd apps/web && if command -v pnpm >/dev/null 2>&1; then pnpm -s lint || true; fi)
fi
exit 0