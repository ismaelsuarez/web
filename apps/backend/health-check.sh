#!/bin/ash

# Script de health check para el backend
# Verifica que la aplicación esté respondiendo correctamente

set -e

# Función para verificar que el proceso de Node.js esté ejecutándose
check_node_process() {
  if pgrep -f "node.*dist/main.js" >/dev/null; then
    return 0
  else
    return 1
  fi
}

# Función para verificar el endpoint de health
check_health_endpoint() {
  local port=${1:-3001}
  local host=${2:-localhost}
  local url="http://$host:$port/health"
  
  # Intentar con wget primero
  if command -v wget >/dev/null 2>&1; then
    if wget --no-verbose --tries=1 --spider "$url" >/dev/null 2>&1; then
      return 0
    fi
  fi
  
  # Intentar con curl como alternativa
  if command -v curl >/dev/null 2>&1; then
    if curl -f -s "$url" >/dev/null 2>&1; then
      return 0
    fi
  fi
  
  return 1
}

# Ejecutar verificaciones
echo "🔍 Ejecutando health check..."

# Verificar proceso de Node.js
if ! check_node_process; then
  echo "❌ Proceso de Node.js no encontrado"
  exit 1
fi

echo "✅ Proceso de Node.js ejecutándose"

# Verificar endpoint de health
if ! check_health_endpoint 3001; then
  echo "❌ Endpoint /health no responde"
  exit 1
fi

echo "✅ Endpoint /health responde correctamente"
echo "✅ Health check completado exitosamente"
exit 0
