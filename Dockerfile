# Stage 1 : Build

FROM node:20-alpine as build

WORKDIR /app


COPY package*.json ./

RUN npm install

COPY . .

Run npm run build


# Stage 2 : Production

FROM node:20-alpine as production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm install --production

CMD ["node","dist/main"]


EXPOSE 3000