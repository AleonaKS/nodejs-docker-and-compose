# 1 
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# 2 
FROM node:18-alpine
WORKDIR /app

RUN npm install -g pm2

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY ecosystem.config.js .

ENV PORT=4000
EXPOSE 4000

CMD ["pm2-runtime", "ecosystem.config.js"]
