import { Router } from "express"
import { requireAuth } from "../auth/middleware.js"
import { pool } from "../database/pool.js"

export const branchesRouter = Router()
branchesRouter.use(requireAuth)

branchesRouter.get("/", async (_request, response) => {
  const result = await pool.query(
    `SELECT id, name, address FROM branches WHERE active = true ORDER BY name`,
  )
  response.json({ data: result.rows })
})
