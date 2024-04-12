#
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY package*.json ./

RUN npm install --only=prod

CMD [ "npm", "run", "start:prod" ]
