import { Router } from "express"
import {
  requireAuth,
  requirePermission,
  scopedBranch,
} from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import type { AuthRequest } from "../types.js"

export const reportsRouter = Router()
reportsRouter.use(requireAuth, requirePermission("reports:read"))

const csvCell = (value: unknown) =>
  `"${String(value ?? "").replaceAll('"', '""')}"`

reportsRouter.get("/sales.csv", async (request: AuthRequest, response) => {
  const branchId = scopedBranch(request)
  const result = await pool.query(
    `SELECT s.number,b.name AS sucursal,u.name AS usuario,s.payment_method,s.subtotal,s.discount,s.total,s.created_at
     FROM sales s JOIN branches b ON b.id=s.branch_id JOIN users u ON u.id=s.user_id
     WHERE ($1::uuid IS NULL OR s.branch_id=$1) ORDER BY s.created_at DESC`,
    [branchId],
  )
  const headers = [
    "Número",
    "Sucursal",
    "Usuario",
    "Medio de pago",
    "Subtotal",
    "Descuento",
    "Total",
    "Fecha",
  ]
  const rows = result.rows.map((row) =>
    Object.values(row).map(csvCell).join(","),
  )
  response.setHeader("Content-Type", "text/csv; charset=utf-8")
  response.setHeader("Content-Disposition", "attachment; filename=ventas.csv")
  response.send(`\uFEFF${headers.map(csvCell).join(",")}\n${rows.join("\n")}`)
})

reportsRouter.get(
  "/cash-closing.csv",
  async (request: AuthRequest, response) => {
    const branchId = scopedBranch(request)
    const result = await pool.query(
      `SELECT b.name AS sucursal,s.payment_method AS medio_pago,count(*)::int AS operaciones,
            sum(s.subtotal)::float AS subtotal,sum(s.discount)::float AS descuentos,sum(s.total)::float AS total
     FROM sales s JOIN branches b ON b.id=s.branch_id
     WHERE s.created_at::date=current_date AND ($1::uuid IS NULL OR s.branch_id=$1)
     GROUP BY b.name,s.payment_method ORDER BY b.name,s.payment_method`,
      [branchId],
    )
    sendCsv(
      response,
      "cierre-diario.csv",
      [
        "Sucursal",
        "Medio de pago",
        "Operaciones",
        "Subtotal",
        "Descuentos",
        "Total",
      ],
      result.rows,
    )
  },
)

reportsRouter.get(
  "/technicians.csv",
  async (request: AuthRequest, response) => {
    const branchId = scopedBranch(request)
    const result = await pool.query(
      `SELECT u.name AS tecnico,COALESCE(b.name,'Todas') AS sucursal,
            count(DISTINCT h.service_order_id)::int AS ordenes_intervenidas,
            count(DISTINCT h.service_order_id) FILTER (WHERE h.to_status IN ('LISTO_ENTREGA','ENTREGADO'))::int AS completadas
     FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN branches b ON b.id=u.branch_id
     LEFT JOIN service_order_status_history h ON h.user_id=u.id
     WHERE r.code='TECH' AND ($1::uuid IS NULL OR u.branch_id=$1)
     GROUP BY u.id,b.name ORDER BY completadas DESC`,
      [branchId],
    )
    sendCsv(
      response,
      "rendimiento-tecnicos.csv",
      ["Técnico", "Sucursal", "Órdenes intervenidas", "Completadas"],
      result.rows,
    )
  },
)

reportsRouter.get(
  "/top-products.csv",
  async (request: AuthRequest, response) => {
    const branchId = scopedBranch(request)
    const result = await pool.query(
      `SELECT p.code,p.name,COALESCE(sum(si.quantity),0)::int AS unidades,
            COALESCE(sum(si.subtotal),0)::float AS facturacion
     FROM products p LEFT JOIN sale_items si ON si.product_id=p.id LEFT JOIN sales s ON s.id=si.sale_id
     WHERE $1::uuid IS NULL OR s.branch_id=$1 GROUP BY p.id ORDER BY unidades DESC,p.name`,
      [branchId],
    )
    sendCsv(
      response,
      "productos-mas-vendidos.csv",
      ["Código", "Producto", "Unidades", "Facturación"],
      result.rows,
    )
  },
)

reportsRouter.get("/export.json", async (_request, response) => {
  const [
    branches,
    users,
    clients,
    products,
    stocks,
    orders,
    history,
    parts,
    sales,
    items,
    payments,
    movements,
  ] = await Promise.all([
    pool.query(`SELECT * FROM branches`),
    pool.query(
      `SELECT u.id,u.name,u.email,r.code AS role,u.branch_id,u.active,u.created_at FROM users u JOIN roles r ON r.id=u.role_id`,
    ),
    pool.query(`SELECT * FROM clients`),
    pool.query(`SELECT * FROM products`),
    pool.query(`SELECT * FROM branch_stock`),
    pool.query(`SELECT * FROM service_orders`),
    pool.query(`SELECT * FROM service_order_status_history`),
    pool.query(`SELECT * FROM service_order_parts`),
    pool.query(`SELECT * FROM sales`),
    pool.query(`SELECT * FROM sale_items`),
    pool.query(`SELECT * FROM payments`),
    pool.query(`SELECT * FROM stock_movements`),
  ])
  response.setHeader(
    "Content-Disposition",
    "attachment; filename=sig-tecnomundo-export.json",
  )
  response.json({
    exportedAt: new Date().toISOString(),
    branches: branches.rows,
    users: users.rows,
    clients: clients.rows,
    products: products.rows,
    stocks: stocks.rows,
    serviceOrders: orders.rows,
    serviceOrderHistory: history.rows,
    serviceOrderParts: parts.rows,
    sales: sales.rows,
    saleItems: items.rows,
    payments: payments.rows,
    stockMovements: movements.rows,
  })
})

function sendCsv(
  response: import("express").Response,
  filename: string,
  headers: string[],
  rows: Record<string, unknown>[],
) {
  response.setHeader("Content-Type", "text/csv; charset=utf-8")
  response.setHeader("Content-Disposition", `attachment; filename=${filename}`)
  response.send(
    `\uFEFF${headers.map(csvCell).join(",")}\n${rows.map((row) => Object.values(row).map(csvCell).join(",")).join("\n")}`,
  )
}
