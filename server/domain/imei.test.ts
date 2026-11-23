import { describe, expect, it } from "vitest"
import {
  isValidImei,
  normalizeImei,
  requiresImei,
  warrantyStatus,
} from "./imei.js"

describe("IMEI", () => {
  it("exige IMEI solo para equipos", () => {
    expect(requiresImei("Equipos")).toBe(true)
    expect(requiresImei("Accesorios")).toBe(false)
  })

  it("valida 15 dígitos", () => {
    expect(isValidImei("354123098765432")).toBe(true)
    expect(isValidImei("3541 2309 8765 432")).toBe(true)
    expect(isValidImei("")).toBe(false)
    expect(isValidImei("12345")).toBe(false)
    expect(isValidImei("35412309876543A")).toBe(false)
    expect(normalizeImei("35-41")).toBe("3541")
  })

  it("calcula la garantía de 90 días", () => {
    const sale = new Date("2026-01-01T12:00:00Z")
    expect(warrantyStatus(sale, new Date("2026-03-01T00:00:00Z")).active).toBe(
      true,
    )
    expect(warrantyStatus(sale, new Date("2026-04-15T00:00:00Z")).active).toBe(
      false,
    )
  })
})
