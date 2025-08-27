.DEFAULT_GOAL := help

PNPM ?= pnpm
PORT ?= 3000
HOST ?= 0.0.0.0
IMAGE ?= acmecorp/retail-hub-frontend:dev

.PHONY: help install env dev build start lint test test-watch typecheck clean docker-build health

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "; printf "Usage: make \033[36m<target>\033[0m\\n\\n"} /^[a-zA-Z0-9_.-]+:.*?## / { printf "  \033[36m%-18s\033[0m %s\\n", $$1, $$2 }' $(MAKEFILE_LIST)

install: ## Install dependencies
	$(PNPM) install

env: ## Create .env.local from .env.example if missing
	@[ -f .env.local ] && echo ".env.local exists" || (cp .env.example .env.local && echo "Created .env.local from .env.example")

dev: ## Start Next.js dev server (PORT, HOST)
	$(PNPM) dev --port $(PORT) --hostname $(HOST)

build: ## Build the app for production
	$(PNPM) build

start: ## Start Next.js production server (after build)
	next start --port $(PORT) --hostname $(HOST)

lint: ## Run ESLint
	$(PNPM) lint || true

test: ## Run tests
	$(PNPM) test

test-watch: ## Run tests in watch mode
	$(PNPM) test:watch

typecheck: ## Run TypeScript type-checking
	$(PNPM) exec tsc --noEmit

clean: ## Clean build artifacts
	rm -rf .next coverage

docker-build: ## Build Docker image (IMAGE)
	docker build -t $(IMAGE) .

health: ## Check BFF health endpoint
	curl -fsS http://localhost:$(PORT)/api/healthz || true
