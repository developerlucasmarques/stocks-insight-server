FROM node:18
WORKDIR /usr/src/stocks-insight
COPY ./package.json .
RUN npm install --only=prod
COPY ./dist ./dist
