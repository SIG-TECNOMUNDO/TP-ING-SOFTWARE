import type { Request } from "express"
import type { Role } from "./auth/permissions.js"

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
  branchId: string | null
  branchName: string | null
}

export type AuthRequest = Request & { user?: SessionUser }
