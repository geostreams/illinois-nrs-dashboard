# ---- Stage 1: Install deps + build ----
FROM node:22-alpine AS builder

# Keep build tooling in builder only.
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
RUN npm install -g npm@11.16.0
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci --include=optional
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# ---- Stage 2: Production image ----
FROM node:22-alpine AS production

RUN apk update && apk add --no-cache vips

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY --from=builder /opt/node_modules ./node_modules
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/config ./config
COPY --from=builder /opt/app/src ./src
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/package.json ./
COPY --from=builder /opt/app/tsconfig.json ./
COPY --from=builder /opt/app/favicon.png ./

RUN chown -R node:node /opt/app
USER node

EXPOSE 1337
CMD ["npm", "run", "start"]

# ---- Stage 3: Development target ----
FROM node:22-alpine AS development

RUN apk update && apk add --no-cache vips-dev

ENV NODE_ENV=development

WORKDIR /opt/
COPY --from=builder /opt/node_modules ./node_modules
ENV PATH=/opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .

RUN chown -R node:node /opt/app
USER node

EXPOSE 1337
CMD ["npm", "run", "develop"]
