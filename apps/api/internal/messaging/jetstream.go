package messaging

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/nats-io/nats.go"
)

type JetStreamService struct {
	nc *nats.Conn
	js nats.JetStreamContext
}

type Message struct {
	ID           string    `json:"id"`
	Content      string    `json:"content"`
	Sender       string    `json:"sender"`
	Recipient    string    `json:"recipient"`
	Source       string    `json:"source"` // native, tg, dma etc
	Timestamp    time.Time `json:"timestamp"`
	IdempotencyKey string  `json:"idempotency_key"`
}

func NewJetStreamService(nc *nats.Conn) (*JetStreamService, error) {
	if nc == nil {
		return nil, fmt.Errorf("nats connection is nil")
	}

	js, err := nc.JetStream()
	if err != nil {
		return nil, fmt.Errorf("failed to create jetstream context: %w", err)
	}

	service := &JetStreamService{
		nc: nc,
		js: js,
	}

	// Initialize streams
	if err := service.initStreams(); err != nil {
		return nil, fmt.Errorf("failed to initialize streams: %w", err)
	}

	return service, nil
}

func (s *JetStreamService) initStreams() error {
	// Inbox stream for incoming messages
	inboxCfg := &nats.StreamConfig{
		Name:        "MESSAGES_INBOX",
		Subjects:    []string{"messages.inbox.>"},
		Retention:   nats.WorkQueuePolicy,
		Storage:     nats.FileStorage,
		Replicas:    1,
		MaxAge:      24 * time.Hour,
		Duplicates:  5 * time.Minute, // Dedup window
	}

	// Outbox stream for outgoing messages
	outboxCfg := &nats.StreamConfig{
		Name:        "MESSAGES_OUTBOX",
		Subjects:    []string{"messages.outbox.>"},
		Retention:   nats.WorkQueuePolicy,
		Storage:     nats.FileStorage,
		Replicas:    1,
		MaxAge:      24 * time.Hour,
		Duplicates:  5 * time.Minute,
	}

	// Create or update streams
	for _, cfg := range []*nats.StreamConfig{inboxCfg, outboxCfg} {
		_, err := s.js.AddStream(cfg)
		if err != nil {
			// Try updating if exists
			_, err = s.js.UpdateStream(cfg)
			if err != nil {
				return fmt.Errorf("failed to create/update stream %s: %w", cfg.Name, err)
			}
		}
		log.Printf("Stream %s initialized", cfg.Name)
	}

	return nil
}

func (s *JetStreamService) PublishMessage(ctx context.Context, msg *Message) error {
	// Set timestamp if not set
	if msg.Timestamp.IsZero() {
		msg.Timestamp = time.Now()
	}

	// Set idempotency key if not set
	if msg.IdempotencyKey == "" {
		msg.IdempotencyKey = fmt.Sprintf("%s-%d", msg.ID, msg.Timestamp.UnixNano())
	}

	data, err := json.Marshal(msg)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	// Publish to outbox
	subject := fmt.Sprintf("messages.outbox.%s", msg.Recipient)
	_, err = s.js.Publish(subject, data,
		nats.MsgId(msg.IdempotencyKey), // For deduplication
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	log.Printf("Published message %s to %s", msg.ID, subject)
	return nil
}

func (s *JetStreamService) SubscribeToInbox(ctx context.Context, userID string, handler func(*Message)) error {
	subject := fmt.Sprintf("messages.inbox.%s", userID)
	
	sub, err := s.js.Subscribe(subject, func(m *nats.Msg) {
		var msg Message
		if err := json.Unmarshal(m.Data, &msg); err != nil {
			log.Printf("Failed to unmarshal message: %v", err)
			m.Nak()
			return
		}

		// Call handler
		handler(&msg)
		
		// Acknowledge message
		m.Ack()
	}, nats.Durable(fmt.Sprintf("inbox_%s", userID)))

	if err != nil {
		return fmt.Errorf("failed to subscribe to inbox: %w", err)
	}

	// Handle context cancellation
	go func() {
		<-ctx.Done()
		sub.Unsubscribe()
	}()

	return nil
}