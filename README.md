# SIG-Tecnomundo

Sistema web de inventario, ventas y servicio técnico para las sucursales Yofre Norte y Alta Córdoba. Conserva el diseño generado en Figma Make y lo conecta con una API real, PostgreSQL, autenticación y permisos.

## Tecnología

- Frontend: React 19, Vite, TypeScript y Tailwind CSS 4.
- Backend: Node.js, Express, TypeScript y validación con Zod.
- Datos: PostgreSQL 17, migraciones SQL explícitas y auditoría.
- Seguridad: JWT en cookie `httpOnly`, contraseñas con bcrypt, roles y alcance por sucursal.

## Puesta en marcha

1. Copiá `.env.example` como `.env` y definí `JWT_SECRET`.
2. Iniciá PostgreSQL: `docker compose up -d postgres`.
3. Aplicá el esquema: `corepack pnpm@10.34.3 db:migrate`.
4. Cargá los datos: `corepack pnpm@10.34.3 db:seed`.
5. Iniciá frontend y API: `corepack pnpm@10.34.3 dev`.

El frontend se abre en `http://localhost:8443` y la API en `http://localhost:3001/api`.

Usuario de desarrollo: `admin@tecnomundo.com` / `admin`.

## Funciones

- Inventario por sucursal, movimientos de stock y actualización masiva auditada.
- Ventas con cálculo seguro de descuentos, recargos, cuotas, promociones, billeteras y Mercado Libre.
- Órdenes técnicas con historial, diagnóstico, repuestos, edición y vínculo con una orden anterior.
- Administración de usuarios, roles y reglas de cobro por sucursal.

## Comandos

- `pnpm dev`: inicia frontend y API.
- `pnpm typecheck`: valida TypeScript completo.
- `pnpm test`: ejecuta las pruebas automatizadas.
- `pnpm build` y `pnpm build:api`: generan ambos builds.
- `pnpm db:migrate` y `pnpm db:seed`: actualizan PostgreSQL.

Los roles y permisos se documentan en [docs/permissions.md](docs/permissions.md), y la arquitectura en [docs/architecture.md](docs/architecture.md).
