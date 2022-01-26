FROM cypress/base:12.6.0 as BUILD

WORKDIR /app

COPY / /app/

RUN npm ci

ENV PATH /usr/src/app/node_modules/.bin:$PATH

CMD ["npm", "run", "test:e2ehlk8s"]
