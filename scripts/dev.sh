#!/bin/bash
set -euo pipefail

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
    echo "✅ Added .neon_local/ to .gitignore"
fi

echo "📦 Building and starting development containers..."
echo "   - Neon Local proxy will create an ephemeral database branch"
echo "   - Application will run with hot reload enabled"
echo ""

# Start the database before running migrations
echo "🗄️ Starting Neon Local..."
docker compose -f docker-compose.dev.yml up -d neon-local

echo "⏳ Waiting for the database to be ready..."
database_ready=false
for attempt in {1..30}; do
    if docker compose -f docker-compose.dev.yml exec -T neon-local pg_isready -h localhost -p 5432 -U neon >/dev/null 2>&1; then
        database_ready=true
        break
    fi
    sleep 2
done

if [ "$database_ready" != true ]; then
    echo "❌ Error: Neon Local did not become ready in time."
    docker compose -f docker-compose.dev.yml logs neon-local
    exit 1
fi

# Load the development environment file for Drizzle
echo "📜 Applying latest schema with Drizzle..."
DOTENV_CONFIG_PATH=.env.development npm run db:migrate

# Start development environment
docker compose -f docker-compose.dev.yml up --build

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:3000"
echo "   Database: postgres://neon:npg@localhost:5432/neondb"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"