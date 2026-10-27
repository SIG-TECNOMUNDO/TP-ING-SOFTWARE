import { describe, expect, it } from "vitest"
import { calculatePayment } from "./payment.js"

describe("reglas de cobro", () => {
  it("aplica el descuento de efectivo configurado por sucursal", async () => {
    const db = {
      query: async () => ({ rows: [{ cashDiscount: 10, debitSurcharge: 0 }] }),
    }
    const result = await calculatePayment(db as never, "branch-id", 1000, {
      paymentMethod: "efectivo",
      installments: 1,
    })
    expect(result.discount).toBe(100)
    expect(result.total).toBe(900)
  })

  it("aplica un recargo de débito sin alterar el subtotal", async () => {
    const db = {
      query: async () => ({ rows: [{ cashDiscount: 0, debitSurcharge: 5 }] }),
    }
    const result = await calculatePayment(db as never, "branch-id", 1000, {
      paymentMethod: "debito",
      installments: 1,
    })
    expect(result.surcharge).toBe(50)
    expect(result.total).toBe(1050)
  })
})
