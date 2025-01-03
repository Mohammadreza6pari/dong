FROM node:18-bullseye-slim as base

RUN apt-get update

FROM base as build

RUN mkdir /app
WORKDIR /app
ADD . .

RUN npm i
RUN npx prisma generate

FROM base

RUN mkdir /app
WORKDIR /app
ENV NODE_ENV production

COPY --from=build /app .

CMD [ "bash", "-c", "npx prisma db push && npx prisma db seed && npm run build && npm run start" ]
