# syntax=docker/dockerfile:1

FROM node:16.13.1

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install -g nodemon@2.0.15 ts-node@10.4.0 typescript@4.5.5 tsconfig-paths@3.12.0

RUN npm install

COPY . .