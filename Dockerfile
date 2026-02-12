# Stage 1: deps
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
# Ignore scripts no deps: postinstall (prisma generate) precisa do schema, que só existe no builder
RUN pnpm install --frozen-lockfile --ignore-scripts

# Stage 2: builder
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm exec prisma generate
RUN pnpm run build

# Stage 3: runner
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Prisma CLI em diretório isolado para evitar conflito com node_modules do standalone
RUN apk add --no-cache libc6-compat && \
  cd /tmp && npm init -y && npm install prisma@6 --omit=dev && cd /app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Standalone já inclui @prisma/client (traced). Migrations com CLI instalado em /tmp.
CMD ["sh", "-c", "/tmp/node_modules/.bin/prisma migrate deploy --schema=/app/prisma/schema.prisma && node server.js"]
