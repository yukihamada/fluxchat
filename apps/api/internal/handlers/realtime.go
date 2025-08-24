package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"fluxchat/api/internal/messaging"
)

type RealtimeHandler struct {
	js *messaging.JetStreamService
}

func NewRealtimeHandler(js *messaging.JetStreamService) *RealtimeHandler {
	return &RealtimeHandler{js: js}
}

// SSE endpoint for real-time message streaming
func (h *RealtimeHandler) StreamMessages(w http.ResponseWriter, r *http.Request) {
	// Set SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Get user ID from query params (TODO: Get from auth)
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		userID = "default-user"
	}

	// Create a channel for messages
	msgChan := make(chan *messaging.Message, 10)
	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()

	// Subscribe to JetStream if available
	if h.js != nil {
		go func() {
			err := h.js.SubscribeToInbox(ctx, userID, func(msg *messaging.Message) {
				select {
				case msgChan <- msg:
				case <-ctx.Done():
					return
				}
			})
			if err != nil {
				log.Printf("Failed to subscribe to inbox: %v", err)
			}
		}()
	}

	// Flusher for SSE
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// Send initial connection message
	fmt.Fprintf(w, "event: connected\ndata: {\"status\":\"connected\",\"timestamp\":\"%s\"}\n\n", 
		time.Now().Format(time.RFC3339))
	flusher.Flush()

	// Send heartbeat every 30 seconds
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case msg := <-msgChan:
			// Send message as SSE
			data, err := json.Marshal(msg)
			if err != nil {
				log.Printf("Failed to marshal message: %v", err)
				continue
			}
			fmt.Fprintf(w, "event: message\ndata: %s\n\n", string(data))
			flusher.Flush()
		case <-ticker.C:
			// Send heartbeat
			fmt.Fprintf(w, "event: heartbeat\ndata: {\"timestamp\":\"%s\"}\n\n", 
				time.Now().Format(time.RFC3339))
			flusher.Flush()
		}
	}
}