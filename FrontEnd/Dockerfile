# ---- Stage 1: Build the frontend ----
FROM node:22.18.0 AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (only production needed later)
RUN npm ci

# Copy source code
COPY . .

# Build production-ready files
RUN npm run build

# ---- Stage 2: Serve using lightweight web server ----
FROM nginx:stable-alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (standard for web servers)
EXPOSE 80

# Default Nginx start command
CMD ["nginx", "-g", "daemon off;"]
