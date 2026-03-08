# Production serve script for Windows environments
# Uses uvicorn directly but with optimized settings for production.

$env:PORT = if ($env:PORT) { $env:PORT } else { "8080" }

Write-Host "🚀 Starting SENTINEX ML Service on port $env:PORT (Production Mode)..."
uvicorn main:app --host 0.0.0.0 --port $env:PORT --no-access-log --workers 2
