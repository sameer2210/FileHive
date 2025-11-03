# ===== Base Stage =====
FROM node:22-alpine AS base

WORKDIR /app
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# ===== Runtime Stage =====
FROM node:22-alpine AS production

WORKDIR /app

# Copy node_modules from base
COPY --from=base /app/node_modules ./node_modules

# Copy source code
COPY . .

# Environment variables
ENV NODE_ENV=production \
    PORT=5050

EXPOSE 5050

# Start server
CMD ["npm", "run", "start"]
