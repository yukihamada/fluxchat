# CI/CD Pipeline Guide

## 🚀 Overview

FluxChatのCI/CDパイプラインは、GitHub Actionsを使用して自動化されています。

## 📋 Workflows

### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
すべてのプッシュとPRで実行

#### Jobs:
- **Lint & Format**: コード品質チェック
  - Go: gofmt, goimports, staticcheck
  - JavaScript/TypeScript: ESLint
  
- **Unit Tests**: 単体テスト
  - API: Go test with coverage
  - Web: Jest with coverage
  
- **E2E Tests**: エンドツーエンドテスト
  - Browsers: Chromium, Firefox, WebKit
  - Playwright使用
  
- **Build**: ビルド検証
  - APIバイナリ
  - Next.jsビルド
  
- **Security**: セキュリティスキャン
  - Trivy: 脆弱性スキャン
  - Semgrep: 静的解析

### 2. **Release Pipeline** (`.github/workflows/release.yml`)
タグプッシュ時に実行（`v*`）

#### Features:
- マルチプラットフォームバイナリビルド
  - Linux (amd64, arm64)
  - macOS (amd64, arm64)
  - Windows (amd64)
- Dockerイメージビルド＆プッシュ
  - GitHub Container Registry
  - Multi-arch support

### 3. **Deploy Pipeline** (`.github/workflows/deploy.yml`)
手動トリガーによるデプロイ

#### Environments:
- **Staging**: 検証環境
- **Production**: 本番環境（セマンティックバージョン必須）

### 4. **Security Scanning**
- **CodeQL** (`.github/workflows/codeql.yml`): 週次セキュリティ解析
- **Dependabot** (`.github/dependabot.yml`): 依存関係の自動更新

## 🛠️ ローカルでの実行

### Lintチェック
```bash
# Go
cd apps/api
gofmt -l .
go vet ./...
staticcheck ./...

# Web
cd apps/web
npm run lint
```

### テスト実行
```bash
# 単体テスト
make test

# E2Eテスト
make test-e2e
```

### ビルド
```bash
# API
cd apps/api
go build -o fluxchat-api .

# Web
cd apps/web
npm run build
```

### Dockerビルド
```bash
# API
docker build -f apps/api/Dockerfile -t fluxchat-api .

# Web
docker build -f apps/web/Dockerfile -t fluxchat-web .
```

## 🔑 必要なSecrets

GitHub Secretsに設定が必要：

### CI/CD基本
- `GITHUB_TOKEN`: 自動提供

### デプロイ用
- `AWS_ACCESS_KEY_ID`: AWS認証
- `AWS_SECRET_ACCESS_KEY`: AWS認証
- `SLACK_WEBHOOK`: 通知用

### 環境変数
- `vars.AWS_REGION`: AWSリージョン
- `vars.API_URL`: APIエンドポイント

## 📊 品質ゲート

### PRマージ条件
1. ✅ すべてのCIジョブが成功
2. ✅ コードレビュー承認
3. ✅ ブランチ保護ルール準拠

### コードカバレッジ
- API: 80%以上推奨
- Web: 70%以上推奨

## 🚨 トラブルシューティング

### CI失敗時
1. ワークフローログを確認
2. ローカルで同じコマンドを実行
3. 環境差異を確認

### E2Eテスト失敗
1. Playwright UIモードでデバッグ
   ```bash
   npm run test:e2e:ui
   ```
2. スクリーンショット確認
3. 録画確認（Trace viewer）

### デプロイ失敗
1. AWS権限確認
2. ヘルスチェック確認
3. ロールバック手順実行

## 📈 メトリクス

GitHub Actionsダッシュボードで確認可能：
- ビルド成功率
- 平均実行時間
- 使用時間（分）

## 🔄 継続的改善

1. **パフォーマンス**
   - キャッシュ活用
   - 並列実行最適化
   
2. **信頼性**
   - リトライ設定
   - タイムアウト調整
   
3. **セキュリティ**
   - 定期的な依存関係更新
   - セキュリティアラート対応