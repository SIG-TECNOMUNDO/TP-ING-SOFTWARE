import { Router } from "express"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { audit } from "../audit.js"
import { requireAuth, requirePermission } from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import { AppError } from "../errors.js"
import type { AuthRequest } from "../types.js"

export const usersRouter = Router()
usersRouter.use(requireAuth, requirePermission("users:manage"))

usersRouter.get("/", async (_request, response) => {
  const result = await pool.query(
    `SELECT u.id,u.name,u.email,r.code AS role,r.name AS "roleName",u.branch_id AS "branchId",
            COALESCE(b.name,'Todas') AS branch,u.active
     FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN branches b ON b.id=u.branch_id ORDER BY u.name`,
  )
  response.json({ data: result.rows })
})

usersRouter.post("/", async (request: AuthRequest, response) => {
  const input = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(["ADMIN", "SALES", "TECH"]),
      branchId: z.string().uuid().nullable(),
    })
    .parse(request.body)
  if (input.role !== "ADMIN" && !input.branchId)
    throw new AppError(400, "El usuario debe tener una sucursal")
  const passwordHash = await bcrypt.hash(input.password, 12)
  const result = await pool.query<{ id: string }>(
    `INSERT INTO users (name,email,password_hash,role_id,branch_id)
     SELECT $1,$2,$3,id,$5 FROM roles WHERE code=$4 RETURNING users.id`,
    [input.name, input.email, passwordHash, input.role, input.branchId],
  )
  const id = result.rows[0]?.id
  await audit(pool, request.user!.id, "CREATE", "user", id ?? null)
  response.status(201).json({ id })
})

usersRouter.delete("/:id", async (request: AuthRequest, response) => {
  const id = z.string().uuid().parse(request.params.id)
  if (id === request.user!.id)
    throw new AppError(409, "No podés desactivar tu propio usuario")
  const result = await pool.query(
    `UPDATE users SET active=false,updated_at=now() WHERE id=$1 AND active=true`,
    [id],
  )
  if (!result.rowCount) throw new AppError(404, "Usuario no encontrado")
  await audit(pool, request.user!.id, "DEACTIVATE", "user", id)
  response.status(204).end()
})
