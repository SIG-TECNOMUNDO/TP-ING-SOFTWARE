import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { pool } from "./pool.js"

const migrationUrl = new URL("./migrations/001_initial.sql", import.meta.url)
const sql = await readFile(fileURLToPath(migrationUrl), "utf8")

try {
  await pool.query(sql)
  console.log("Migración aplicada correctamente")
} finally {
  await pool.end()
}
