#!/bin/ash

# Script de entrada para Docker Backend
# Ejecuta migraciones de Prisma y luego inicia la aplicación

set -e

echo "🚀 Iniciando Backend E-commerce..."

# Cambiar al directorio del backend
cd /app/apps/backend

# Verificar que los archivos necesarios existen
echo "📁 Verificando archivos necesarios..."
echo "📂 Directorio actual: $(pwd)"
echo "📂 Contenido del directorio:"
ls -la

if [ ! -f "dist/main.js" ]; then
  echo "❌ Error: dist/main.js no encontrado. Verificando build..."
  echo "📂 Contenido de dist/:"
  ls -la dist/ || echo "❌ Directorio dist/ no existe"
  exit 1
fi

if [ ! -f "prisma/schema.prisma" ]; then
  echo "❌ Error: prisma/schema.prisma no encontrado"
  echo "📂 Contenido de prisma/:"
  ls -la prisma/ || echo "❌ Directorio prisma/ no existe"
  exit 1
fi

echo "✅ Archivos necesarios verificados"

# Generar cliente Prisma primero
echo "🔧 Generando cliente Prisma..."
if ! npx prisma generate; then
  echo "❌ Error: Fallo al generar cliente Prisma"
  exit 1
fi
echo "✅ Cliente Prisma generado"

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
max_attempts=15
attempt=0

while [ $attempt -lt $max_attempts ]; do
  echo "📊 Intento $((attempt + 1))/$max_attempts de conectar a la base de datos..."
  
  # Intentar aplicar migraciones directamente
  if npx prisma db push --accept-data-loss; then
    echo "✅ Base de datos lista y migraciones aplicadas"
    break
  else
    attempt=$((attempt + 1))
    if [ $attempt -lt $max_attempts ]; then
      echo "📊 Base de datos no disponible, reintentando en 3 segundos..."
      sleep 3
    fi
  fi
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Error: No se pudo conectar a la base de datos después de $max_attempts intentos"
  echo "🔍 Verificando variables de entorno..."
  echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
  echo "❌ Fallo crítico: La aplicación requiere una base de datos funcional"
  echo "❌ No se puede continuar sin migraciones aplicadas correctamente"
  exit 1
fi

echo "✅ Base de datos lista y migraciones aplicadas"

# Iniciar la aplicación
echo "🚀 Iniciando aplicación NestJS..."
echo "📊 Puerto: ${PORT:-3001}"
echo "🌍 Entorno: ${NODE_ENV:-development}"

# Verificar que el archivo main.js existe y es ejecutable
echo "🔍 Verificando archivo main.js..."
if [ ! -f "dist/main.js" ]; then
  echo "❌ Error: dist/main.js no existe después de las verificaciones"
  exit 1
fi

echo "✅ Archivo main.js encontrado"

# Ejecutar con más logging
echo "🚀 Ejecutando: node dist/main.js"
exec node dist/main.js
