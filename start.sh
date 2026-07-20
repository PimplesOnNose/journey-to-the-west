#!/bin/bash
# Start local development server for Journey to the West app

echo "🎭 Starting Journey to the West development server..."
echo "📁 Directory: $(pwd)"
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "🌐 Starting Python HTTP server on port 8000..."
    echo "📱 Open http://localhost:8000 in your browser"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🌐 Starting Python HTTP server on port 8000..."
    echo "📱 Open http://localhost:8000 in your browser"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v node &> /dev/null; then
    echo "🌐 Starting Node.js server on port 8000..."
    echo "📱 Open http://localhost:8000 in your browser"
    echo "🛑 Press Ctrl+C to stop the server"
    echo ""
    npx serve -l 8000
else
    echo "❌ No suitable server found."
    echo "💡 Install Python or Node.js to run a local server."
    echo ""
    echo "Alternative: Open index.html directly in your browser."
    echo "Note: Audio may not work due to CORS restrictions."
fi