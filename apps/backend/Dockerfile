# Dockerfile para Backend NestJS
FROM node:18-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ui/package.json ./packages/ui/
COPY pnpm-workspace.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY apps/backend ./apps/backend
COPY packages/ui ./packages/ui
COPY apps/backend/prisma ./apps/backend/prisma

# Generar cliente Prisma
RUN pnpm --filter backend db:generate

# Build de la aplicación
RUN pnpm --filter backend build

# Stage de producción
FROM node:18-alpine AS production

# Instalar pnpm y wget para health checks
RUN npm install -g pnpm && apk add --no-cache wget

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ui/package.json ./packages/ui/
COPY pnpm-workspace.yaml ./

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar build desde stage anterior
COPY --from=base --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=base --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nestjs:nodejs /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=base --chown=nestjs:nodejs /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=base --chown=nestjs:nodejs /app/apps/backend/prisma ./apps/backend/prisma

# Copiar script de entrada
COPY apps/backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Cambiar al usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Comando de inicio
ENTRYPOINT ["/docker-entrypoint.sh"]
