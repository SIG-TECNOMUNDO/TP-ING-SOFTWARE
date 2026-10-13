import { Router } from "express"
import { z } from "zod"
import { audit } from "../audit.js"
import { requireAuth, requirePermission } from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import type { AuthRequest } from "../types.js"

export const clientsRouter = Router()
clientsRouter.use(requireAuth)

const clientSchema = z.object({
  name: z.string().min(2).max(140),
  dni: z.string().max(20).optional().nullable(),
  phone: z.string().min(6).max(40),
  email: z
    .union([z.string().email(), z.literal("")])
    .optional()
    .nullable(),
})

clientsRouter.get(
  "/",
  requirePermission("clients:read"),
  async (request, response) => {
    const search =
      typeof request.query.search === "string"
        ? request.query.search.trim()
        : ""
    const result = await pool.query(
      `SELECT c.id, c.name, c.dni, c.phone, c.email,
            count(DISTINCT so.id)::int AS orders,
            COALESCE(sum(DISTINCT s.total), 0)::float AS "totalSpent",
            max(GREATEST(COALESCE(so.created_at, '-infinity'), COALESCE(s.created_at, '-infinity'))) AS "lastVisit"
     FROM clients c LEFT JOIN service_orders so ON so.client_id = c.id LEFT JOIN sales s ON s.client_id = c.id
     WHERE $1 = '' OR lower(c.name) LIKE '%' || lower($1) || '%' OR c.dni LIKE '%' || $1 || '%' OR c.phone LIKE '%' || $1 || '%'
     GROUP BY c.id ORDER BY c.name`,
      [search],
    )
    response.json({ data: result.rows })
  },
)

clientsRouter.post(
  "/",
  requirePermission("clients:write"),
  async (request: AuthRequest, response) => {
    const input = clientSchema.parse(request.body)
    const result = await pool.query<{ id: string }>(
      `INSERT INTO clients (name, dni, phone, email) VALUES ($1, NULLIF($2, ''), $3, NULLIF($4, '')) RETURNING id`,
      [input.name, input.dni ?? "", input.phone, input.email ?? ""],
    )
    const id = result.rows[0]?.id
    await audit(pool, request.user!.id, "CREATE", "client", id ?? null)
    response.status(201).json({ id })
  },
)
