import { Router } from "express"
import { z } from "zod"
import { audit } from "../audit.js"
import {
  requireAuth,
  requirePermission,
  scopedBranch,
} from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import {
  canTransition,
  orderStatuses,
  statusLabels,
  type OrderStatus,
} from "../domain/service-order.js"
import { AppError } from "../errors.js"
import type { AuthRequest } from "../types.js"

export const ordersRouter = Router()
ordersRouter.use(requireAuth)

const createSchema = z.object({
  branchId: z.string().uuid(),
  client: z.object({
    name: z.string().min(2),
    dni: z.string().optional(),
    phone: z.string().min(6),
    email: z.union([z.string().email(), z.literal("")]).optional(),
  }),
  deviceType: z.string().min(2),
  brand: z.string().min(1),
  model: z.string().min(1),
  serialImei: z.string().optional(),
  reportedIssue: z.string().min(5),
  physicalCondition: z.string().optional(),
  accessories: z.string().optional(),
})

ordersRouter.get(
  "/",
  requirePermission("orders:read"),
  async (request: AuthRequest, response) => {
    const branchId = scopedBranch(request)
    const search =
      typeof request.query.search === "string"
        ? request.query.search.trim()
        : ""
    const status =
      typeof request.query.status === "string" ? request.query.status : ""
    const result = await pool.query(
      `SELECT so.id, so.number::text, c.name AS client, c.dni,
            concat(so.brand, ' ', so.model) AS device, so.reported_issue AS issue,
            so.status, b.name AS branch, so.created_at AS date
     FROM service_orders so JOIN clients c ON c.id = so.client_id JOIN branches b ON b.id = so.branch_id
     WHERE ($1::uuid IS NULL OR so.branch_id = $1)
       AND ($2 = '' OR lower(c.name) LIKE '%' || lower($2) || '%' OR so.number::text LIKE '%' || $2 || '%' OR lower(so.model) LIKE '%' || lower($2) || '%')
       AND ($3 = '' OR so.status = $3)
     ORDER BY so.created_at DESC`,
      [branchId, search, status],
    )
    response.json({
      data: result.rows.map((row) => ({
        ...row,
        statusLabel: statusLabels[(row.status as OrderStatus)],
      })),
    })
  },
)

ordersRouter.post(
  "/",
  requirePermission("orders:create"),
  async (request: AuthRequest, response) => {
    const input = createSchema.parse(request.body)
    if (
      request.user!.role !== "ADMIN" &&
      request.user!.branchId !== input.branchId
    )
      throw new AppError(403, "No podés crear órdenes en otra sucursal")
    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      let clientId: string | undefined
      if (input.client.dni) {
        const existing = await db.query<{ id: string }>(
          `SELECT id FROM clients WHERE dni = $1`,
          [input.client.dni],
        )
        clientId = existing.rows[0]?.id
      }
      if (!clientId) {
        const created = await db.query<{ id: string }>(
          `INSERT INTO clients (name, dni, phone, email) VALUES ($1, NULLIF($2, ''), $3, NULLIF($4, '')) RETURNING id`,
          [
            input.client.name,
            input.client.dni ?? "",
            input.client.phone,
            input.client.email ?? "",
          ],
        )
        clientId = created.rows[0]?.id
      }
      const created = await db.query<{
        id: string
        number: string
      }>(
        `INSERT INTO service_orders (branch_id, client_id, created_by, device_type, brand, model, serial_imei,
         reported_issue, physical_condition, accessories)
       VALUES ($1,$2,$3,$4,$5,$6,NULLIF($7,''),$8,NULLIF($9,''),NULLIF($10,'')) RETURNING id, number::text`,
        [
          input.branchId,
          clientId,
          request.user!.id,
          input.deviceType,
          input.brand,
          input.model,
          input.serialImei ?? "",
          input.reportedIssue,
          input.physicalCondition ?? "",
          input.accessories ?? "",
        ],
      )
      const order = created.rows[0]!
      await db.query(
        `INSERT INTO service_order_status_history (service_order_id, user_id, to_status, note) VALUES ($1,$2,'INGRESADO',$3)`,
        [order.id, request.user!.id, "Orden creada"],
      )
      await audit(db, request.user!.id, "CREATE", "service_order", order.id)
      await db.query("COMMIT")
      response.status(201).json(order)
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    } finally {
      db.release()
    }
  },
)

ordersRouter.get(
  "/:id",
  requirePermission("orders:read"),
  async (request: AuthRequest, response) => {
    const id = z.string().uuid().parse(request.params.id)
    const branchId = scopedBranch(request)
    const order = await pool.query(
      `SELECT so.*, so.number::text, c.name AS client_name, c.dni, c.phone, c.email,
            b.name AS branch_name
     FROM service_orders so JOIN clients c ON c.id=so.client_id JOIN branches b ON b.id=so.branch_id
     WHERE so.id=$1 AND ($2::uuid IS NULL OR so.branch_id=$2)`,
      [id, branchId],
    )
    if (!order.rows[0]) throw new AppError(404, "Orden no encontrada")
    const history = await pool.query(
      `SELECT h.id, h.from_status, h.to_status, h.note, h.created_at, u.name AS user_name
     FROM service_order_status_history h JOIN users u ON u.id=h.user_id
     WHERE h.service_order_id=$1 ORDER BY h.created_at DESC`,
      [id],
    )
    const parts = await pool.query(
      `SELECT sop.id, p.code, p.name, sop.quantity, sop.unit_price::float AS unit_price
     FROM service_order_parts sop JOIN products p ON p.id=sop.product_id WHERE sop.service_order_id=$1`,
      [id],
    )
    response.json({
      data: {
        ...order.rows[0],
        statusLabel: statusLabels[(order.rows[0].status as OrderStatus)],
        history: history.rows,
        parts: parts.rows,
      },
    })
  },
)

ordersRouter.patch(
  "/:id/status",
  requirePermission("orders:update"),
  async (request: AuthRequest, response) => {
    const id = z.string().uuid().parse(request.params.id)
    const input = z
      .object({
        status: z.enum(orderStatuses),
        note: z.string().max(1000).optional(),
      })
      .parse(request.body)
    const branchId = scopedBranch(request)
    const current = await pool.query<{ status: OrderStatus }>(
      `SELECT status FROM service_orders WHERE id=$1 AND ($2::uuid IS NULL OR branch_id=$2)`,
      [id, branchId],
    )
    const from = current.rows[0]?.status
    if (!from) throw new AppError(404, "Orden no encontrada")
    if (!canTransition(from, input.status))
      throw new AppError(
        409,
        `No se puede pasar de ${statusLabels[from]} a ${statusLabels[input.status]}`,
      )
    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      await db.query(
        `UPDATE service_orders SET status=$1, updated_at=now() WHERE id=$2`,
        [input.status, id],
      )
      await db.query(
        `INSERT INTO service_order_status_history (service_order_id,user_id,from_status,to_status,note) VALUES ($1,$2,$3,$4,$5)`,
        [id, request.user!.id, from, input.status, input.note ?? null],
      )
      await audit(db, request.user!.id, "STATUS_CHANGE", "service_order", id, {
        from,
        to: input.status,
      })
      await db.query("COMMIT")
      response.json({
        status: input.status,
        statusLabel: statusLabels[input.status],
      })
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    } finally {
      db.release()
    }
  },
)

ordersRouter.patch(
  "/:id/diagnosis",
  requirePermission("orders:update"),
  async (request: AuthRequest, response) => {
    const id = z.string().uuid().parse(request.params.id)
    const input = z
      .object({
        diagnosis: z.string().max(5000),
        laborCost: z.coerce.number().nonnegative(),
      })
      .parse(request.body)
    const branchId = scopedBranch(request)
    const result = await pool.query(
      `UPDATE service_orders SET diagnosis=$1,labor_cost=$2,updated_at=now()
     WHERE id=$3 AND ($4::uuid IS NULL OR branch_id=$4)`,
      [input.diagnosis, input.laborCost, id, branchId],
    )
    if (!result.rowCount) throw new AppError(404, "Orden no encontrada")
    await audit(pool, request.user!.id, "DIAGNOSIS_UPDATE", "service_order", id)
    response.json({ id })
  },
)

ordersRouter.post(
  "/:id/parts",
  requirePermission("orders:update"),
  async (request: AuthRequest, response) => {
    const id = z.string().uuid().parse(request.params.id)
    const input = z
      .object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
      .parse(request.body)
    const branchId = scopedBranch(request)
    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      const order = await db.query<{ branchId: string }>(
        `SELECT branch_id AS "branchId" FROM service_orders WHERE id=$1 AND ($2::uuid IS NULL OR branch_id=$2)`,
        [id, branchId],
      )
      const orderBranch = order.rows[0]?.branchId
      if (!orderBranch) throw new AppError(404, "Orden no encontrada")
      const stock = await db.query<{
        quantity: number
        salePrice: number
      }>(
        `SELECT bs.quantity,p.sale_price::float AS "salePrice" FROM branch_stock bs JOIN products p ON p.id=bs.product_id
       WHERE bs.branch_id=$1 AND bs.product_id=$2 FOR UPDATE OF bs`,
        [orderBranch, input.productId],
      )
      const current = stock.rows[0]
      if (!current || current.quantity < input.quantity)
        throw new AppError(409, "Stock insuficiente para asignar el repuesto")
      await db.query(
        `INSERT INTO service_order_parts (service_order_id,product_id,quantity,unit_price) VALUES ($1,$2,$3,$4)
       ON CONFLICT (service_order_id,product_id) DO UPDATE
       SET quantity=service_order_parts.quantity+EXCLUDED.quantity,unit_price=EXCLUDED.unit_price`,
        [id, input.productId, input.quantity, current.salePrice],
      )
      await db.query(
        `UPDATE branch_stock SET quantity=quantity-$1 WHERE branch_id=$2 AND product_id=$3`,
        [input.quantity, orderBranch, input.productId],
      )
      await db.query(
        `INSERT INTO stock_movements (branch_id,product_id,user_id,type,quantity,reference_type,reference_id) VALUES ($1,$2,$3,'SERVICE',$4,'service_order',$5)`,
        [orderBranch, input.productId, request.user!.id, -input.quantity, id],
      )
      await audit(db, request.user!.id, "ADD_PART", "service_order", id, input)
      await db.query("COMMIT")
      response.status(201).json({ id })
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    } finally {
      db.release()
    }
  },
)

ordersRouter.post(
  "/:id/payment",
  requirePermission("orders:update"),
  async (request: AuthRequest, response) => {
    const id = z.string().uuid().parse(request.params.id)
    const input = z
      .object({
        method: z.string().min(2),
        installments: z.number().int().positive().default(1),
      })
      .parse(request.body)
    const branchId = scopedBranch(request)
    const total = await pool.query<{ amount: number }>(
      `SELECT (so.labor_cost + COALESCE(sum(sop.quantity*sop.unit_price),0))::float AS amount
     FROM service_orders so LEFT JOIN service_order_parts sop ON sop.service_order_id=so.id
     WHERE so.id=$1 AND ($2::uuid IS NULL OR so.branch_id=$2) GROUP BY so.id`,
      [id, branchId],
    )
    if (!total.rows[0]) throw new AppError(404, "Orden no encontrada")
    await pool.query(
      `INSERT INTO payments (service_order_id,method,amount,installments) VALUES ($1,$2,$3,$4)`,
      [id, input.method, total.rows[0].amount, input.installments],
    )
    await audit(pool, request.user!.id, "PAYMENT", "service_order", id, {
      amount: total.rows[0].amount,
    })
    response.status(201).json(total.rows[0])
  },
)
