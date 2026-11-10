FROM node:22-bookworm-slim AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src

ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM node:22-bookworm-slim AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev \
    && mkdir -p logs \
    && chown -R node:node /app

COPY --chown=node:node src ./src

ENV NODE_ENV=production
ENV PORT=3000

USER node

EXPOSE 3000

CMD ["node", "src/index.js"]
