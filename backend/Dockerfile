# 1 этап
FROM node:20-alpine AS builder
WORKDIR /app


COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build   # → dist/

# 2 этап
FROM node:20-alpine AS runner
WORKDIR /app


COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ecosystem.config.js ./


RUN npm ci --only=prod && npm install -g pm2

ENV PORT=4000
EXPOSE 4000


CMD ["pm2-runtime", "ecosystem.config.js"]
