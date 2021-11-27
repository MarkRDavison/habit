FROM node:alpine as BUILD

WORKDIR /app

COPY / /app/
RUN npm ci

ENV PATH /usr/src/app/node_modules/.bin:$PATH

CMD ["npm", "run", "test:e2ehl"]