import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { env } from "./config.js"
import { AppError, errorHandler } from "./errors.js"
import { authRouter } from "./routes/auth.js"
import { branchesRouter } from "./routes/branches.js"
import { clientsRouter } from "./routes/clients.js"
import { dashboardRouter } from "./routes/dashboard.js"
import { ordersRouter } from "./routes/orders.js"
import { productsRouter } from "./routes/products.js"
import { reportsRouter } from "./routes/reports.js"
import { salesRouter } from "./routes/sales.js"
import { usersRouter } from "./routes/users.js"

export const app = express()

app.use(helmet())
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }))
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

app.get("/api/health", (_request, response) => response.json({ status: "ok" }))
app.use("/api/auth", authRouter)
app.use("/api/branches", branchesRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/products", productsRouter)
app.use("/api/clients", clientsRouter)
app.use("/api/orders", ordersRouter)
app.use("/api/sales", salesRouter)
app.use("/api/users", usersRouter)
app.use("/api/reports", reportsRouter)
app.use((_request, _response, next) =>
  next(new AppError(404, "Recurso no encontrado")),
)
app.use(errorHandler)
