# Architecture (MVP)
- Transport: QUIC（将来マルチパス想定）、失敗時Anycastリレー、最終的にJetStreamで到達保証。
- Messaging: inbox/outbox（JetStream subject）、冪等キー・重複排除・再送。TTLと死隊列。
- API: gRPC/Connect + OpenAPI。認可はスコープベース。
- Frontend: 統合インボックス（出自ラベル：native, tg, dmaなど）。仮想化リスト、既読/検索。
- Storage: Postgres(メタ), MinIO(添付; クライアント側暗号化後)。
- Crypto: MLS方針（段階導入）。ブリッジは端末内変換を原則。