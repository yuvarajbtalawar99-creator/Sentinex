# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the server runs on
EXPOSE 5000

# Start the production server
CMD ["npm", "start"]
