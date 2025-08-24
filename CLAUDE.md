# FluxChat — Project Memory for Claude Code

See @docs/architecture.md, @docs/security.md, @docs/runbook.md, @docs/conventions.md

## Mission
- 超低遅延・高信頼な統合メッセージング体験を提供する。
- 公式/合法APIのみを利用（DMA/EU相互接続やTelegram公式など）。非公認自動化は禁止。
- 自前ネットワークはE2EE（MLS方針）・QUIC・NATS JetStreamの3本柱。小さく作って早く計測。

## Non‑Negotiables（必須）
- E2EE前提：サーバ側は平文を保持しない。橋渡しが必要な場合は**端末内で復号→再暗号化**。
- 小さなPR・小さな差分。実装→テスト→リファクタを**可視化コミット**で積む。
- 失敗時の挙動（リトライ/冪等/重複排除）を常に考慮。
- 公式API以外を叩かない。疑わしい場合は `docs/security.md` の判断基準に従う。

## Stack（MVP）
- Backend: Go 1.22 + chi/fiber, QUIC, NATS JetStream, Postgres, MinIO
- Frontend: Next.js(App Router) + React Query + Tailwind
- IDL: Buf + gRPC/Connect, OpenAPI（外部向け）
- CI: GitHub Actions（lint/test/build）、Docker（dev/prod両用）

## Claude Codeに期待すること（重要）
- **作業前に計画を箇条書き** → 小さな単位で実装 → **テスト** → **/review または code‑reviewer subagentで査読** → ドキュメント更新 → **コミット**。
- 破壊的コマンドは実行前に**合意を求める**。`rm`, `docker system prune` 等は原則禁止。
- 生成コストを抑えるため、**関連ファイルは @ で参照**。例: 「@apps/api/main.go を読み、@docs/architecture.md に沿って修正して」。
- 並列で独立タスクがあるときは**同時実行**を選好（ツール並列呼出）。  

## Naming & Conventions
- Go: `pkg/service`, `internal/`を適切に使う。ハンドラは疎結合。エラーパス/Contextキャンセル徹底。
- TS/React: Server Components優先、`use server`/`use client` 明示。型エクスポートはindexに集約。
- コミット: `feat(api): message send path` のようにスコープ明示。PRは動作GIF/スクショ添付。

## Definition of Done
- ユニット/統合テストが緑。性能SLO: 同一リージョンP50<80ms/P95<150msの配送（MVPは目標値）。
- セキュリティレビュー通過（subagent: security-reviewer）。ログ/メトリクス/ダッシュボードの項目追加。
- `docs/` 更新済み。Roll‑back手順記載。リリースノート作成済み。

## First tasks (小さく速く)
1) apps/api の最小メッセージ送受（ステータス/ヘルス/単純送信）  
2) NATS JetStreamのinbox/outboxストリーム確立 + 冪等ID  
3) apps/web の統一受信箱UIスケルトン（ダミーデータ）  
4) e2e テスト（送信→受信→既読→再接続）