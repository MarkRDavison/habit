FROM node:alpine as BUILD

WORKDIR /app

COPY / /app/
RUN npm ci
RUN npm run build
RUN npm run test

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# remove development dependencies
RUN npm prune --production

FROM node:alpine
WORKDIR /app
COPY --from=BUILD /app/dist ./dist
COPY --from=BUILD /app/package.json .
COPY --from=BUILD /app/node_modules ./node_modules

CMD ["npm", "run", "start"]