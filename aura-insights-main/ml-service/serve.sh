#!/bin/bash
# Production serve script for Linux-based hosting (Render, AWS, DigitalOcean)
# Uses gunicorn with uvicorn workers for high performance and process management.

PORT=${PORT:-8080}
WORKERS=${WORKERS:-2}
TIMEOUT=${TIMEOUT:-120}

echo "🚀 Starting SENTINEX ML Service with $WORKERS workers on port $PORT..."
gunicorn -w $WORKERS -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT --timeout $TIMEOUT
