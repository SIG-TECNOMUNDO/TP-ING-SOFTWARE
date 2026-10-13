import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { Role } from "../types"

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: Role[]
}) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading)
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Cargando sesión…
      </div>
    )
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}
