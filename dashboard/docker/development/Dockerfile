FROM node:18-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock* .yarnrc.yml ./
COPY .yarn/ ./.yarn/

RUN corepack enable
RUN yarn --frozen-lockfile

COPY src ./src
COPY public ./public
COPY next.config.mjs .
# COPY tsconfig.json .

ENV NEXT_TELEMETRY_DISABLED 1

CMD yarn dev
