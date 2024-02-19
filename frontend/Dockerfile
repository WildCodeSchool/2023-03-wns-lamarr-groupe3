FROM node:lts-alpine3.17

RUN mkdir app

WORKDIR /app

COPY public public
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json ./
COPY .env ./

RUN npm install --verbose

COPY src src
COPY scss.d.ts scss.d.ts

CMD npm start