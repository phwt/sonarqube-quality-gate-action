FROM node:20-alpine

COPY . .
RUN npm ci && npm install -g typescript
RUN tsc

ENTRYPOINT ["node", "/src/index.js"]
