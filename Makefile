.PHONY: help dev test build clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	@echo "Starting development environment..."
	docker compose up -d
	@echo "Infrastructure started. Now start API and Web manually:"
	@echo "  Terminal 1: cd apps/api && go run ."
	@echo "  Terminal 2: cd apps/web && npm run dev"

api: ## Start API server
	cd apps/api && go run .

web: ## Start web development server
	cd apps/web && npm run dev

test: ## Run all tests
	@echo "Running Go tests..."
	cd apps/api && go test ./...
	@echo "Running Web tests..."
	cd apps/web && npm test

test-e2e: ## Run E2E tests
	@echo "Running E2E tests..."
	cd apps/web && npm run test:e2e

test-e2e-ui: ## Run E2E tests with UI
	cd apps/web && npm run test:e2e:ui

build: ## Build all components
	@echo "Building API..."
	cd apps/api && go build -o fluxchat-api .
	@echo "Building Web..."
	cd apps/web && npm run build

clean: ## Clean build artifacts
	cd apps/api && rm -f fluxchat-api
	cd apps/web && rm -rf .next node_modules/.cache

deps: ## Install all dependencies
	@echo "Installing Go dependencies..."
	cd apps/api && go mod tidy
	@echo "Installing Node dependencies..."
	cd apps/web && npm install

infra-up: ## Start infrastructure services
	docker compose up -d

infra-down: ## Stop infrastructure services
	docker compose down

infra-logs: ## Show infrastructure logs
	docker compose logs -f