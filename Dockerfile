FROM node:24-alpine

COPY . .
RUN npm ci && npm install -g typescript@6 && tsc

ENTRYPOINT ["node", "/src/index.js"]
