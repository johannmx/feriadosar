FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Ensure permissions for 'node' user
RUN chown -R node:node /app

EXPOSE 3001

USER node

# Using tsx for ESM + TypeScript support
CMD ["./node_modules/.bin/tsx", "index.ts"]
