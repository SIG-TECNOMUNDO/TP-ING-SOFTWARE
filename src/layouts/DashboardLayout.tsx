import React, { useState } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  MapPin,
  WalletCards,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/inventario", label: "Inventario", icon: Package },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart },
  { to: "/servicio-tecnico", label: "Servicio Técnico", icon: Wrench },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/caja", label: "Caja", icon: WalletCards },
  { to: "/administracion", label: "Administración", icon: Settings },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { branches, branchId, setBranchId } = useBranch()

  if (location.pathname === "/login") {
    return <Outlet />
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Menú Lateral (Sidebar) integrado en paleta neutra y clara sin líneas divisorias bruscas */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#F4F6F9] dark:bg-[#0B1120] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } md:translate-x-0 md:shadow-none`}
      >
        {/* Top: Logo alineado en altura (h-20) con la barra superior */}
        <div className="shrink-0 flex items-center justify-between h-20 px-6">
          <img
            src="/logo.png"
            alt="TecnoMundo"
            className="h-9 w-auto object-contain max-w-[190px] dark:brightness-110"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-white/60 dark:hover:bg-slate-800"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Middle: Navegación con estilo de tarjetas suaves */}
        <div className="flex-1 overflow-y-auto py-3 px-4 space-y-1">
          <p className="px-3.5 text-2xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-2.5 font-heading">
            Menú Principal
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 text-sm rounded-2xl transition-all duration-150 ${
                    isActive
                      ? "bg-white dark:bg-slate-800/90 text-primary dark:text-blue-400 font-semibold shadow-xs border border-slate-200/70 dark:border-slate-700/80"
                      : "text-slate-600 dark:text-slate-400 font-medium hover:bg-white/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-primary dark:text-blue-400"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: Cerrar sesión en tarjeta sutil */}
        <div className="shrink-0 p-4">
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-2.5 border border-slate-200/70 dark:border-slate-800 shadow-2xs">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors group cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Contenedor Principal fusionado visualmente con el Sidebar */}
      <div className="md:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Barra Superior continua (misma altura h-20 y mismo fondo que el Sidebar, sin líneas divisorias) */}
        <header className="sticky top-0 z-30 h-20 px-4 sm:px-6 lg:px-8 flex items-center bg-[#F4F6F9]/90 dark:bg-[#0B1120]/90 backdrop-blur-md">
          <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
            {/* Izquierda: Menú móvil + Burbuja de Sucursal */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                className="md:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs cursor-pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <MapPin className="h-3.5 w-3.5 mr-2 text-secondary shrink-0" />
                {user?.branchId ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-100 max-w-[140px] sm:max-w-[180px] truncate">
                    {user.branchName || "Mi Sucursal"}
                  </span>
                ) : (
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer pr-1"
                  >
                    <option value="" className="dark:bg-slate-900">
                      Todas las sucursales
                    </option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="dark:bg-slate-900">
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Centro: Buscador limpio en burbuja (solo lupa y "Buscar...") */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Derecha: Burbujas de Notificaciones y Perfil */}
            <div className="flex items-center gap-2.5">
              {/* Botón buscador en móvil */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Burbuja: Notificaciones */}
              <button
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                aria-label="Notificaciones"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-secondary ring-2 ring-white dark:ring-slate-900"></span>
              </button>

              {/* Burbuja: Perfil de usuario */}
              <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl p-1.5 sm:px-3 sm:py-1.5 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <div className="h-7 w-7 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  {userInitial}
                </div>
                <div className="ml-2.5 hidden sm:block text-left pr-1">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate max-w-[130px]">
                    {user?.name || "Administrador"}
                  </span>
                  <span className="block text-3xs text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">
                    {user?.role || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Buscador desplegable en móvil */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3 md:hidden animate-fadeIn">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                autoFocus
                className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Área de Contenido Principal */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 pt-2 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
