# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Real-time messaging with NATS JetStream
- Server-Sent Events (SSE) for real-time updates
- Go API with chi router and message handlers
- Next.js unified inbox with React Query
- E2E tests with Playwright (Chromium, Firefox, WebKit)
- Complete CI/CD pipeline with GitHub Actions
- Docker containerization with multi-stage builds
- Claude Code integration (agents, commands, hooks)
- Comprehensive security scanning (Trivy, Semgrep, CodeQL)
- Automatic dependency updates with Dependabot
- Message deduplication with idempotency keys
- Multi-source message labeling
- Auto-reconnection and connection status indicator

### Technical Details
- **Backend**: Go 1.22 + chi router + NATS JetStream
- **Frontend**: Next.js 14 (App Router) + React Query + Tailwind
- **Testing**: Jest (unit) + Playwright (E2E)
- **CI/CD**: GitHub Actions with multi-platform builds
- **Security**: E2EE ready (MLS approach), client-side encryption
- **Infrastructure**: Docker, NATS, PostgreSQL, MinIO

## [0.1.0] - 2025-08-24

### Added
- Initial release of FluxChat
- Core messaging functionality
- Development environment setup
- Documentation and guides