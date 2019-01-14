FROM node:11-slim

RUN mkdir app
COPY ./ /app
WORKDIR /app
RUN npm install

ENTRYPOINT [ "node", "src/index.js" ]