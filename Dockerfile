FROM node:18
WORKDIR /usr/src/stocks-insight
COPY ./package.json .
RUN npm install --omit=dev
COPY ./dist ./dist
