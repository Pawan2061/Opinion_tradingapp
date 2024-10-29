FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript ts-node
RUN npm run build

RUN npx prisma generate


EXPOSE 3000

CMD ["node", "dist/app.js"]
