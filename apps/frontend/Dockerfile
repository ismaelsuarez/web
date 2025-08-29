# Dockerfile para Frontend React + Vite
FROM node:18-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ui/package.json ./packages/ui/
COPY pnpm-workspace.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

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
COPY apps/frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Exponer puerto
EXPOSE 80

# Comando de inicio
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
