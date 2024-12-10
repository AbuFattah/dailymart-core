# Stage 1 : development
FROM node:20-bullseye-slim as development

WORKDIR /app

COPY package*.json ./

RUN yarn install

RUN apt update && apt install redis-tools -y && apt install bash & npm install -g yarn

COPY . .


EXPOSE 3000

CMD ["yarn","start:dev"]


# Stage 2 : build
FROM node:20-bullseye-slim as build

WORKDIR /app


COPY package*.json ./

RUN yarn install 

COPY . .

RUN yarn build


# Stage 3 : Production
FROM node:20-bullseye-slim as production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app && yarn install --production 

CMD ["node","dist/main"]


EXPOSE 3000



