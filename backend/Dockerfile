FROM node:lts-alpine
RUN apk --no-cache add curl
RUN mkdir app

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json ./
COPY .env ./

RUN npm install

COPY src src

CMD npm run dev