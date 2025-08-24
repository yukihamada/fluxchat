# FluxChat v0.1.0 Release Notes

🚀 **初回リリース - 超高速・統合メッセージングプラットフォーム**

## ✨ 主要機能

### 🔄 リアルタイムメッセージング
- **NATS JetStream** による高信頼メッセージキューイング
- **Server-Sent Events (SSE)** でのリアルタイム配信
- メッセージの冪等性保証と重複排除
- 自動再接続とコネクション状態管理

### 📱 統合インボックス
- 複数ソース（native, tg, dma等）からのメッセージ統合表示
- React Query による効率的なデータ管理
- レスポンシブデザインとアクセシビリティ対応
- キーボードショートカット対応

### 🛠️ 開発環境
- **Go 1.22** + chi router による高性能API
- **Next.js 14** (App Router) + Tailwind CSS
- 包括的なテストスイート（単体テスト + E2Eテスト）
- Claude Code完全統合（エージェント、コマンド、フック）

### 🔒 セキュリティ & 品質
- E2E暗号化対応（MLS方式、段階導入予定）
- 多層セキュリティスキャン（Trivy, Semgrep, CodeQL）
- 自動依存関係更新（Dependabot）
- コード品質ゲート（Lint, 静的解析）

### 🏗️ CI/CD & デプロイ
- GitHub Actions完全自動化パイプライン
- マルチプラットフォームビルド（Linux/macOS/Windows）
- Docker化（マルチステージビルド、セキュリティ最適化）
- 段階的デプロイ（Staging → Production）

## 🚀 クイックスタート

```bash
# リポジトリクローン
git clone https://github.com/yukihamada/fluxchat.git
cd fluxchat

# デモ実行
./demo.sh

# または個別起動
make dev  # インフラ + API + Web
```

## 🧪 テスト

```bash
# 単体テスト
make test

# E2Eテスト
make test-e2e

# E2EテストUI
make test-e2e-ui
```

## 📊 技術仕様

| 項目 | 技術スタック |
|------|-------------|
| **Backend** | Go 1.22, chi router, NATS JetStream |
| **Frontend** | Next.js 14, React 18, React Query, Tailwind |
| **Database** | PostgreSQL (予定), NATS JetStream |
| **Storage** | MinIO (クライアント側暗号化) |
| **Testing** | Jest, Playwright (3ブラウザ対応) |
| **CI/CD** | GitHub Actions, Docker, Multi-arch |

## 🎯 次期バージョン予定

### v0.2.0 (予定)
- [ ] PostgreSQL完全統合
- [ ] MLS暗号化実装
- [ ] Telegram Bot API統合
- [ ] 高度な検索機能
- [ ] パフォーマンス最適化

### 将来計画
- EU Digital Markets Act (DMA) 対応
- マルチパスQUIC実装
- Key Transparency導入
- モバイルアプリ対応

## 🤝 コントリビュート

1. Issue作成またはDiscussion参加
2. フォーク & ブランチ作成
3. 変更実装（小さなPR推奨）
4. テスト実行 & CI通過確認
5. プルリクエスト作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## 🙏 謝辞

このプロジェクトは [Claude Code](https://claude.ai/code) との協働により開発されました。

---

**完全なドキュメント**: [README.md](README.md) | [QUICKSTART.md](QUICKSTART.md)  
**GitHub**: https://github.com/yukihamada/fluxchat