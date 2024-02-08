FROM node:18-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

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
