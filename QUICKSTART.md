# FluxChat Quick Start Guide

## 🚀 Current Features

### ✅ Completed
- **Real-time messaging API** with Go + Chi router
- **NATS JetStream integration** for message queuing (optional)
- **Server-Sent Events (SSE)** for real-time updates
- **Unified inbox UI** with Next.js + React Query
- **Message deduplication** with idempotency keys
- **Multi-source labeling** (native, tg, dma, external)
- **Auto-reconnection** and connection status indicator

### 📋 In Progress
- PostgreSQL persistence layer
- E2E encryption (MLS approach)
- External platform integrations
- Advanced search and filtering

## 🛠️ Quick Setup

### Prerequisites
- Node.js 18+
- Go 1.22+
- Docker (optional, for NATS/PostgreSQL/MinIO)

### 1. Install Dependencies
```bash
# API dependencies
cd apps/api && go mod tidy

# Web dependencies  
cd apps/web && npm install
```

### 2. Start Services

#### Option A: Demo Script (Recommended)
```bash
./demo.sh
```

#### Option B: Manual Start
```bash
# Terminal 1: Start infrastructure (optional)
docker compose up -d

# Terminal 2: Start API
cd apps/api && go run .

# Terminal 3: Start Web
cd apps/web && npm run dev
```

### 3. Access the Application
- **Web Interface**: http://localhost:3000
- **Inbox**: http://localhost:3000/inbox
- **API Health**: http://localhost:8080/health

## 🧪 Testing the System

### Send a Test Message
```bash
curl -X POST http://localhost:8080/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello from FluxChat!",
    "recipient": "default-user",
    "source": "native"
  }'
```

### Monitor Real-time Stream
```bash
curl http://localhost:8080/api/stream?user_id=default-user
```

### Multiple Browser Test
1. Open http://localhost:3000/inbox in multiple browser tabs
2. Send messages from one tab
3. Watch them appear in real-time in all tabs

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│   Go API    │────▶│    NATS     │
│   Web App   │ SSE │   Server    │     │  JetStream  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │   (Soon)    │
                    └─────────────┘
```

## 🔧 Development Commands

```bash
# Run tests
make test

# Build all
make build

# Clean build artifacts
make clean

# Show all commands
make help
```

## 📝 Claude Code Commands

```bash
# Bootstrap more features
/bootstrap

# Start dev environment
/dev

# Run tests with auto-fix
/test
```

## 🐛 Troubleshooting

### NATS Connection Failed
- Normal if Docker isn't running
- App works without it (limited features)

### Port Already in Use
```bash
# Kill existing processes
pkill -f "go run"
pkill -f "next dev"
```

### Clear Browser Cache
- Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Win/Linux)
- Check DevTools Network tab for SSE connection

## 🚦 Next Steps

1. **Enable NATS JetStream**
   ```bash
   docker compose up -d
   # Restart API to connect
   ```

2. **Test Message Flow**
   - Send messages between different users
   - Observe deduplication with same idempotency key
   - Check source labels (native, tg, etc.)

3. **Explore the Code**
   - API handlers: `apps/api/internal/handlers/`
   - React hooks: `apps/web/hooks/`
   - Real-time logic: `apps/api/internal/messaging/`

Happy messaging! 🎉