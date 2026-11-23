import { describe, expect, it } from "vitest"
import { stripCostPrice } from "./product-visibility.js"

const products = [
  { id: "1", name: "Galaxy S23", salePrice: 100, costPrice: 70 },
]

describe("Visibilidad del precio de costo", () => {
  it("el administrador ve el costo", () => {
    expect(stripCostPrice(products, "ADMIN")[0]).toHaveProperty("costPrice", 70)
  })

  it("ventas y técnico no reciben el costo", () => {
    expect(stripCostPrice(products, "SALES")[0]).not.toHaveProperty("costPrice")
    expect(stripCostPrice(products, "TECH")[0]).not.toHaveProperty("costPrice")
  })
})
