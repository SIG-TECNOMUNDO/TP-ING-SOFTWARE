import type { ErrorRequestHandler } from "express"
import { ZodError } from "zod"

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response
      .status(400)
      .json({ message: "Datos inválidos", issues: error.issues })
    return
  }
  if (error instanceof AppError) {
    response.status(error.status).json({ message: error.message })
    return
  }
  console.error(error)
  response.status(500).json({ message: "Ocurrió un error interno" })
}
