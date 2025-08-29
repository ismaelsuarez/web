#!/bin/sh

# Script de entrada para Docker Backend
# Ejecuta migraciones de Prisma y luego inicia la aplicación

set -e

echo "🚀 Iniciando Backend E-commerce..."

# Cambiar al directorio del backend
cd /app/apps/backend

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
until npx prisma db push --accept-data-loss; do
  echo "📊 Base de datos no disponible, reintentando en 5 segundos..."
  sleep 5
done

echo "✅ Base de datos lista y migraciones aplicadas"

# Generar cliente Prisma
echo "🔧 Generando cliente Prisma..."
npx prisma generate

# Iniciar la aplicación
echo "🚀 Iniciando aplicación NestJS..."
exec node dist/main.js
