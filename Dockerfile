FROM node:erbium-alpine

COPY . /src/app

WORKDIR /src/app

RUN npm i --production

RUN cp -r ./libraries/@core ./node_modules/ && cd ./node_modules/@core/logger && npm i --production && cd ../http-context && npm i --production

EXPOSE 5000

CMD npm run start
