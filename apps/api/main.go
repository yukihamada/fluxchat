package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"fluxchat/api/internal/handlers"
	"fluxchat/api/internal/messaging"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/nats-io/nats.go"
)

type HealthResponse struct {
	Status    string `json:"status"`
	Version   string `json:"version"`
	JetStream bool   `json:"jetstream"`
}

func main() {
	// Connect to NATS (optional for now)
	var jsService *messaging.JetStreamService
	nc, err := nats.Connect(nats.DefaultURL)
	if err != nil {
		log.Printf("Warning: Failed to connect to NATS: %v", err)
		log.Println("Continuing without NATS connection...")
		nc = nil
	} else {
		defer nc.Close()
		// Initialize JetStream
		jsService, err = messaging.NewJetStreamService(nc)
		if err != nil {
			log.Printf("Warning: Failed to initialize JetStream: %v", err)
		}
	}

	// Setup router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// CORS for local development
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	// Health endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(HealthResponse{
			Status:    "ok",
			Version:   "0.1.0",
			JetStream: jsService != nil,
		})
	})

	// Message handlers
	messageHandler := handlers.NewMessageHandler(jsService)
	r.Mount("/api/messages", messageHandler.Routes())

	// Realtime handler
	realtimeHandler := handlers.NewRealtimeHandler(jsService)
	r.Get("/api/stream", realtimeHandler.StreamMessages)

	// Start server
	server := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	// Graceful shutdown
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server failed:", err)
		}
	}()

	log.Println("Server started on :8080")

	// Wait for interrupt signal
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server shutdown failed:", err)
	}

	log.Println("Server stopped")
}