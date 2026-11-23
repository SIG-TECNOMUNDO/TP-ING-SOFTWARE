import type { Role } from "../auth/permissions.js"

/** Solo el Administrador puede ver el precio de costo (riesgo R6). */
export function canSeeCostPrice(role: Role) {
  return role === "ADMIN"
}

export function stripCostPrice<T extends { costPrice?: unknown }>(
  products: T[],
  role: Role,
): (T | Omit<T, "costPrice">)[] {
  if (canSeeCostPrice(role)) return products
  return products.map(({ costPrice: _hidden, ...rest }) => rest)
}
