import type { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config.js"
import { AppError } from "../errors.js"
import type { AuthRequest, SessionUser } from "../types.js"
import { hasPermission, type Permission } from "./permissions.js"

export const COOKIE_NAME = "sig_session"

export function requireAuth(
  request: AuthRequest,
  _response: Response,
  next: NextFunction,
) {
  const token = request.cookies?.[COOKIE_NAME]
  if (!token) return next(new AppError(401, "Debés iniciar sesión"))
  try {
    request.user = (jwt.verify(token, env.JWT_SECRET) as SessionUser)
    next()
  } catch {
    next(new AppError(401, "La sesión venció o no es válida"))
  }
}

export function requirePermission(permission: Permission) {
  return (request: AuthRequest, _response: Response, next: NextFunction) => {
    if (!request.user || !hasPermission(request.user.role, permission)) {
      return next(
        new AppError(403, "No tenés permiso para realizar esta acción"),
      )
    }
    next()
  }
}

export function scopedBranch(request: AuthRequest) {
  if (!request.user) throw new AppError(401, "Debés iniciar sesión")
  const requested =
    typeof request.query.branchId === "string" ? request.query.branchId : null
  if (request.user.role !== "ADMIN") {
    if (requested && requested !== request.user.branchId) {
      throw new AppError(403, "No tenés acceso a esa sucursal")
    }
    return request.user.branchId
  }
  return requested
}
