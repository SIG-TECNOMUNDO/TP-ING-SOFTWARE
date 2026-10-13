import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { api } from "../services/api"
import type { Branch } from "../types"
import { useAuth } from "./AuthContext"

type BranchContextValue = {
  branches: Branch[]
  branchId: string
  setBranchId: (id: string) => void
}
const BranchContext = createContext<BranchContextValue | null>(null)

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [branches, setBranches] = useState<Branch[]>([])
  const [branchId, setBranchId] = useState(user?.branchId ?? "")
  useEffect(() => {
    if (!user) return
    api<{ data: Branch[] }>("/branches")
      .then((result) => setBranches(result.data))
      .catch(() => setBranches([]))
    setBranchId(user.branchId ?? "")
  }, [user])
  const value = useMemo(
    () => ({ branches, branchId, setBranchId }),
    [branches, branchId],
  )
  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (!context)
    throw new Error("useBranch debe usarse dentro de BranchProvider")
  return context
}
