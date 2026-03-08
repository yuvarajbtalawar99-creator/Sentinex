# Use Python 3.9 slim for a smaller image size
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for some Python packages (like Prophet/Pandas)
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Use the production serve script
RUN chmod +x serve.sh
CMD ["./serve.sh"]
