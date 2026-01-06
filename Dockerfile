# Build stage
FROM node:22

WORKDIR /app

EXPOSE 3000

COPY package.json package-lock.json ./

RUN npm install -g @nestjs/cli
RUN npm install

COPY . .

RUN chown -R node:node /app

USER node

CMD ["npm", "run", "start:dev"]