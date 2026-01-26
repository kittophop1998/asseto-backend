# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code last (changes most frequently)
COPY tsconfig.json ./
COPY src ./src
COPY main.ts ./

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy prisma schema
COPY prisma ./prisma

# Copy generated prisma client and source from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/main.ts ./

# Expose port
EXPOSE 8083

CMD ["npx", "tsx", "main.ts"]
