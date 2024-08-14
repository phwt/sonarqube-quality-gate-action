FROM node:20-alpine

COPY . .
RUN npm ci && npm install -g typescript && tsc

ENTRYPOINT ["node", "/src/index.js"]
