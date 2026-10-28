import type { PoolClient } from "pg"

export type PaymentInput = {
  paymentMethod: "efectivo" | "debito" | "credito" | "transferencia" | "mercadolibre"
  installments: number
  cardBrand?: string
  cardType?: string
  wallet?: string
}

export async function calculatePayment(
  db: PoolClient,
  branchId: string,
  subtotal: number,
  input: PaymentInput,
) {
  let adjustmentPercent = 0
  if (input.paymentMethod === "efectivo" || input.paymentMethod === "debito") {
    const result = await db.query<{
      cashDiscount: number
      debitSurcharge: number
    }>(
      `SELECT cash_discount::float AS "cashDiscount", debit_surcharge::float AS "debitSurcharge" FROM payment_settings WHERE branch_id=$1`,
      [branchId],
    )
    adjustmentPercent =
      input.paymentMethod === "efectivo"
        ? -(result.rows[0]?.cashDiscount ?? 0)
        : (result.rows[0]?.debitSurcharge ?? 0)
  }
  if (input.paymentMethod === "credito") {
    const card = await db.query<{ surcharge: number }>(
      `SELECT surcharge::float AS surcharge FROM payment_card_rules WHERE branch_id=$1 AND card_type=$2 AND installments=$3 AND brand IN ($4, 'Todas las tarjetas') ORDER BY CASE WHEN brand=$4 THEN 0 ELSE 1 END LIMIT 1`,
      [
        branchId,
        input.cardType ?? "Crédito",
        input.installments,
        input.cardBrand ?? "Todas las tarjetas",
      ],
    )
    adjustmentPercent = card.rows[0]?.surcharge ?? 0
    const promotion = await db.query<{ discount: number }>(
      `SELECT discount::float AS discount FROM payment_promotions WHERE branch_id=$1 AND active=true AND weekday=EXTRACT(DOW FROM CURRENT_DATE) AND installments=$2 AND card_brand IN ($3, 'Todas las tarjetas') ORDER BY CASE WHEN card_brand=$3 THEN 0 ELSE 1 END LIMIT 1`,
      [branchId, input.installments, input.cardBrand ?? "Todas las tarjetas"],
    )
    adjustmentPercent -= promotion.rows[0]?.discount ?? 0
  }
  if (input.wallet) {
    const wallet = await db.query<{
      adjustment: number
      adjustmentType: string
    }>(
      `SELECT adjustment::float AS adjustment, adjustment_type AS "adjustmentType" FROM payment_wallet_rules WHERE branch_id=$1 AND wallet=$2`,
      [branchId, input.wallet],
    )
    const rule = wallet.rows[0]
    if (rule)
      adjustmentPercent +=
        rule.adjustmentType === "DISCOUNT"
          ? -rule.adjustment
          : rule.adjustmentType === "SURCHARGE"
            ? rule.adjustment
            : 0
  }
  const adjustment = Math.round(subtotal * adjustmentPercent) / 100
  return {
    adjustmentPercent,
    discount: adjustment < 0 ? -adjustment : 0,
    surcharge: adjustment > 0 ? adjustment : 0,
    total: Math.max(0, subtotal + adjustment),
  }
}
