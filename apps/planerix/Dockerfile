# syntax=docker/dockerfile:1.6

############################
# 1) deps: установка зависимостей
############################
FROM node:20-alpine AS deps
WORKDIR /app

# Для нативных модулей Next/Sharp на Alpine
RUN apk add --no-cache libc6-compat

# pnpm через corepack
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Копируем lockfile и устанавливаем deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

############################
# 2) build: сборка Next.js (standalone)
############################
FROM node:20-alpine AS build
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Подхватываем аргументы окружения из docker-compose
ARG RESEND_API_KEY
ARG RESEND_FROM
ARG CONTACT_TO

# Делаем их доступными на этапе билда
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV RESEND_FROM=$RESEND_FROM
ENV CONTACT_TO=$CONTACT_TO

# Берем зависимости и код
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next
ENV NEXT_TELEMETRY_DISABLED=1
# Иногда нужно увеличивать память V8 (если проект большой)
# ENV NODE_OPTIONS=--max_old_space_size=2048

RUN pnpm build

############################
# 3) runner: минимальный рантайм
############################
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Alpine fix
RUN apk add --no-cache libc6-compat

# Безопасный юзер
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Копируем standalone-билд
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Права
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]