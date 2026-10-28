import { Router } from "express"
import { z } from "zod"
import { audit } from "../audit.js"
import { requireAuth, requirePermission } from "../auth/middleware.js"
import { pool } from "../database/pool.js"
import type { AuthRequest } from "../types.js"

export const paymentRulesRouter = Router()
paymentRulesRouter.use(requireAuth, requirePermission("users:manage"))

const cardRule = z.object({
  brand: z.string().min(1).max(50),
  cardType: z.string().min(1).max(30),
  installments: z.coerce.number().int().min(1).max(24),
  surcharge: z.coerce.number().min(0).max(100),
})
const promotion = z.object({
  weekday: z.coerce.number().int().min(0).max(6),
  cardBrand: z.string().min(1).max(50),
  installments: z.coerce.number().int().min(1).max(24),
  discount: z.coerce.number().min(0).max(100),
  active: z.boolean().default(true),
})
const walletRule = z.object({
  wallet: z.string().min(1).max(60),
  adjustmentType: z.enum(["NONE", "DISCOUNT", "SURCHARGE"]),
  adjustment: z.coerce.number().min(0).max(100),
})
const settingsSchema = z.object({
  cashDiscount: z.coerce.number().min(0).max(100),
  debitSurcharge: z.coerce.number().min(0).max(100),
  cardRules: z.array(cardRule),
  promotions: z.array(promotion),
  walletRules: z.array(walletRule),
})

type PaymentSettingsSummary = {
  cashDiscount: number
  debitSurcharge: number
}

paymentRulesRouter.get("/", async (request, response) => {
  const branchId = z.string().uuid().parse(request.query.branchId)
  const [settings, cards, promotions, wallets] = await Promise.all([
    pool.query<PaymentSettingsSummary>(
      `SELECT cash_discount::float AS "cashDiscount", debit_surcharge::float AS "debitSurcharge" FROM payment_settings WHERE branch_id=$1`,
      [branchId],
    ),
    pool.query(
      `SELECT brand, card_type AS "cardType", installments, surcharge::float AS surcharge FROM payment_card_rules WHERE branch_id=$1 ORDER BY card_type, installments`,
      [branchId],
    ),
    pool.query(
      `SELECT weekday, card_brand AS "cardBrand", installments, discount::float AS discount, active FROM payment_promotions WHERE branch_id=$1 ORDER BY weekday`,
      [branchId],
    ),
    pool.query(
      `SELECT wallet, adjustment_type AS "adjustmentType", adjustment::float AS adjustment FROM payment_wallet_rules WHERE branch_id=$1 ORDER BY wallet`,
      [branchId],
    ),
  ])
  response.json({
    data: {
      cashDiscount: settings.rows[0]?.cashDiscount ?? 0,
      debitSurcharge: settings.rows[0]?.debitSurcharge ?? 0,
      cardRules: cards.rows,
      promotions: promotions.rows,
      walletRules: wallets.rows,
    },
  })
})

paymentRulesRouter.put("/", async (request: AuthRequest, response) => {
  const branchId = z.string().uuid().parse(request.query.branchId)
  const input = settingsSchema.parse(request.body)
  const db = await pool.connect()
  try {
    await db.query("BEGIN")
    await db.query(
      `INSERT INTO payment_settings (branch_id,cash_discount,debit_surcharge) VALUES ($1,$2,$3) ON CONFLICT (branch_id) DO UPDATE SET cash_discount=EXCLUDED.cash_discount,debit_surcharge=EXCLUDED.debit_surcharge,updated_at=now()`,
      [branchId, input.cashDiscount, input.debitSurcharge],
    )
    await db.query("DELETE FROM payment_card_rules WHERE branch_id=$1", [
      branchId,
    ])
    await db.query("DELETE FROM payment_promotions WHERE branch_id=$1", [
      branchId,
    ])
    await db.query("DELETE FROM payment_wallet_rules WHERE branch_id=$1", [
      branchId,
    ])
    for (const rule of input.cardRules)
      await db.query(
        `INSERT INTO payment_card_rules (branch_id,brand,card_type,installments,surcharge) VALUES ($1,$2,$3,$4,$5)`,
        [
          branchId,
          rule.brand,
          rule.cardType,
          rule.installments,
          rule.surcharge,
        ],
      )
    for (const rule of input.promotions)
      await db.query(
        `INSERT INTO payment_promotions (branch_id,weekday,card_brand,installments,discount,active) VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          branchId,
          rule.weekday,
          rule.cardBrand,
          rule.installments,
          rule.discount,
          rule.active,
        ],
      )
    for (const rule of input.walletRules)
      await db.query(
        `INSERT INTO payment_wallet_rules (branch_id,wallet,adjustment_type,adjustment) VALUES ($1,$2,$3,$4)`,
        [branchId, rule.wallet, rule.adjustmentType, rule.adjustment],
      )
    await audit(
      db,
      request.user!.id,
      "UPDATE",
      "payment_rules",
      branchId,
      input,
    )
    await db.query("COMMIT")
    response.json({ data: input })
  } catch (error) {
    await db.query("ROLLBACK")
    throw error
  } finally {
    db.release()
  }
})
