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

## Envios del cliente

Estos endpoints requieren `Authorization: Bearer <token>`:

- `GET /api/shipments`: lista los envios del cliente autenticado.
- `POST /api/shipments`: crea un envio.
- `GET /api/shipments/:trackingCode`: consulta un envio propio por codigo de guia.

Ejemplo para crear un envio:

```json
{
  "destination": "Zona 10, Ciudad de Guatemala",
  "destinationRegion": "Guatemala",
  "weight": 2.5
}
```

## Rastreo publico

Este endpoint no requiere autenticacion:

- `GET /api/tracking/:trackingCode`: consulta el estado y eventos de un paquete por codigo de guia.

## Panel administrativo

Estos endpoints requieren token de un usuario con rol `admin`:

- `GET /api/admin/dashboard`: obtiene metricas del tablero administrativo.
- `GET /api/admin/users`: lista usuarios.
- `POST /api/admin/users`: crea usuarios.
- `GET /api/admin/users/:id`: consulta un usuario.
- `PUT /api/admin/users/:id`: actualiza un usuario.
- `DELETE /api/admin/users/:id`: elimina un usuario.
- `GET /api/admin/shipments`: lista todos los envios.
- `POST /api/admin/shipments`: crea un envio para cualquier usuario.
- `GET /api/admin/shipments/:id`: consulta un envio.
- `PUT /api/admin/shipments/:id`: actualiza un envio.
- `DELETE /api/admin/shipments/:id`: elimina un envio.

Ejemplo para actualizar estado de un envio:

```json
{
  "status": "in_transit",
  "eventDescription": "Paquete en ruta",
  "eventLocation": "Centro de distribucion"
}
```
