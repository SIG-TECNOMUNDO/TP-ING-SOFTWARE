import request from "supertest"
import { afterAll, describe, expect, it } from "vitest"
import { app } from "./app.js"
import { pool } from "./database/pool.js"

const databaseTest =
  process.env.RUN_DB_TESTS === "true" ? describe : describe.skip

databaseTest("API con PostgreSQL", () => {
  const agent = request.agent(app)

  it("inicia sesión y consulta módulos principales", async () => {
    const login = await agent
      .post("/api/auth/login")
      .send({ email: "admin@tecnomundo.com", password: "admin" })
    expect(login.status).toBe(200)
    expect(login.body.user.role).toBe("ADMIN")

    const [products, orders, dashboard] = await Promise.all([
      agent.get("/api/products"),
      agent.get("/api/orders"),
      agent.get("/api/dashboard"),
    ])
    expect(products.status).toBe(200)
    expect(products.body.data.length).toBeGreaterThan(0)
    expect(orders.status).toBe(200)
    expect(orders.body.data.length).toBeGreaterThan(0)
    expect(dashboard.status).toBe(200)
  })

  it("registra una venta y descuenta stock de forma transaccional", async () => {
    await agent
      .post("/api/auth/login")
      .send({ email: "admin@tecnomundo.com", password: "admin" })
    const branches = await agent.get("/api/branches")
    const branchId = branches.body.data[0].id as string
    const beforeResponse = await agent.get(`/api/products?branchId=${branchId}`)
    const product = beforeResponse.body.data.find(
      (item: { stocks: { quantity: number }[] }) =>
        (item.stocks[0]?.quantity ?? 0) > 0,
    )
    const before = product.stocks[0].quantity as number
    const sale = await agent.post("/api/sales").send({
      branchId,
      paymentMethod: "efectivo",
      installments: 1,
      items: [{ productId: product.id, quantity: 1 }],
    })
    expect(sale.status).toBe(201)

    const afterResponse = await agent.get(`/api/products?branchId=${branchId}`)
    const afterProduct = afterResponse.body.data.find(
      (item: { id: string }) => item.id === product.id,
    )
    expect(afterProduct.stocks[0].quantity).toBe(before - 1)

    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      await db.query(`DELETE FROM payments WHERE sale_id=$1`, [sale.body.id])
      await db.query(`DELETE FROM sale_items WHERE sale_id=$1`, [sale.body.id])
      await db.query(
        `DELETE FROM stock_movements WHERE reference_type='sale' AND reference_id=$1`,
        [sale.body.id],
      )
      await db.query(
        `UPDATE branch_stock SET quantity=quantity+1 WHERE branch_id=$1 AND product_id=$2`,
        [branchId, product.id],
      )
      await db.query(
        `DELETE FROM audit_logs WHERE entity_type='sale' AND entity_id=$1`,
        [sale.body.id],
      )
      await db.query(`DELETE FROM sales WHERE id=$1`, [sale.body.id])
      await db.query("COMMIT")
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    } finally {
      db.release()
    }
  })

  afterAll(async () => pool.end())
})
