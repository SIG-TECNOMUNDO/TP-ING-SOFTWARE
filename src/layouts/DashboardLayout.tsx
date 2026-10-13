import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  Bell,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"
import type { Role } from "../types"

const navItems: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  roles?: Role[]
}[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventario", label: "Inventario", icon: Package },
  {
    to: "/ventas",
    label: "Ventas",
    icon: ShoppingCart,
    roles: ["ADMIN", "SALES"],
  },
  { to: "/servicio-tecnico", label: "Servicio Técnico", icon: Wrench },
  { to: "/clientes", label: "Clientes", icon: Users },
  {
    to: "/administracion",
    label: "Administración",
    icon: Settings,
    roles: ["ADMIN"],
  },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState("")
  const { user, logout } = useAuth()
  const { branches, branchId, setBranchId } = useBranch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 border-b border-primary-dark">
          <span className="text-xl font-bold tracking-wider">
            SIG-Tecnomundo
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-blue-200 uppercase tracking-wider mb-4 font-semibold">
            Menú principal
          </p>
          <nav className="space-y-1">
            {navItems
              .filter((item) => !item.roles || item.roles.includes(user!.role))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-primary-dark text-white"
                        : "text-blue-100 hover:bg-primary-dark hover:text-white"
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-primary-dark">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-md text-blue-100 hover:bg-primary-dark hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center">
            <button
              aria-label="Abrir menú"
              className="md:hidden mr-4 text-gray-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-3 py-1.5 text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <label className="sr-only" htmlFor="global-branch">
                Sucursal activa
              </label>
              <select
                id="global-branch"
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
                disabled={user!.role !== "ADMIN"}
                className="bg-transparent border-none text-sm font-medium cursor-pointer disabled:cursor-default"
              >
                {user!.role === "ADMIN" && (
                  <option value="">Todas las sucursales</option>
                )}
                {branches
                  .filter(
                    (branch) =>
                      user!.role === "ADMIN" || branch.id === user!.branchId,
                  )
                  .map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <form
              className="relative hidden md:block"
              onSubmit={(event) => {
                event.preventDefault()
                if (globalSearch.trim())
                  navigate(
                    `/servicio-tecnico?search=${encodeURIComponent(globalSearch.trim())}`,
                  )
              }}
            >
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                aria-label="Búsqueda global"
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                type="search"
                placeholder="Buscar cliente, equipo u orden…"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
            </form>
            <button
              aria-label="Notificaciones"
              className="text-gray-400 hover:text-gray-500 relative"
            >
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {user!.name.charAt(0)}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                {user!.name}
              </span>
            </div>
          </div>
        </header>
        <main
          id="main-content"
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto"
        >
          <Outlet />
        </main>
      </div>
      {sidebarOpen && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 bg-gray-600/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
