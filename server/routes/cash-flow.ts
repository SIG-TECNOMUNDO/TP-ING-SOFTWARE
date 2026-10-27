import { Router } from "express"
import { z } from "zod"
import { audit } from "../audit.js"
import { requireAuth, requirePermission, scopedBranch } from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import { recordCashMovement } from "../cash.js"
import type { AuthRequest } from "../types.js"

export const cashFlowRouter = Router()
cashFlowRouter.use(requireAuth, requirePermission("reports:read"))

cashFlowRouter.get("/", async (request: AuthRequest, response) => {
  const branchId = scopedBranch(request)
  const period = z.enum(["daily", "weekly", "monthly", "yearly"]).catch("daily").parse(request.query.period)
  const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).catch(new Date().toISOString().slice(0, 10)).parse(request.query.date)
  const range = period === "daily" ? "date_trunc('day', $2::date)" : period === "weekly" ? "date_trunc('week', $2::date)" : period === "monthly" ? "date_trunc('month', $2::date)" : "date_trunc('year', $2::date)"
  const result = await pool.query(
    `SELECT cm.id,cm.occurred_at AS date,b.name AS branch,cm.source,cm.type,cm.concept,
            cm.payment_method AS "paymentMethod",u.name AS "user",cm.amount::float AS amount
     FROM cash_movements cm
     JOIN branches b ON b.id=cm.branch_id JOIN users u ON u.id=cm.user_id
     WHERE ($1::uuid IS NULL OR cm.branch_id=$1)
       AND cm.occurred_at >= ${range}
       AND cm.occurred_at < ${range} + CASE WHEN $3='daily' THEN interval '1 day' WHEN $3='weekly' THEN interval '1 week' WHEN $3='monthly' THEN interval '1 month' ELSE interval '1 year' END
     ORDER BY cm.occurred_at DESC`,
    [branchId, date, period],
  )
  response.json({ data: result.rows })
})

cashFlowRouter.post("/manual", async (request: AuthRequest, response) => {
  const input = z.object({
    branchId: z.string().uuid(),
    type: z.enum(["INCOME", "EXPENSE"]),
    concept: z.string().min(3).max(240),
    paymentMethod: z.string().min(2).max(60),
    amount: z.coerce.number().positive(),
    note: z.string().max(1000).optional(),
  }).parse(request.body)
  await recordCashMovement(pool, { ...input, source: "MANUAL", userId: request.user!.id })
  await audit(pool, request.user!.id, "CREATE", "cash_movement", null, input)
  response.status(201).json({ ok: true })
})
