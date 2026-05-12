# Aeropaq Backend

Backend Node.js con Express y MySQL para el proyecto Aeropaq.

## Requisitos

- Node.js
- MySQL Server

## Instalacion

```bash
cd backend
npm install
copy .env.example .env
```

Edita `.env` con tus credenciales locales de MySQL.

## Crear base de datos

Desde MySQL:

```sql
SOURCE database/schema.sql;
```

O desde la terminal, ajustando usuario y ruta si hace falta:

```bash
mysql -u root -p < database/schema.sql
```

## Ejecutar

```bash
npm run dev
```

La API queda disponible en:

- `GET http://localhost:3000/`
- `GET http://localhost:3000/api/health`
- `GET http://localhost:3000/api/health/db`

## Autenticacion

El esquema crea un administrador inicial:

- Correo: `admin@aeropaq.com`
- Contrasena: `Admin123!`

Endpoints disponibles:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` con encabezado `Authorization: Bearer <token>`
