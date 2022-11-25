FROM node:16 AS builder
WORKDIR /home/node/app

ENV NODE_ENV=production
ENV TZ Europe/Oslo
ENV CI=true

COPY package*.json /home/node/app/
COPY prepare.js /home/node/app/
COPY .npmrc /home/node/app/

RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    NODE_AUTH_TOKEN=$(cat /run/secrets/NODE_AUTH_TOKEN) \
    npm ci --prefer-offline --no-audit --ignore-scripts

# Kjør prepare uten NODE_AUTH_TOKEN tilgjengelig
RUN npm rebuild && npm run prepare --if-present

COPY . /home/node/app

RUN npm run build

# ---- Runner ----
FROM node:16-alpine AS runtime
WORKDIR /home/node/app

ENV PORT=3000
ENV NODE_ENV=production
ENV TZ Europe/Oslo

COPY --from=builder /home/node/app/next.config.js ./
COPY --from=builder /home/node/app/package.json ./

COPY --from=builder /home/node/app/.next/standalone ./
COPY --from=builder /home/node/app/.next/static ./.next/static

EXPOSE 3000
USER node

CMD ["node", "server.js"]
