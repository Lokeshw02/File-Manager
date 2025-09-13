#!/bin/bash

# File Manager Run Script
# This script runs the built Spring Boot application

echo "🚀 Starting File Manager..."
echo "=========================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Check if JAR exists
JAR_FILE=$(find target -name "*.jar" -type f | grep -v "original" | head -n 1)

if [ -z "$JAR_FILE" ]; then
    echo "❌ No JAR file found. Please run setup.sh first."
    exit 1
fi

print_status "Found JAR: $JAR_FILE"
print_status "Starting application on http://localhost:8080"
echo ""

# Run the application
java -jar "$JAR_FILE"
