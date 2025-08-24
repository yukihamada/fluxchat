---
description: リポ最小骨格の生成・依存導入・初期ビルド/テストまで自動化
allowed-tools: Bash(git:*), Bash(mkdir:*), Bash(cp:*), Bash(sh:*), Bash(npm:*), Bash(go:*), Bash(pnpm:*), Bash(docker:*), Bash(make:*), Bash(buf:*), Bash(bun:*), Bash(apt-get:*), Bash(brew:*), Bash(curl:*), Bash(wget:*)
argument-hint: [service?]
---
目標:
1) apps/api + apps/web の最小雛形を作成
2) infraのdev依存（nats/postgres/minio）をdocker composeで起動
3) 単体/簡易統合テストを1つ作り、CIで通る状態にする

手順:
- 既存ファイルを尊重し、同名は上書きしない/差分提案にする
- 生成後に `make test` or `go test ./...` / `pnpm test` を実行
- 変更は小さなコミットに分割、最後にPR用の説明を出力

完了条件:
- `docker compose ps` が正常
- `go test` と `pnpm test` 緑
- README更新・スクショ/ログ添付