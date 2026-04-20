# Stage 1: Build
FROM node:18-slim AS builder

WORKDIR /app

# Install dependencies first (layer cache optimization)
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy source code
COPY . .

# Copy env file for build
RUN cp .env.production .env.local 2>/dev/null || true

# Build the Next.js app
RUN npm run build

# Stage 2: Production Runner
FROM node:18-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only what is needed to run the app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
