import { Router } from "express"
import { z } from "zod"
import { audit } from "../audit.js"
import {
  requireAuth,
  requirePermission,
  scopedBranch,
} from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import { AppError } from "../errors.js"
import type { AuthRequest } from "../types.js"

export const productsRouter = Router()
productsRouter.use(requireAuth)

const productSchema = z.object({
  code: z.string().min(2).max(40),
  name: z.string().min(2).max(180),
  category: z.string().min(2).max(80),
  salePrice: z.coerce.number().nonnegative(),
  minStock: z.coerce.number().int().nonnegative(),
  stocks: z.array(
    z.object({
      branchId: z.string().uuid(),
      quantity: z.coerce.number().int().nonnegative(),
    }),
  ),
})

productsRouter.get(
  "/",
  requirePermission("products:read"),
  async (request: AuthRequest, response) => {
    const branchId = scopedBranch(request)
    const search =
      typeof request.query.search === "string"
        ? request.query.search.trim()
        : ""
    const category =
      typeof request.query.category === "string" ? request.query.category : ""
    const result = await pool.query(
      `SELECT p.id, p.code, p.name, c.name AS category, p.sale_price::float AS "salePrice",
            p.min_stock AS "minStock",
            COALESCE(json_agg(json_build_object('branchId', b.id, 'branchName', b.name, 'quantity', bs.quantity)
              ORDER BY b.name) FILTER (WHERE b.id IS NOT NULL), '[]') AS stocks
     FROM products p JOIN categories c ON c.id = p.category_id
     LEFT JOIN branch_stock bs ON bs.product_id = p.id
     LEFT JOIN branches b ON b.id = bs.branch_id
     WHERE p.active = true
       AND ($1 = '' OR lower(p.name) LIKE '%' || lower($1) || '%' OR lower(p.code) LIKE '%' || lower($1) || '%')
       AND ($2 = '' OR c.name = $2)
       AND ($3::uuid IS NULL OR bs.branch_id = $3)
     GROUP BY p.id, c.name ORDER BY p.name`,
      [search, category, branchId],
    )
    response.json({ data: result.rows })
  },
)

productsRouter.post(
  "/",
  requirePermission("products:write"),
  async (request: AuthRequest, response) => {
    const input = productSchema.parse(request.body)
    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      const category = await db.query<{ id: number }>(
        `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
        [input.category],
      )
      const result = await db.query<{ id: string }>(
        `INSERT INTO products (code, name, category_id, sale_price, min_stock)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          input.code,
          input.name,
          category.rows[0]?.id,
          input.salePrice,
          input.minStock,
        ],
      )
      const id = result.rows[0]?.id
      for (const stock of input.stocks) {
        await db.query(
          `INSERT INTO branch_stock (branch_id, product_id, quantity) VALUES ($1, $2, $3)`,
          [stock.branchId, id, stock.quantity],
        )
      }
      await audit(db, request.user!.id, "CREATE", "product", id ?? null)
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

productsRouter.put(
  "/:id",
  requirePermission("products:write"),
  async (request: AuthRequest, response) => {
    const id = z.string().uuid().parse(request.params.id)
    const input = productSchema.parse(request.body)
    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      const category = await db.query<{ id: number }>(
        `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
        [input.category],
      )
      const result = await db.query(
        `UPDATE products SET code=$1,name=$2,category_id=$3,sale_price=$4,min_stock=$5,updated_at=now()
       WHERE id=$6 AND active=true`,
        [
          input.code,
          input.name,
          category.rows[0]?.id,
          input.salePrice,
          input.minStock,
          id,
        ],
      )
      if (!result.rowCount) throw new AppError(404, "Producto no encontrado")
      for (const stock of input.stocks) {
        await db.query(
          `INSERT INTO branch_stock (branch_id,product_id,quantity) VALUES ($1,$2,$3)
         ON CONFLICT (branch_id,product_id) DO UPDATE SET quantity=EXCLUDED.quantity`,
          [stock.branchId, id, stock.quantity],
        )
      }
      await audit(db, request.user!.id, "UPDATE", "product", id)
      await db.query("COMMIT")
      response.json({ id })
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    } finally {
      db.release()
    }
  },
)

productsRouter.delete(
  "/:id",
  requirePermission("products:write"),
  async (request: AuthRequest, response) => {
    const id = z.string().uuid().parse(request.params.id)
    const result = await pool.query(
      `UPDATE products SET active = false, updated_at = now() WHERE id = $1 AND active = true`,
      [id],
    )
    if (!result.rowCount) throw new AppError(404, "Producto no encontrado")
    await audit(pool, request.user!.id, "DELETE", "product", id)
    response.status(204).end()
  },
)
