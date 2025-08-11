#!/bin/bash

# Activate virtual environment
source env/bin/activate

# Check if MongoDB is running (macOS)
if ! pgrep -x "mongod" > /dev/null
then
    echo "MongoDB is not running. Please start MongoDB first."
    echo "On macOS: brew services start mongodb-community"
    echo "On Linux: sudo systemctl start mongod"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file if needed"
fi

# Start the server
echo "Starting Literature Manager API..."
python main.py