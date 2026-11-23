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
      (item: { tracksImei: boolean; stocks: { quantity: number }[] }) =>
        !item.tracksImei && (item.stocks[0]?.quantity ?? 0) > 0,
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

  it("controla el stock de celulares por IMEI y oculta el costo", async () => {
    await agent
      .post("/api/auth/login")
      .send({ email: "admin@tecnomundo.com", password: "admin" })
    const branches = await agent.get("/api/branches")
    const branchId = branches.body.data[0].id as string
    const suffix = String(Date.now()).slice(-9)
    const imeis = [`351${suffix}001`, `351${suffix}002`]
    const created = await agent.post("/api/products").send({
      code: `CEL-${suffix}`,
      name: `Celular de prueba ${suffix}`,
      category: "Equipos",
      salePrice: 100000,
      costPrice: 60000,
      minStock: 1,
      tracksImei: true,
      stocks: [],
      units: imeis.map((imei) => ({ branchId, imei })),
    })
    expect(created.status).toBe(201)
    const productId = created.body.id as string

    const list = await agent.get(`/api/products?branchId=${branchId}`)
    const product = list.body.data.find(
      (item: { id: string }) => item.id === productId,
    )
    expect(product.costPrice).toBe(60000)
    expect(product.stocks[0].quantity).toBe(2)
    expect(product.availableUnits).toHaveLength(2)

    const sale = (items: unknown[]) =>
      agent
        .post("/api/sales")
        .send({ branchId, paymentMethod: "efectivo", installments: 1, items })
    expect((await sale([{ productId, quantity: 1 }])).status).toBe(400)
    expect(
      (await sale([{ productId, quantity: 1, imeis: ["999999999999999"] }]))
        .status,
    ).toBe(409)
    const ok = await sale([{ productId, quantity: 1, imeis: [imeis[0]] }])
    expect(ok.status).toBe(201)
    expect(
      (await sale([{ productId, quantity: 1, imeis: [imeis[0]] }])).status,
    ).toBe(409)

    const warranty = await agent.get(`/api/sales/warranty/${imeis[0]}`)
    expect(warranty.status).toBe(200)
    expect(warranty.body.warrantyActive).toBe(true)

    const seller = request.agent(app)
    await seller
      .post("/api/auth/login")
      .send({ email: "ventas.yofre@tecnomundo.com", password: "admin" })
    const sellerList = await seller.get("/api/products")
    expect(sellerList.status).toBe(200)
    for (const item of sellerList.body.data)
      expect(item).not.toHaveProperty("costPrice")

    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      const saleId = ok.body.id as string
      await db.query(`DELETE FROM device_units WHERE product_id=$1`, [productId])
      await db.query(`DELETE FROM payments WHERE sale_id=$1`, [saleId])
      await db.query(`DELETE FROM sale_items WHERE sale_id=$1`, [saleId])
      await db.query(`DELETE FROM cash_movements WHERE reference_id=$1`, [saleId])
      await db.query(`DELETE FROM stock_movements WHERE product_id=$1`, [productId])
      await db.query(`DELETE FROM audit_logs WHERE entity_id = ANY($1)`, [
        [saleId, productId],
      ])
      await db.query(`DELETE FROM sales WHERE id=$1`, [saleId])
      await db.query(`DELETE FROM branch_stock WHERE product_id=$1`, [productId])
      await db.query(`DELETE FROM products WHERE id=$1`, [productId])
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
