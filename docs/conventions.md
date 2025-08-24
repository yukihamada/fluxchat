# Conventions
- Go: エラーハンドリングはwrap+sentinel。contextは最上流から。接続は締める。
- TS: ZodでI/O型を境界に。Reactは小さいコンポーネント。アクセシビリティ優先。
- コミット/PR: 1機能1PR、小さく。PRにテスト証跡・スクショ/動画。