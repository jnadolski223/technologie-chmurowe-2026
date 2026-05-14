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
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --chown=app:app package*.json ./
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=dependencies --chown=app:app /app/node_modules ./node_modules
USER app
EXPOSE 8080
CMD ["npm", "start"]
