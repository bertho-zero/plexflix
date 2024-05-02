FROM node:18-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

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

RUN yarn build

CMD yarn dev

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]
