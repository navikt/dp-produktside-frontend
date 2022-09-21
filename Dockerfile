FROM node:16 AS builder
WORKDIR /home/node/app

ENV TZ Europe/Oslo
ENV CI=true

COPY package*.json /home/node/app/
COPY prepare.js /home/node/app/
COPY .npmrc /home/node/app/

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    echo '//npm.pkg.github.com/:_authToken='$(cat /run/secrets/NODE_AUTH_TOKEN) >> .npmrc

RUN npm ci

COPY . /home/node/app
RUN npm run build

FROM node:16-alpine AS runtime
WORKDIR /home/node/app

ENV PORT=3000
ENV NODE_ENV=production
ENV TZ Europe/Oslo

EXPOSE 3000

COPY --from=builder /home/node/app/ /home/node/app/
RUN chown node:node -R .next/
USER node

CMD ["npm", "start"]
