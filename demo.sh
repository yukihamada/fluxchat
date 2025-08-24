#!/bin/bash
set -e

echo "🚀 FluxChat Demo - Starting services..."
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "⚠️  Docker is not running. Starting without infrastructure services."
    echo "   NATS JetStream features will be limited."
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    pkill -f "go run" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
}

trap cleanup EXIT

# Kill any existing processes
pkill -f "go run" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start API server
echo "📡 Starting API server on http://localhost:8080..."
(cd apps/api && go run .) &
API_PID=$!

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8080/health >/dev/null 2>&1; then
        echo "✅ API is ready!"
        break
    fi
    sleep 1
done

# Start web app
echo ""
echo "🌐 Starting web app on http://localhost:3000..."
(cd apps/web && npm run dev) &
WEB_PID=$!

# Wait for web to be ready
echo "⏳ Waiting for web app to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Web app is ready!"
        break
    fi
    sleep 1
done

echo ""
echo "🎉 FluxChat is running!"
echo ""
echo "📱 Web Interface: http://localhost:3000"
echo "🔧 API Health:    http://localhost:8080/health"
echo "📨 Inbox:         http://localhost:3000/inbox"
echo ""
echo "💡 Tips:"
echo "   - Open multiple browser tabs to test real-time messaging"
echo "   - Messages are delivered via Server-Sent Events (SSE)"
echo "   - Check the browser console for connection status"
echo ""
echo "Press Ctrl+C to stop all services..."

# Keep script running
wait