# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source and build
COPY . .
RUN npm run build

# ─── Stage 2: Production server ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only what we need to run
COPY package*.json ./
RUN npm ci --omit=dev --prefer-offline

# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY server.js ./

# ✅ Cloud Run injects PORT — expose 8080 as default
ENV PORT=8080
EXPOSE 8080

# ✅ Bind to 0.0.0.0, read PORT from env
CMD ["node", "server.js"]
