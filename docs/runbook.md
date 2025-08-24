# Runbook
- dev up: `docker compose up -d` (nats/postgres/minio)
- api: `make dev` or `go run ./apps/api`
- web: `pnpm dev` (apps/web)
- テスト: `make test` または `go test ./...` / `pnpm test`