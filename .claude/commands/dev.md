---
description: ローカル開発スタック起動とウォッチャ
allowed-tools: Bash(docker compose:*), Bash(pnpm:*), Bash(go:*), Bash(make:*), Bash(npm:*)
---
起動:
- !`docker compose up -d`
- !`(cd apps/api && go run ./...)`
- !`(cd apps/web && pnpm dev)`