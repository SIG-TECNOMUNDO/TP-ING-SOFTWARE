export type Role = "ADMIN" | "SALES" | "TECH"

export type Permission = "dashboard:read" | "products:read" | "products:write" | "clients:read" | "clients:write" | "sales:create" | "orders:read" | "orders:create" | "orders:update" | "users:manage" | "reports:read"

const permissions: Record<Role, Permission[]> = {
  ADMIN: [
    "dashboard:read",
    "products:read",
    "products:write",
    "clients:read",
    "clients:write",
    "sales:create",
    "orders:read",
    "orders:create",
    "orders:update",
    "users:manage",
    "reports:read",
  ],
  SALES: [
    "dashboard:read",
    "products:read",
    "clients:read",
    "clients:write",
    "sales:create",
    "orders:read",
    "orders:create",
  ],
  TECH: [
    "dashboard:read",
    "products:read",
    "clients:read",
    "orders:read",
    "orders:update",
  ],
}

export function hasPermission(role: Role, permission: Permission) {
  return permissions[role].includes(permission)
}
