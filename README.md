# Puntored Frontend (React + Vite + Tailwind)

Interfaz de administración para la gestión de recargas y transacciones, conectada al backend de Puntored.

## Funcionalidades

- Inicio de sesión con credenciales de administrador.
- Listado de transacciones con paginación y filtros.
- Búsqueda por número de celular o proveedor.
- Creación de transacciones manuales.
- Soft delete de transacciones.
- Recargas a Puntored con visualización de ticket.

## 📦 Requisitos Previos

- **Node.js 18+**
- Backend corriendo en local o remoto.

## ⚙️ Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

# URL del backend en desarrollo o producción
VITE_API_URL=http://localhost:8080 (O direccion donde este corriendo el back)

# Ejecucion en local:
- Instalar dependencias:
npm install

- Ejecutar en modo desarrollo:
npm run dev

- La app estará en:
http://localhost:5173

