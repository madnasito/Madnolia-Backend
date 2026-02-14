# --- Stage 1: Base ---
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- Stage 2: Development ---
FROM base AS development
RUN npm install
COPY . .
# Note: we don't copy dist here because we use start:dev which uses ts-node
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# --- Stage 3: Build ---
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# --- Stage 4: Production ---
FROM node:22-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
# COPY --from=build /app/.env.production ./

EXPOSE 3000
USER node
CMD ["npm", "run", "start:prod"]