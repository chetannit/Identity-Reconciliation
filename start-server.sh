#!/bin/bash

# Stop any existing server on port 3000
echo "Checking for existing server on port 3000..."
PID=$(lsof -ti:3000)
if [ ! -z "$PID" ]; then
    echo "Found process $PID using port 3000"
    kill -9 $PID 2>/dev/null
    echo "Process stopped."
fi

echo ""
echo "Starting server..."
npm start
