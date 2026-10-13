import { Router } from "express"
import {
  requireAuth,
  requirePermission,
  scopedBranch,
} from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import { statusLabels, type OrderStatus } from "../domain/service-order.js"
import type { AuthRequest } from "../types.js"

export const dashboardRouter = Router()
dashboardRouter.use(requireAuth, requirePermission("dashboard:read"))

dashboardRouter.get("/", async (request: AuthRequest, response) => {
  const branchId = scopedBranch(request)
  const [stats, orders, alerts] = await Promise.all([
    pool.query(
      `SELECT
        COALESCE((SELECT sum(total)::float FROM sales WHERE created_at::date=current_date AND ($1::uuid IS NULL OR branch_id=$1)),0) AS "todaySales",
        (SELECT count(*)::int FROM service_orders WHERE status NOT IN ('ENTREGADO','SIN_SOLUCION') AND ($1::uuid IS NULL OR branch_id=$1)) AS "pendingOrders",
        (SELECT count(*)::int FROM service_orders WHERE status='LISTO_ENTREGA' AND ($1::uuid IS NULL OR branch_id=$1)) AS "readyOrders",
        (SELECT count(*)::int FROM products p WHERE p.active AND
          (SELECT COALESCE(sum(quantity),0) FROM branch_stock bs WHERE bs.product_id=p.id AND ($1::uuid IS NULL OR bs.branch_id=$1)) <= p.min_stock) AS "stockAlerts"`,
      [branchId],
    ),
    pool.query(
      `SELECT so.id,so.number::text,c.name AS client,concat(so.brand,' ',so.model) AS device,so.status,so.created_at AS date
       FROM service_orders so JOIN clients c ON c.id=so.client_id
       WHERE ($1::uuid IS NULL OR so.branch_id=$1) ORDER BY so.created_at DESC LIMIT 5`,
      [branchId],
    ),
    pool.query(
      `SELECT p.id,p.name,p.min_stock AS "minStock",COALESCE(sum(bs.quantity),0)::int AS stock
       FROM products p JOIN branch_stock bs ON bs.product_id=p.id
       WHERE p.active AND ($1::uuid IS NULL OR bs.branch_id=$1)
       GROUP BY p.id HAVING COALESCE(sum(bs.quantity),0)<=p.min_stock ORDER BY stock LIMIT 5`,
      [branchId],
    ),
  ])
  response.json({
    stats: stats.rows[0],
    recentOrders: orders.rows.map((row) => ({
      ...row,
      statusLabel: statusLabels[(row.status as OrderStatus)],
    })),
    stockAlerts: alerts.rows,
  })
})
