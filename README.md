# FluxChat

[![GitHub](https://img.shields.io/badge/GitHub-yukihamada%2Ffluxchat-181717?style=flat-square&logo=github)](https://github.com/yukihamada/fluxchat)
[![CI](https://github.com/yukihamada/fluxchat/workflows/CI/badge.svg)](https://github.com/yukihamada/fluxchat/actions)
[![Go Report Card](https://goreportcard.com/badge/github.com/yukihamada/fluxchat)](https://goreportcard.com/report/github.com/yukihamada/fluxchat)

超高速・統合メッセージング（FluxChat）

## Quick Start

### Prerequisites
- Node.js 18+
- Go 1.22+
- Docker & Docker Compose

### Setup

```bash
# Clone and setup
git clone <repo-url>
cd fluxchat

# Start infrastructure
docker compose up -d

# Start API
cd apps/api
go mod tidy
go run .

# Start Web (in another terminal)
cd apps/web
npm install
npm run dev
```

### Development with Claude Code

```bash
# Start Claude Code
claude

# Bootstrap project
/bootstrap

# Start development stack
/dev

# Run tests
/test
```

## Architecture

- **Backend**: Go + NATS JetStream + PostgreSQL + MinIO
- **Frontend**: Next.js + React Query + Tailwind
- **Transport**: QUIC (planned) + HTTP/gRPC
- **Security**: E2EE (MLS approach), client-side encryption

## Features

- [ ] Unified inbox for multiple messaging platforms
- [ ] Real-time messaging with QUIC transport
- [ ] E2E encryption (MLS)
- [ ] Integration with official APIs only
- [ ] Message deduplication and retry logic

## Project Structure

```
fluxchat/
├── apps/
│   ├── api/          # Go backend
│   └── web/          # Next.js frontend
├── packages/
│   ├── proto/        # gRPC definitions
│   └── crypto/       # Crypto utilities
├── infra/            # Infrastructure
├── .claude/          # Claude Code configuration
└── docs/             # Documentation
```

## Development

See `@docs/runbook.md` for detailed development instructions.

## License

MIT