FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:22@sha256:a33d079913cb8d448655e3d736501b0a8e107664caee330560e31fc0582d16c0 AS runtime
WORKDIR /home/node/app

ENV PORT=3000 \
    NODE_ENV=production \
    TZ=Europe/Oslo

COPY next.config.js ./
COPY package.json ./

COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static


EXPOSE 3000

CMD ["server.js"]
