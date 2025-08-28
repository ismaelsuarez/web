-- Script de inicialización para PostgreSQL
-- Este archivo se ejecuta automáticamente al crear el contenedor

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear índices adicionales si es necesario
-- (Prisma maneja la creación de tablas automáticamente)

-- Configurar timezone
SET timezone = 'UTC';

-- Configurar encoding
SET client_encoding = 'UTF8';
