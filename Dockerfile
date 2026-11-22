FROM node:24-alpine

COPY . .
RUN npm config set update-notifier false && \
    npm config set audit false && \
    npm config set loglevel error && \
    npm config set fund false
RUN npm ci && npm install -g typescript@5.9.3 && tsc

ENTRYPOINT ["node", "/src/index.js"]
