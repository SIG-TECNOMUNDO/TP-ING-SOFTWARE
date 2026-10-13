# SIG-Tecnomundo

Sistema web de inventario, ventas y servicio técnico para las sucursales Yofre Norte y Alta Córdoba. El diseño original de Figma Make se conserva y ahora consume una API con PostgreSQL, autenticación y permisos.

## Tecnología

- Frontend: React 19, Vite, TypeScript y Tailwind CSS 4.
- Backend: Node.js, Express, TypeScript y validación con Zod.
- Base de datos: PostgreSQL 17 mediante `pg` y migraciones SQL explícitas.
- Seguridad: contraseña con bcrypt, sesión JWT en cookie `httpOnly`, permisos por rol y alcance por sucursal.
- Pruebas: Vitest y Supertest.

## Puesta en marcha

1. Copiar `.env.example` como `.env` y cambiar `JWT_SECRET`.
2. Iniciar PostgreSQL: `docker compose up -d postgres`.
3. Aplicar el esquema: `corepack pnpm@10.34.3 db:migrate`.
4. Crear datos iniciales: `corepack pnpm@10.34.3 db:seed`.
5. Iniciar frontend y API: `corepack pnpm@10.34.3 dev`.

El frontend se abre en `http://localhost:8443` y la API en `http://localhost:3001/api`.

Usuario inicial: `admin@tecnomundo.com` / `admin`. Esta contraseña es sólo para desarrollo y debe cambiarse antes de publicar.

## Comandos

- `pnpm dev`: frontend y API en modo desarrollo.
- `pnpm typecheck`: chequeo estricto de frontend y backend.
- `pnpm test`: pruebas automatizadas.
- `RUN_DB_TESTS=true pnpm test`: incluye pruebas integrales contra PostgreSQL (en PowerShell: `$env:RUN_DB_TESTS='true'`).
- `pnpm build`: build de producción del frontend.
- `pnpm build:api`: compilación del backend.
- `pnpm db:migrate`: crea o actualiza el esquema.
- `pnpm db:seed`: carga sucursales, roles, usuarios, clientes y productos iniciales.

## Reglas importantes

- Una venta descuenta stock y registra sus movimientos en una única transacción.
- Un repuesto asignado a una orden también descuenta stock transaccionalmente.
- Los permisos se controlan en la API; ocultar botones sólo mejora la interfaz.
- Los usuarios de Ventas y Técnico quedan limitados a su sucursal.

Más información en [docs/architecture.md](docs/architecture.md) y [docs/permissions.md](docs/permissions.md).
