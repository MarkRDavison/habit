FROM node:alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY . .
RUN npm ci
RUN npm run build
RUN npm run test
RUN npm run lint

# remove development dependencies
RUN npm prune --production

FROM node:alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/app/package.json .
COPY --from=BUILD_IMAGE /usr/src/app/server.mjs .
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

CMD ["npm", "run", "serve:served"]
