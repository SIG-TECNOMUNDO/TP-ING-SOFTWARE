import { describe, expect, it } from "vitest"
import {
  imeiListError,
  isValidImei,
  normalizeImei,
  warrantyStatus,
} from "./imei.js"

describe("IMEI", () => {
  it("valida 15 dígitos", () => {
    expect(isValidImei("354123098765432")).toBe(true)
    expect(isValidImei("3541 2309 8765 432")).toBe(true)
    expect(isValidImei("")).toBe(false)
    expect(isValidImei("12345")).toBe(false)
    expect(isValidImei("35412309876543A")).toBe(false)
    expect(normalizeImei("35-41")).toBe("3541")
  })

  it("rechaza listas con IMEI inválidos o repetidos", () => {
    expect(imeiListError(["356938035643809", "490154203237518"])).toBeNull()
    expect(imeiListError(["356938035643809", "356938035643809"])).toMatch(
      /repetido/,
    )
    expect(imeiListError(["123"])).toMatch(/no es válido/)
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
