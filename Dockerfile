FROM node:16-alpine

COPY . .
RUN git submodule update --init
RUN npm install && npm install -g typescript
RUN tsc

ENTRYPOINT ["node", "/src/index.js"]
