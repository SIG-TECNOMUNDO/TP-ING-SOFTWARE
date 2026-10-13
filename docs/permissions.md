# Matriz de permisos

| Función | Administrador | Ventas | Técnico |
|---|---:|---:|---:|
| Ver dashboard | Sí | Sí, su sucursal | Sí, su sucursal |
| Consultar inventario | Sí | Sí, su sucursal | Sí, su sucursal |
| Crear o editar productos | Sí | No | No |
| Consultar clientes | Sí | Sí | Sí |
| Crear clientes | Sí | Sí | No |
| Registrar ventas | Sí | Sí, su sucursal | No |
| Crear órdenes | Sí | Sí, su sucursal | No |
| Actualizar diagnóstico y estado | Sí | No | Sí, su sucursal |
| Administrar usuarios | Sí | No | No |
| Descargar reportes | Sí | No | No |

El administrador puede seleccionar una sucursal o consultar todas. Los demás usuarios reciben su sucursal desde la sesión; la API rechaza cualquier intento de operar sobre otra.
