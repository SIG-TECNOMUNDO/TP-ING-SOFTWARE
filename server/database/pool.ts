import pg from "pg"
import { env } from "../config.js"

const { Pool } = pg

export const pool = new Pool({ connectionString: env.DATABASE_URL })

pool.on("error", (error) => {
  console.error("Error inesperado de PostgreSQL", error)
})
