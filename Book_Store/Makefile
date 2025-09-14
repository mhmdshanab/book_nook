# Makefile - Book Store
.PHONY: help install build run stop clean logs test deploy-prod

# Default target
help:
	@echo "🚀 Book Store - Makefile"
	@echo ""
	@echo "Available commands:"
	@echo "  install      - Install dependencies"
	@echo "  build        - Build Docker images"
	@echo "  run          - Run development environment"
	@echo "  stop         - Stop all services"
	@echo "  clean        - Clean Docker resources"
	@echo "  logs         - Show logs"
	@echo "  test         - Run tests"
	@echo "  deploy-prod  - Deploy to production"
	@echo "  health       - Check application health"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Build Docker images
build:
	@echo "🔨 Building Docker images..."
	docker-compose build

# Run development environment
run:
	@echo "▶️ Starting development environment..."
	docker-compose up -d

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	docker-compose down

# Clean Docker resources
clean:
	@echo "🧹 Cleaning Docker resources..."
	docker system prune -f
	docker volume prune -f

# Show logs
logs:
	@echo "📋 Showing logs..."
	docker-compose logs -f

# Run tests
test:
	@echo "🧪 Running tests..."
	npm test

# Deploy to production
deploy-prod:
	@echo "🚀 Deploying to production..."
	@if [ -f "deploy-production.sh" ]; then \
		chmod +x deploy-production.sh; \
		./deploy-production.sh; \
	else \
		echo "❌ deploy-production.sh not found"; \
		exit 1; \
	fi

# Check application health
health:
	@echo "🏥 Checking application health..."
	@if [ -f "health.js" ]; then \
		node health.js; \
	else \
		echo "❌ health.js not found"; \
		exit 1; \
	fi

# Production build
build-prod:
	@echo "🔨 Building production images..."
	docker-compose -f docker-compose.prod.yml build

# Production run
run-prod:
	@echo "▶️ Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d

# Production stop
stop-prod:
	@echo "🛑 Stopping production services..."
	docker-compose -f docker-compose.prod.yml down

# Production logs
logs-prod:
	@echo "📋 Showing production logs..."
	docker-compose -f docker-compose.prod.yml logs -f

# Backup database
backup:
	@echo "💾 Creating database backup..."
	@if [ -d "backup" ]; then \
		docker-compose exec mongo mongodump --out /backup/$(shell date +%Y%m%d_%H%M%S); \
	else \
		mkdir backup; \
		docker-compose exec mongo mongodump --out /backup/$(shell date +%Y%m%d_%H%M%S); \
	fi

# Restore database
restore:
	@echo "📥 Restoring database..."
	@if [ -z "$(BACKUP_DATE)" ]; then \
		echo "❌ Please specify BACKUP_DATE (e.g., make restore BACKUP_DATE=20231201_143000)"; \
		exit 1; \
	fi
	docker-compose exec mongo mongorestore /backup/$(BACKUP_DATE)

# Update application
update:
	@echo "🔄 Updating application..."
	git pull origin main
	make build-prod
	make run-prod

# Show status
status:
	@echo "📊 Service status:"
	docker-compose ps
	@echo ""
	@echo "📊 Production status:"
	docker-compose -f docker-compose.prod.yml ps
