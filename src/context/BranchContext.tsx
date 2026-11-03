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

const FALLBACK_BRANCHES: Branch[] = [
  {
    id: "suc-yofre",
    name: "Sucursal Yofre Norte",
    address: "Altolaguirre 2145",
  },
  {
    id: "suc-altacba",
    name: "Sucursal Alta Córdoba",
    address: "Mariano Fragueiro 1980",
  },
]

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [branches, setBranches] = useState<Branch[]>(FALLBACK_BRANCHES)
  const [branchId, setBranchId] = useState(user?.branchId ?? "")
  useEffect(() => {
    if (!user) return
    api<{ data: Branch[] }>("/branches")
      .then((result) =>
        setBranches(result.data.length > 0 ? result.data : FALLBACK_BRANCHES),
      )
      .catch(() => setBranches(FALLBACK_BRANCHES))
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
