import { readdir, readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { pool } from "./pool.js"

const migrationsDirectory = fileURLToPath(new URL("./migrations/", import.meta.url))

try {
  const migrations = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort()
  for (const migration of migrations) {
    await pool.query(await readFile(`${migrationsDirectory}/${migration}`, "utf8"))
  }
  console.log("Migración aplicada correctamente")
} finally {
  await pool.end()
}
