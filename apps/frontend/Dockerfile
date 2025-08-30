# Dockerfile para Frontend React + Vite
FROM node:18-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json ./
COPY tsconfig.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ui/package.json ./packages/ui/
COPY pnpm-workspace.yaml ./

# Copiar pnpm-lock.yaml si existe
COPY pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install

# Copiar código fuente
COPY apps/frontend ./apps/frontend
COPY packages/ui ./packages/ui

# Build de la aplicación
WORKDIR /app/apps/frontend
RUN pnpm build
WORKDIR /app

# Stage de producción con nginx
FROM nginx:alpine AS production

# Copiar configuración personalizada de nginx
COPY apps/frontend/nginx.conf /etc/nginx/nginx.conf

# Copiar build desde stage anterior
COPY --from=base /app/apps/frontend/dist /usr/share/nginx/html

# Crear archivo de configuración para variables de entorno
RUN echo 'window.ENV = {};' > /usr/share/nginx/html/env-config.js

# Script para inyectar variables de entorno
RUN apk add --no-cache dos2unix
COPY apps/frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN dos2unix /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Exponer puerto
EXPOSE 80

# Comando de inicio
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
