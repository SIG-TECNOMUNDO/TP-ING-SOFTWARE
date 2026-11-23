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
import {
  canSeeCostPrice,
  stripCostPrice,
} from "../domain/product-visibility.js"
import { imeiListError, normalizeImei } from "../domain/imei.js"
import type { AuthRequest } from "../types.js"

export const productsRouter = Router()
productsRouter.use(requireAuth)

const productSchema = z.object({
  code: z.string().min(2).max(40),
  name: z.string().min(2).max(180),
  category: z.string().min(2).max(80),
  salePrice: z.coerce.number().nonnegative(),
  costPrice: z.coerce.number().nonnegative().nullable().optional(),
  minStock: z.coerce.number().int().nonnegative(),
  stocks: z.array(
    z.object({
      branchId: z.string().uuid(),
      quantity: z.coerce.number().int().nonnegative(),
    }),
  ),
  /** Celulares: el stock se lleva por IMEI, una unidad por IMEI. */
  tracksImei: z.boolean().default(false),
  units: z
    .array(z.object({ branchId: z.string().uuid(), imei: z.string().max(30) }))
    .default([]),
})

type Db = Pick<import("pg").PoolClient, "query">

/**
 * Sincroniza las unidades disponibles (IMEI) de un celular y recalcula su
 * stock por sucursal a partir de ellas. Las unidades vendidas no se tocan.
 */
async function syncDeviceUnits(
  db: Db,
  productId: string,
  units: { branchId: string; imei: string }[],
) {
  const normalized = units.map((unit) => ({
    branchId: unit.branchId,
    imei: normalizeImei(unit.imei),
  }))
  const error = imeiListError(normalized.map((unit) => unit.imei))
  if (error) throw new AppError(400, error)
  const imeis = normalized.map((unit) => unit.imei)
  const conflict = await db.query<{ imei: string }>(
    `SELECT imei FROM device_units
     WHERE imei = ANY($1::text[]) AND (product_id <> $2 OR status <> 'AVAILABLE') LIMIT 1`,
    [imeis, productId],
  )
  if (conflict.rowCount)
    throw new AppError(
      409,
      `El IMEI ${conflict.rows[0]!.imei} ya está cargado en otro producto o fue vendido`,
    )
  await db.query(
    `DELETE FROM device_units WHERE product_id=$1 AND status='AVAILABLE' AND NOT (imei = ANY($2::text[]))`,
    [productId, imeis],
  )
  for (const unit of normalized) {
    await db.query(
      `INSERT INTO device_units (product_id, branch_id, imei) VALUES ($1, $2, $3)
       ON CONFLICT (imei) DO UPDATE SET branch_id = EXCLUDED.branch_id`,
      [productId, unit.branchId, unit.imei],
    )
  }
  await db.query(
    `INSERT INTO branch_stock (branch_id, product_id, quantity)
     SELECT b.id, $1, COUNT(du.id) FROM branches b
     LEFT JOIN device_units du ON du.branch_id = b.id AND du.product_id = $1 AND du.status = 'AVAILABLE'
     GROUP BY b.id
     ON CONFLICT (branch_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
    [productId],
  )
}

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
            p.cost_price::float AS "costPrice", p.min_stock AS "minStock",
            p.tracks_imei AS "tracksImei",
            (SELECT COALESCE(json_agg(json_build_object('imei', du.imei, 'branchId', du.branch_id) ORDER BY du.imei), '[]')
               FROM device_units du
              WHERE du.product_id = p.id AND du.status = 'AVAILABLE'
                AND ($3::uuid IS NULL OR du.branch_id = $3)) AS "availableUnits",
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
    response.json({ data: stripCostPrice(result.rows, request.user!.role) })
  },
)

productsRouter.patch(
  "/bulk-price",
  requirePermission("products:write"),
  async (request: AuthRequest, response) => {
    const input = z
      .object({
        category: z.string().min(1).nullable().optional(),
        percentage: z.coerce.number().positive().max(1000),
      })
      .parse(request.body)
    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      const result = await db.query<{ id: string }>(
        `UPDATE products p SET sale_price=ROUND(p.sale_price * (1 + $1 / 100), 2), updated_at=now()
         FROM categories c WHERE c.id=p.category_id AND p.active=true AND ($2::text IS NULL OR c.name=$2)
         RETURNING p.id`,
        [input.percentage, input.category ?? null],
      )
      await audit(db, request.user!.id, "BULK_PRICE_UPDATE", "product", null, {
        category: input.category ?? "all",
        percentage: input.percentage,
        affected: result.rowCount ?? 0,
      })
      await db.query("COMMIT")
      response.json({ affected: result.rowCount ?? 0 })
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    } finally {
      db.release()
    }
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
        `INSERT INTO products (code, name, category_id, sale_price, min_stock, cost_price, tracks_imei)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          input.code,
          input.name,
          category.rows[0]?.id,
          input.salePrice,
          input.minStock,
          canSeeCostPrice(request.user!.role) ? (input.costPrice ?? null) : null,
          input.tracksImei,
        ],
      )
      const id = result.rows[0]!.id
      if (input.tracksImei) {
        await syncDeviceUnits(db, id, input.units)
      } else {
        for (const stock of input.stocks) {
          await db.query(
            `INSERT INTO branch_stock (branch_id, product_id, quantity) VALUES ($1, $2, $3)`,
            [stock.branchId, id, stock.quantity],
          )
        }
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
        `UPDATE products SET code=$1,name=$2,category_id=$3,sale_price=$4,min_stock=$5,
         cost_price=CASE WHEN $7::boolean THEN $8::numeric ELSE cost_price END,tracks_imei=$9,updated_at=now()
       WHERE id=$6 AND active=true`,
        [
          input.code,
          input.name,
          category.rows[0]?.id,
          input.salePrice,
          input.minStock,
          id,
          canSeeCostPrice(request.user!.role) && input.costPrice !== undefined,
          input.costPrice ?? null,
          input.tracksImei,
        ],
      )
      if (!result.rowCount) throw new AppError(404, "Producto no encontrado")
      if (input.tracksImei) {
        await syncDeviceUnits(db, id, input.units)
      } else {
        for (const stock of input.stocks) {
          await db.query(
            `INSERT INTO branch_stock (branch_id,product_id,quantity) VALUES ($1,$2,$3)
           ON CONFLICT (branch_id,product_id) DO UPDATE SET quantity=EXCLUDED.quantity`,
            [stock.branchId, id, stock.quantity],
          )
        }
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
