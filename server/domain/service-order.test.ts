import { describe, expect, it } from "vitest"
import { canTransition } from "./service-order.js"

describe("transiciones de órdenes", () => {
  it("permite el flujo normal de reparación", () => {
    expect(canTransition("INGRESADO", "EN_DIAGNOSTICO")).toBe(true)
    expect(canTransition("EN_REPARACION", "LISTO_ENTREGA")).toBe(true)
    expect(canTransition("LISTO_ENTREGA", "ENTREGADO")).toBe(true)
  })

  it("impide reabrir una orden entregada", () => {
    expect(canTransition("ENTREGADO", "EN_REPARACION")).toBe(false)
  })
})
