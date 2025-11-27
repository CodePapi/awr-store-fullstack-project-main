FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY shared/package.json ./shared/
COPY BE/package.json ./BE/

RUN npm install

FROM base AS development
CMD ["npm", "run", "start:dev", "--workspace=BE"]

FROM base AS build
COPY shared ./shared
COPY BE ./BE
RUN npm run build --workspace=shared
RUN npm run build --workspace=BE