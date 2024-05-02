FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn/ ./.yarn/

RUN corepack enable
RUN npm install -g yarn@latest --force # fix graceful exit
RUN yarn --frozen-lockfile
RUN yarn prepare

COPY src ./src
COPY public ./public
COPY styled-system ./styled-system
COPY next.config.mjs .
COPY postcss.config.cjs .
COPY tsconfig.json .

ENV NEXT_TELEMETRY_DISABLED 1

CMD yarn dev
