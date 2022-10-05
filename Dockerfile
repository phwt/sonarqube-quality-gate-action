FROM node:16-alpine

COPY . .
RUN npm install && npm install -g typescript
RUN tsc

ENTRYPOINT ["node", "/index.js"]
