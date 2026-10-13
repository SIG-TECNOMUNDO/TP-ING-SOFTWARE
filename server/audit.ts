import type { Pool, PoolClient } from "pg"

export async function audit(
  db: PoolClient | Pool,
  userId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {},
) {
  await db.query(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, action, entityType, entityId, JSON.stringify(metadata)],
  )
}
