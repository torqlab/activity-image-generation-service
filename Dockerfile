# FROM node:24-slim
FROM oven/bun:1.3 as builder

WORKDIR /build

# Copy workspace files
COPY package.json bun.lock* ./
COPY tsconfig.json tsconfig.json
COPY eslint.config.mjs eslint.config.mjs
COPY .prettierrc .prettierrc

# Copy service files
COPY . .

# Install dependencies and build
RUN bun install
RUN bun run build

# Runtime stage
FROM oven/bun:1.3-slim

WORKDIR /app

# Copy package.json and runtime dependencies
COPY --from=builder /build/package.json ./
COPY --from=builder /build/bun.lock ./
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD bun run --eval "const response = await fetch('http://localhost:3002'); response.status === 200 ? process.exit(0) : process.exit(1)"

# Expose port
EXPOSE 3002

# Start application
CMD ["bun", "run", "start"]
