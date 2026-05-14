FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build

FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS production
WORKDIR /app
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
EXPOSE 8080
CMD ["npm", "start"]
