---
description: テスト実行＋失敗時の自動修復（小さく差分）
allowed-tools: Bash(go:*), Bash(pnpm:*), Bash(npm:*), Bash(make:*), Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*)
---
## Context
- 現在のgit status: !`git status`
- 直近のdiff: !`git diff --name-only HEAD`
## Task
- `go test ./...` と `pnpm test` を実行し、失敗を最小修正で解消
- 修正ごとにテストを回し、緑を確認後にコミット