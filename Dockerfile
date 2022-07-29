FROM navikt/node-express:16 as builder
WORKDIR /home/node/app

ENV NODE_ENV=production
ENV TZ Europe/Oslo
ENV CI=true

COPY package*.json /home/node/app/
COPY .npmrc /home/node/app/

RUN npm ci

COPY . /home/node/app
RUN npm run build

FROM navikt/node-express:16 as runtime
WORKDIR /home/node/app

ENV PORT=3000
ENV NODE_ENV=production
ENV TZ Europe/Oslo

EXPOSE 3000

COPY --from=builder /home/node/app/ /home/node/app/
RUN chown node:node -R .next/
USER node

CMD ["npm", "start"]
