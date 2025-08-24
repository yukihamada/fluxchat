package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestHealthEndpoint(t *testing.T) {
	r := chi.NewRouter()
	
	// Add health endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(HealthResponse{
			Status:  "ok",
			Version: "0.1.0",
		})
	})

	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var response HealthResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatal("Failed to parse response JSON:", err)
	}

	if response.Status != "ok" {
		t.Errorf("Expected status 'ok', got '%s'", response.Status)
	}
}

func TestMessageEndpoint(t *testing.T) {
	r := chi.NewRouter()
	
	// Add message endpoint
	r.Post("/api/messages", func(w http.ResponseWriter, r *http.Request) {
		var req MessageRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		response := MessageResponse{
			ID:        "test-id",
			Content:   req.Content,
			Recipient: req.Recipient,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	payload := `{"content":"Hello World","recipient":"test@example.com"}`
	req, err := http.NewRequest("POST", "/api/messages", strings.NewReader(payload))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var response MessageResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatal("Failed to parse response JSON:", err)
	}

	if response.Content != "Hello World" {
		t.Errorf("Expected content 'Hello World', got '%s'", response.Content)
	}

	if response.Recipient != "test@example.com" {
		t.Errorf("Expected recipient 'test@example.com', got '%s'", response.Recipient)
	}
}