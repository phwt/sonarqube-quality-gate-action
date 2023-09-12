FROM node:20-alpine

COPY . .
RUN npm install -g npm@10.1.0 && npm install -g typescript
RUN npm i @actions/core
RUN tsc

ENTRYPOINT ["node", "/src/index.js"]
