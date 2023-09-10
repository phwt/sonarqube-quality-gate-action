FROM node:20-alpine

COPY . .
RUN npm install && npm install -g typescript
RUN tsc

ENTRYPOINT ["node", "/src/index.js"]
