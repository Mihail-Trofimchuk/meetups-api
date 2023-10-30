FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install
ADD . .
COPY ../../prisma/schema.prisma prisma/schema.prisma

RUN npm run prisma:generate
RUN npm run build account