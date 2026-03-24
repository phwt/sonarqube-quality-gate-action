FROM node:24-alpine

COPY . .
RUN npm ci && npm install -g typescript@5.9.3 && tsc

ENTRYPOINT ["node", "/src/index.js"]
