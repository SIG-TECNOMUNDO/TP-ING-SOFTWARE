import type { PoolClient } from "pg"

type Queryable = Pick<PoolClient, "query">

export type CashMovementInput = {
  branchId: string
  source: "VENTAS" | "SAT" | "MANUAL"
  type: "INCOME" | "EXPENSE"
  concept: string
  paymentMethod: string
  userId: string
  amount: number
  referenceType?: string
  referenceId?: string
  note?: string
}

export async function recordCashMovement(
  db: Queryable,
  input: CashMovementInput,
) {
  await db.query(
    `INSERT INTO cash_movements (branch_id,source,type,concept,payment_method,user_id,amount,reference_type,reference_id,note)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [
      input.branchId,
      input.source,
      input.type,
      input.concept,
      input.paymentMethod,
      input.userId,
      input.amount,
      input.referenceType ?? null,
      input.referenceId ?? null,
      input.note ?? null,
    ],
  )
}
