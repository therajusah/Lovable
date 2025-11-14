echo "Starting AIsiteBuilder..."

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

check_dependencies() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo "Installing dependencies in $dir..."
        cd "$dir" && npm install
        cd ..
    fi
}

echo "Checking dependencies..."
check_dependencies "backend"
check_dependencies "frontend"

if [ ! -f "backend/.env" ]; then
    echo " Backend .env file not found!"
    echo "Please create backend/.env with your API keys:"
    echo "E2B_API_KEY=your_e2b_api_key_here"
    echo "GOOGLE_API_KEY=your_google_api_key_here"
    echo "PORT=3003"
    echo ""
    echo "Get your E2B API key from: https://e2b.dev"
    echo "Get your Google API key from: https://aistudio.google.com/app/apikey"
    exit 1
fi

echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers are starting up!"
echo ""
echo "Backend: http://localhost:3003"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

wait
