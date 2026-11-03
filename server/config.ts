import dotenv from "dotenv"
dotenv.config({ override: true })
import { z } from "zod"

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL es obligatoria"),
  JWT_SECRET: z
    .string()
    .min(32)
    .default("desarrollo-local-cambiar-este-secreto-32"),
  WEB_ORIGIN: z.string().url().default("http://localhost:8443"),
})

export const env = schema.parse(process.env)
