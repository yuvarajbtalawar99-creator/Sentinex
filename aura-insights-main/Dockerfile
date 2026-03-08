# Multi-stage build for React/Vite Frontend
FROM node:18-alpine as build

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the production assets
RUN npm run build

# Stage 2: Serve with Nginx for performance
FROM nginx:alpine

# Copy build assets to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (e.g., for SPA routing)
# RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
