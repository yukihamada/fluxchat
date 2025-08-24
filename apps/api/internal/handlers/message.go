package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"fluxchat/api/internal/messaging"

	"github.com/go-chi/chi/v5"
	"github.com/nats-io/nuid"
)

type MessageHandler struct {
	js *messaging.JetStreamService
}

func NewMessageHandler(js *messaging.JetStreamService) *MessageHandler {
	return &MessageHandler{js: js}
}

type SendMessageRequest struct {
	Content     string `json:"content"`
	Recipient   string `json:"recipient"`
	Source      string `json:"source,omitempty"`
}

type SendMessageResponse struct {
	ID           string    `json:"id"`
	Content      string    `json:"content"`
	Recipient    string    `json:"recipient"`
	Timestamp    time.Time `json:"timestamp"`
	Status       string    `json:"status"`
}

func (h *MessageHandler) Routes() chi.Router {
	r := chi.NewRouter()
	
	r.Post("/send", h.SendMessage)
	r.Get("/inbox", h.GetInbox)
	
	return r
}

func (h *MessageHandler) SendMessage(w http.ResponseWriter, r *http.Request) {
	var req SendMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Content == "" || req.Recipient == "" {
		http.Error(w, "content and recipient are required", http.StatusBadRequest)
		return
	}

	// Create message
	msg := &messaging.Message{
		ID:        nuid.Next(),
		Content:   req.Content,
		Sender:    "current-user", // TODO: Get from auth context
		Recipient: req.Recipient,
		Source:    "native",
		Timestamp: time.Now(),
	}

	if req.Source != "" {
		msg.Source = req.Source
	}

	// Publish to JetStream if available
	if h.js != nil {
		if err := h.js.PublishMessage(r.Context(), msg); err != nil {
			// Log error but don't fail the request
			// In production, we might want to queue locally
			fmt.Printf("Warning: Failed to publish to JetStream: %v\n", err)
		}
	}

	// Response
	resp := SendMessageResponse{
		ID:        msg.ID,
		Content:   msg.Content,
		Recipient: msg.Recipient,
		Timestamp: msg.Timestamp,
		Status:    "sent",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *MessageHandler) GetInbox(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement inbox retrieval
	// For now, return empty array
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]messaging.Message{})
}