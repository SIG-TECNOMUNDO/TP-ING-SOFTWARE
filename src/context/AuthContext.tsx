import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { api } from "../services/api"
import type { User } from "../types"

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const DEMO_USERS: Record<string, User> = {
  "admin@tecnomundo.com": {
    id: "usr-admin",
    name: "Administrador Principal",
    email: "admin@tecnomundo.com",
    role: "ADMIN",
    branchId: null,
    branchName: "Todas las sucursales",
  },
  "ventas.yofre@tecnomundo.com": {
    id: "usr-sales-yofre",
    name: "Ventas Yofre",
    email: "ventas.yofre@tecnomundo.com",
    role: "SALES",
    branchId: "suc-yofre",
    branchName: "Sucursal Yofre Norte",
  },
  "ventas.altacba@tecnomundo.com": {
    id: "usr-sales-altacba",
    name: "Ventas Alta Cba",
    email: "ventas.altacba@tecnomundo.com",
    role: "SALES",
    branchId: "suc-altacba",
    branchName: "Sucursal Alta Córdoba",
  },
  "tec.altacba@tecnomundo.com": {
    id: "usr-tech-altacba",
    name: "Técnico Alta Cba",
    email: "tec.altacba@tecnomundo.com",
    role: "TECH",
    branchId: "suc-altacba",
    branchName: "Sucursal Alta Córdoba",
  },
}

const STORAGE_KEY = "sig_tecnomundo_demo_user"

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ user: User }>("/auth/me")
      .then((result) => {
        setUser(result.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user))
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            setUser(JSON.parse(saved) as User)
            return
          }
        } catch {
          // ignore storage errors
        }
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        try {
          const result = await api<{ user: User }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: normalizedEmail, password }),
          })
          setUser(result.user)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user))
        } catch (err) {
          // Fallback para despliegue estático en Vercel (sin backend Express activo)
          const demoUser = DEMO_USERS[normalizedEmail]
          if (demoUser && password.trim().length > 0) {
            setUser(demoUser)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser))
            return
          }
          throw err
        }
      },
      logout: async () => {
        await api<void>("/auth/logout", { method: "POST" }).catch(
          () => undefined,
        )
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return context
}
