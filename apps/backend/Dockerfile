# Dockerfile para Backend NestJS
FROM node:18-alpine AS base

# Instalar pnpm y OpenSSL para Prisma
RUN npm install -g pnpm && apk add --no-cache openssl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ui/package.json ./packages/ui/
COPY pnpm-workspace.yaml ./

# Copiar pnpm-lock.yaml si existe
COPY pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install

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

# Instalar pnpm, wget, curl, netcat y OpenSSL para Prisma
RUN npm install -g pnpm && apk add --no-cache wget curl netcat-openbsd openssl dos2unix

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ui/package.json ./packages/ui/
COPY pnpm-workspace.yaml ./

# Copiar pnpm-lock.yaml si existe
COPY pnpm-lock.yaml* ./

# Instalar solo dependencias de producción
RUN pnpm install --prod

# Copiar build desde stage anterior
COPY --from=base --chown=nestjs:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=base --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=nestjs:nodejs /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=base --chown=nestjs:nodejs /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=base --chown=nestjs:nodejs /app/apps/backend/prisma ./apps/backend/prisma

# Copiar scripts
COPY apps/backend/start.sh /start.sh
COPY apps/backend/health-check.sh /health-check.sh
RUN dos2unix /start.sh /health-check.sh && chmod +x /start.sh /health-check.sh && chown nestjs:nodejs /start.sh /health-check.sh

# Cambiar permisos de directorios
RUN chown -R nestjs:nodejs /app

# Cambiar al usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001

# Usar el script de inicio simple
HEALTHCHECK --interval=30s --timeout=10s --retries=5 CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/products || exit 1
CMD ["/start.sh"]
