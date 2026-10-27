import { Router } from "express"
import { z } from "zod"
import { audit } from "../audit.js"
import { requireAuth, requirePermission } from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import { AppError } from "../errors.js"
import { calculatePayment } from "../domain/payment.js"
import { recordCashMovement } from "../cash.js"
import type { AuthRequest } from "../types.js"

export const salesRouter = Router()
salesRouter.use(requireAuth)

const saleSchema = z.object({
  branchId: z.string().uuid(),
  clientId: z.string().uuid().nullable().optional(),
  paymentMethod: z.enum([
    "efectivo",
    "debito",
    "credito",
    "transferencia",
    "mercadolibre",
  ]),
  installments: z.coerce.number().int().min(1).max(24).default(1),
  cardBrand: z.string().max(50).optional(),
  cardType: z.string().max(30).optional(),
  wallet: z.string().max(60).optional(),
  marketplace: z.object({
    operationNumber: z.string().min(3).max(80),
    buyerUsername: z.string().min(2).max(100),
    shippingType: z.enum(["colecta", "sucursal"]),
  }).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
})

salesRouter.post(
  "/",
  requirePermission("sales:create"),
  async (request: AuthRequest, response) => {
    const input = saleSchema.parse(request.body)
    if (
      request.user!.role !== "ADMIN" &&
      request.user!.branchId !== input.branchId
    )
      throw new AppError(403, "No podés vender en otra sucursal")
    const db = await pool.connect()
    try {
      await db.query("BEGIN")
      let subtotal = 0
      const pricedItems: {
        productId: string
        quantity: number
        price: number
      }[] = []
      for (const item of input.items) {
        const product = await db.query<{
          salePrice: number
          quantity: number
        }>(
          `SELECT p.sale_price::float AS "salePrice", bs.quantity FROM products p
         JOIN branch_stock bs ON bs.product_id=p.id AND bs.branch_id=$2
         WHERE p.id=$1 AND p.active=true FOR UPDATE OF bs`,
          [item.productId, input.branchId],
        )
        const found = product.rows[0]
        if (!found)
          throw new AppError(
            404,
            "Uno de los productos no existe en la sucursal",
          )
        if (found.quantity < item.quantity)
          throw new AppError(409, "Stock insuficiente para completar la venta")
        subtotal += found.salePrice * item.quantity
        pricedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: found.salePrice,
        })
      }
      if (input.paymentMethod === "mercadolibre" && !input.marketplace)
        throw new AppError(400, "Completá los datos de la operación de Mercado Libre")
      const pricing = await calculatePayment(db, input.branchId, subtotal, input)
      const saleResult = await db.query<{
        id: string
        number: string
      }>(
        `INSERT INTO sales (branch_id,client_id,user_id,payment_method,subtotal,discount,total,card_brand,card_type,wallet,channel,marketplace_operation,marketplace_buyer,marketplace_shipping)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id,number::text`,
        [
          input.branchId,
          input.clientId ?? null,
          request.user!.id,
          input.paymentMethod,
          subtotal,
          pricing.discount,
          pricing.total,
          input.cardBrand ?? null,
          input.cardType ?? null,
          input.wallet ?? null,
          input.marketplace ? "MARKETPLACE" : "STORE",
          input.marketplace?.operationNumber ?? null,
          input.marketplace?.buyerUsername ?? null,
          input.marketplace?.shippingType ?? null,
        ],
      )
      const sale = saleResult.rows[0]!
      for (const item of pricedItems) {
        await db.query(
          `INSERT INTO sale_items (sale_id,product_id,quantity,unit_price,subtotal) VALUES ($1,$2,$3,$4,$5)`,
          [
            sale.id,
            item.productId,
            item.quantity,
            item.price,
            item.price * item.quantity,
          ],
        )
        await db.query(
          `UPDATE branch_stock SET quantity=quantity-$1 WHERE branch_id=$2 AND product_id=$3`,
          [item.quantity, input.branchId, item.productId],
        )
        await db.query(
          `INSERT INTO stock_movements (branch_id,product_id,user_id,type,quantity,reference_type,reference_id) VALUES ($1,$2,$3,'SALE',$4,'sale',$5)`,
          [
            input.branchId,
            item.productId,
            request.user!.id,
            -item.quantity,
            sale.id,
          ],
        )
      }
      await db.query(
        `INSERT INTO payments (sale_id,method,amount,installments) VALUES ($1,$2,$3,$4)`,
        [sale.id, input.paymentMethod, pricing.total, input.installments],
      )
      await recordCashMovement(db, {
        branchId: input.branchId,
        source: "VENTAS",
        type: "INCOME",
        concept: `Venta de mostrador #${sale.number}`,
        paymentMethod: input.paymentMethod,
        userId: request.user!.id,
        amount: pricing.total,
        referenceType: "sale",
        referenceId: sale.id,
      })
      await audit(db, request.user!.id, "CREATE", "sale", sale.id, { total: pricing.total, adjustmentPercent: pricing.adjustmentPercent })
      await db.query("COMMIT")
      response.status(201).json({ ...sale, subtotal, ...pricing })
    } catch (error) {
      await db.query("ROLLBACK")
      throw error
    } finally {
      db.release()
    }
  },
)
