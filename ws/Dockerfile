FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript ts-node
RUN npm run build



EXPOSE 8080

CMD ["node", "dist/index.js"]
