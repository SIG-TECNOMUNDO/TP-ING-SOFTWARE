import pg from "pg"
import { env } from "../config.js"

const { Pool } = pg

const isRemote =
  env.DATABASE_URL.includes("supabase.co") ||
  env.DATABASE_URL.includes("pooler.supabase.com") ||
  env.DATABASE_URL.includes("sslmode=require")

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

pool.on("error", (error) => {
  console.error("Error inesperado de PostgreSQL", error)
})
