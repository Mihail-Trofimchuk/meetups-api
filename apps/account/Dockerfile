FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
ADD . .
RUN npm run build
RUN npm prune --production

CMD npm run start:prod:account