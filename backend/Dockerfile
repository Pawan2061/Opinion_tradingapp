FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache openssl && npm install

COPY . .

RUN npm install -g typescript ts-node
RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/app.js