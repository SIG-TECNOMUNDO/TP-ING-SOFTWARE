# Arquitectura

SIG-Tecnomundo utiliza un monolito modular. El frontend y la API están en el mismo repositorio, pero las reglas de negocio y el acceso a datos no se mezclan con los componentes visuales.

```text
Navegador React
    │ HTTPS + JSON + cookie httpOnly
    ▼
API Express
    ├── autenticación y permisos
    ├── validación Zod
    ├── módulos de inventario, ventas, clientes y SAT
    └── transacciones y auditoría
         │
         ▼
     PostgreSQL
```

## Organización

- `src/components`: componentes visuales reutilizables.
- `src/context`: sesión y sucursal seleccionada.
- `src/pages`: pantallas y coordinación de cada caso de uso.
- `src/services`: comunicación HTTP y formateadores.
- `server/routes`: controladores HTTP por módulo.
- `server/domain`: reglas independientes de Express y PostgreSQL.
- `server/auth`: permisos, sesión y alcance por sucursal.
- `server/database`: conexión, migración y datos iniciales.

## Modelo de datos

El stock se representa con `branch_stock` para el saldo actual y `stock_movements` para la trazabilidad. Las ventas tienen cabecera, ítems y pagos. Las órdenes técnicas conservan su historial de estados y repuestos utilizados. `audit_logs` registra acciones sensibles.

## Decisiones

- SQL explícito facilita relacionar el código con los conceptos estudiados en base de datos.
- UUID identifica entidades expuestas por la API; los números visibles de venta y orden son correlativos separados.
- No se adoptaron microservicios: aumentarían la complejidad operativa sin aportar valor al alcance actual.
