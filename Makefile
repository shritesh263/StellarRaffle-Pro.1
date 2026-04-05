# StellarRaffle Pro — Makefile
# Convenience targets for building, testing, and running the project.

.PHONY: help build test deploy-testnet frontend-dev frontend-build clean

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build the Soroban contract to WASM
	cd contract && cargo build --target wasm32-unknown-unknown --release

test: ## Run all Soroban contract tests
	cd contract && cargo test -- --nocapture

lint: ## Lint both Rust and JS code
	cd contract && cargo clippy -- -D warnings
	cd frontend && npm run lint

frontend-dev: ## Start the Vite dev server
	cd frontend && npm install && npm run dev

frontend-build: ## Build the production frontend bundle
	cd frontend && npm install && npm run build

clean: ## Remove build artifacts
	cd contract && cargo clean
	rm -rf frontend/dist
