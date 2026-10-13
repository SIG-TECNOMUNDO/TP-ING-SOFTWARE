import { describe, expect, it } from "vitest"
import { hasPermission } from "./permissions.js"

describe("permisos por rol", () => {
  it("reserva la administración de usuarios al administrador", () => {
    expect(hasPermission("ADMIN", "users:manage")).toBe(true)
    expect(hasPermission("SALES", "users:manage")).toBe(false)
    expect(hasPermission("TECH", "users:manage")).toBe(false)
  })

  it("permite actualizar órdenes al técnico pero no registrar ventas", () => {
    expect(hasPermission("TECH", "orders:update")).toBe(true)
    expect(hasPermission("TECH", "sales:create")).toBe(false)
  })
})
