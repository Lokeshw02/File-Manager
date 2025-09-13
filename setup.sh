#!/bin/bash

# File Manager Setup Script
# This script sets up the entire project for new users

set -e  # Exit on any error

echo "🚀 Setting up File Manager Project..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
}

# Check if Java is installed
check_java() {
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install Java 11 or higher."
        echo "Visit: https://adoptium.net/"
        exit 1
    fi
    
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    print_success "Java found: $JAVA_VERSION"
}

# Install frontend dependencies
install_frontend_deps() {
    print_status "Installing frontend dependencies..."
    
    cd web-src
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in web-src directory"
        exit 1
    fi
    
    # Install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Running npm install..."
        npm install
    else
        print_warning "node_modules already exists, skipping npm install"
    fi
    
    print_success "Frontend dependencies installed"
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building React frontend..."
    
    cd web-src
    
    # Build the React app
    npm run build
    
    print_success "Frontend build completed"
    cd ..
}

# Copy frontend build to Spring Boot static folder
copy_frontend_build() {
    print_status "Copying frontend build to Spring Boot static folder..."
    
    # Create static directory if it doesn't exist
    mkdir -p src/main/resources/static
    
    # Remove existing static files
    rm -rf src/main/resources/static/*
    
    # Copy new build files
    cp -r web-src/build/* src/main/resources/static/
    
    print_success "Frontend build copied to static folder"
}

# Build Spring Boot JAR
build_spring_boot() {
    print_status "Building Spring Boot application..."
    
    # Make Maven wrapper executable
    chmod +x mvnw
    
    # Build the JAR
    ./mvnw clean package -DskipTests
    
    print_success "Spring Boot JAR built successfully"
}

# Main execution
main() {
    echo ""
    print_status "Starting setup process..."
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node
    check_java
    echo ""
    
    # Install dependencies
    print_status "Setting up frontend..."
    install_frontend_deps
    echo ""
    
    # Build and copy frontend
    print_status "Building and integrating frontend..."
    build_frontend
    copy_frontend_build
    echo ""
    
    # Build Spring Boot
    print_status "Building Spring Boot application..."
    build_spring_boot
    echo ""
    
    # Success message
    echo "=================================="
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "To run the application:"
    echo "  java -jar target/demo-*.jar"
    echo ""
    echo "Then open your browser and go to:"
    echo "  http://localhost:8080"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
