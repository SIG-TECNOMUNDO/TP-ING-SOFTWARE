import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { pool } from "../database/pool.js"
import { env } from "../config.js"
import { AppError } from "../errors.js"
import { COOKIE_NAME, requireAuth } from "../auth/middleware.js"
import type { AuthRequest, SessionUser } from "../types.js"

export const authRouter = Router()

authRouter.post("/login", async (request, response) => {
  const credentials = z
    .object({ email: z.string().email(), password: z.string().min(1) })
    .parse(request.body)
  const result = await pool.query<SessionUser & { passwordHash: string }>(
    `SELECT u.id, u.name, u.email, u.password_hash AS "passwordHash", r.code AS role,
            u.branch_id AS "branchId", b.name AS "branchName"
     FROM users u JOIN roles r ON r.id = u.role_id
     LEFT JOIN branches b ON b.id = u.branch_id
     WHERE lower(u.email) = lower($1) AND u.active = true`,
    [credentials.email],
  )
  const account = result.rows[0]
  if (
    !account ||
    !(await bcrypt.compare(credentials.password, account.passwordHash))
  ) {
    throw new AppError(401, "Correo o contraseña incorrectos")
  }
  const { passwordHash: _passwordHash, ...user } = account
  const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: "8h" })
  response.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  })
  response.json({ user })
})

authRouter.post("/logout", (_request, response) => {
  response.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax" })
  response.status(204).end()
})

authRouter.get("/me", requireAuth, (request: AuthRequest, response) => {
  response.json({ user: request.user })
})
