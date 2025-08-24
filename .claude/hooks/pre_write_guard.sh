#!/usr/bin/env bash
set -euo pipefail
# 禁止パターン簡易検査（破壊的操作の予防）
if grep -R --include='*.sh' -nE 'rm -rf\s+/(?:\s|$)' "$CLAUDE_PROJECT_DIR" >/dev/null 2>&1; then
  echo "危険なrm -rf / の痕跡を検出。修正してから続行。" >&2
  exit 2  # ブロック
fi
exit 0