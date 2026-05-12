# Proyecto_no.2_PW_JABS_BJAQ

Proyecto web Aeropaq con frontend React/Vite y backend Node.js/Express.

## Estructura

- `frontend/aeropaq-web`: aplicacion frontend.
- `backend`: API REST con Express y conexion a MySQL.

## Backend

Consulta [backend/README.md](backend/README.md) para instalar dependencias, crear la base de datos y ejecutar la API.

## Arranque rapido

Desde la raiz del proyecto:

```bash
npm run install:all
npm run db:init
npm run dev
```

Scripts utiles:

- `npm run install:all`: instala dependencias de backend y frontend.
- `npm run db:init`: crea/aplica la base `aeropaq_db` usando `backend/database/schema.sql` con usuario `root` sin contrasena.
- `npm run db:init:password`: igual que el anterior, pero pidiendo contrasena de MySQL.
- `npm run dev:backend`: levanta la API en `http://localhost:3000`.
- `npm run dev:frontend`: levanta React/Vite en `http://localhost:5173`.
- `npm run dev`: levanta backend y frontend al mismo tiempo.
- `npm run build`: compila el frontend.
- `npm run lint`: ejecuta lint del frontend.
