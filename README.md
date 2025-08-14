# Puntored Frontend (React + Vite + Tailwind)

Este proyecto implementa:
- Login de admin contra `/api/auth/login`.
- Listado de transacciones con paginación (7 por página por defecto).
- Filtros por celular y rango de fechas (server-side). Filtros por `supplierId` y `status` (client-side).
- Soft delete (`DELETE /api/admin/transactions/{id}`).
- Crear transacciones manuales (`POST /api/admin/transactions`).
- Recargas a Puntored (`POST /api/buy`) con resumen/ticket.

## Requisitos
- Node.js 18+
- Backend corriendo en `http://localhost:8081` (como lo tienes con Spring Boot).

## Cómo correr en desarrollo
```bash
cd puntored-frontend
npm i
npm run dev
```
La app estará en `http://localhost:5173`. El proxy de Vite reenvía `/api/**` al backend para evitar CORS.

## Variables de entorno (opcional)
- `VITE_API_BASE`: URL del backend (por defecto `http://localhost:8081` para el proxy).
  - En producción puedes compilar con `VITE_API_BASE=https://tu-backend.tld` y **deshabilitar** el proxy.

## Build de producción
```bash
npm run build
npm run preview
```

## Despliegue
- Opción 1: Servir los archivos estáticos de `dist/` en Nginx/Apache y configurar CORS en el backend.
- Opción 2: Servir el frontend desde el mismo host del backend (p. ej., mover `dist/` a `src/main/resources/static` del backend).
