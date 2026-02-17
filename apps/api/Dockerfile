FROM node:20-slim

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json apps/api/
COPY shared/types/package*.json shared/types/

RUN npm install

COPY apps/api apps/api
COPY shared/types shared/types

WORKDIR /app/apps/api
EXPOSE 4000

CMD ["sh", "-c", "npm run prisma:generate && npx prisma db push && npm run prisma:seed && npm run dev"]
