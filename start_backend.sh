#!/bin/bash

# Google Maps Scraper - Backend Startup Script
# This script ensures the backend starts properly with all dependencies

set -e  # Exit on any error

echo "🚀 Starting Google Maps Scraper Backend..."
echo "============================================"

# Color codes for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo -e "${RED}❌ Error: requirements.txt not found!${NC}"
    echo "Please run this script from the /home/prasanga/google-maps-scraper directory"
    exit 1
fi

echo -e "${BLUE}📁 Current directory: $(pwd)${NC}"

# Step 2: Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating one...${NC}"
    uv venv
    echo -e "${GREEN}✅ Virtual environment created!${NC}"
else
    echo -e "${GREEN}✅ Virtual environment found at .venv/${NC}"
fi

# Step 3: Activate virtual environment
echo -e "${BLUE}🔌 Activating virtual environment...${NC}"
source .venv/bin/activate

# Step 4: Check Python version
PYTHON_VERSION=$(python --version 2>&1)
echo -e "${GREEN}✅ Python: ${PYTHON_VERSION}${NC}"

# Step 5: Install/update dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pip install -q -r requirements.txt
echo -e "${GREEN}✅ Dependencies installed!${NC}"

# Step 6: Check if .env exists, create if not
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating default...${NC}"
    cat > .env << 'EOF'
# Backend Configuration
HOST=127.0.0.1
PORT=8000
DEBUG=True

# CORS Settings
ALLOWED_ORIGINS=["*"]

# App Info
APP_NAME=Google Maps Business Scraper API
APP_VERSION=1.0.0
EOF
    echo -e "${GREEN}✅ .env file created with default settings${NC}"
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Step 7: Show configuration
echo ""
echo -e "${BLUE}⚙️  Configuration:${NC}"
echo "   - Host: 127.0.0.1"
echo "   - Port: 8000"
echo "   - Debug: True"
echo ""

# Step 8: Start the backend server
echo -e "${GREEN}✨ Starting FastAPI server...${NC}"
echo -e "${YELLOW}📍 Backend will be available at: http://127.0.0.1:8000${NC}"
echo -e "${YELLOW}📍 API Documentation: http://127.0.0.1:8000/docs${NC}"
echo -e "${YELLOW}📍 Health Check: http://127.0.0.1:8000/health${NC}"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo "============================================"
echo ""

# Run the server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
