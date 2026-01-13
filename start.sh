#!/bin/bash
# Startup script for CRUD Admin System on localhost

echo "🚀 Starting CRUD Admin System..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start Backend
echo -e "${BLUE}📦 Starting Backend (Port 3000)...${NC}"
cd backend
npm install > /dev/null 2>&1
echo "✓ Backend dependencies installed"

# Check if node_modules exists and install if needed
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
fi

# Start backend in the background
npm run start:dev &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "  API available at: http://localhost:3000"
echo "  Swagger docs at: http://localhost:3000/api/docs"

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 5

# Start Frontend
echo ""
echo -e "${BLUE}⚛️  Starting Frontend (Port 3001)...${NC}"
cd ../frontend
npm install > /dev/null 2>&1
echo "✓ Frontend dependencies installed"

# Check if node_modules exists and install if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start frontend in the background
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "  App available at: http://localhost:3001"

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to start..."
sleep 5

# Print summary
echo ""
echo "================================"
echo -e "${GREEN}✅ All services started!${NC}"
echo "================================"
echo ""
echo "📍 ENDPOINTS:"
echo "  Frontend:  http://localhost:3001"
echo "  Backend:   http://localhost:3000"
echo "  API Docs:  http://localhost:3000/api/docs"
echo ""
echo "👤 Default Test Account:"
echo "  Email:    admin@example.com"
echo "  Password: password123"
echo ""
echo "⚙️  To stop services, press Ctrl+C"
echo ""

# Wait for processes
wait
