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
  Sun,
  Moon,
  ChevronDown,
  Shield,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"
import { useTheme } from "../context/ThemeContext"

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
  const { theme, toggleTheme } = useTheme()

  // Hide layout on login page
  if (location.pathname === "/login") {
    return <Outlet />
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar fijo (Desktop) y Drawer (Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#092B4B] via-[#0E3E6B] to-[#0B2F52] dark:from-[#060D1A] dark:via-[#0A1629] dark:to-[#050B14] text-white flex flex-col justify-between border-r border-slate-800/60 dark:border-slate-800/80 shadow-xl shadow-slate-900/15 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top: Logo de TecnoMundo */}
        <div className="shrink-0 flex items-center justify-between h-20 px-4 border-b border-white/10 dark:border-white/5">
          <div className="bg-white rounded-2xl py-2 px-3.5 shadow-sm shadow-blue-950/20 flex items-center justify-center w-full max-w-[210px] transition-transform hover:scale-[1.01]">
            <img
              src="/logo.png"
              alt="TecnoMundo"
              className="h-8 w-auto object-contain max-w-full"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 ml-2"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Middle: Navegación scrollable con estilo de burbujas */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          <div className="px-3 mb-3 flex items-center justify-between">
            <span className="text-2xs uppercase tracking-wider text-blue-200/60 dark:text-slate-400 font-bold font-heading">
              Menú Principal
            </span>
            <span className="text-3xs font-semibold px-1.5 py-0.5 rounded-full bg-white/10 text-blue-200">
              v1.0
            </span>
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 text-sm font-medium rounded-2xl transition-all duration-150 ${
                    isActive
                      ? "bg-white/15 dark:bg-primary/25 text-white shadow-xs font-semibold backdrop-blur-xs border-l-4 border-secondary pl-3"
                      : "text-blue-100/75 dark:text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="mr-3 h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: Estado de sesión y Cerrar Sesión */}
        <div className="shrink-0 p-3.5 border-t border-white/10 dark:border-white/5 bg-black/20 dark:bg-black/40">
          <div className="mb-2.5 px-2 flex items-center justify-between text-xs text-blue-200/70 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>En línea</span>
            </span>
            <span className="text-3xs font-mono uppercase bg-white/10 dark:bg-white/5 px-1.5 py-0.5 rounded">
              {user?.role ?? "INVITADO"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center px-3.5 py-2.5 text-sm font-medium rounded-xl text-blue-100 hover:bg-rose-500/20 hover:text-white transition-all group cursor-pointer border border-transparent hover:border-rose-500/30"
          >
            <LogOut className="mr-2.5 h-4 w-4 text-blue-200 group-hover:text-rose-400 transition-colors" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Área principal (con offset izquierdo en desktop) */}
      <div className="md:pl-64 flex flex-col min-h-screen min-w-0">
        {/* Barra superior estilizada con diseño de Burbujas / Cards */}
        <header className="sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-3 backdrop-blur-md bg-slate-50/80 dark:bg-[#0B1120]/80 border-b border-slate-200/70 dark:border-slate-800/80 transition-colors">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Sección Izquierda: Toggle Móvil + Sucursal */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Botón menú móvil */}
              <button
                className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Abrir menú de navegación"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Burbuja / Card: Selector de Sucursal */}
              <div className="flex items-center bg-white dark:bg-slate-800/90 rounded-2xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200/80 dark:border-slate-700/80 transition-all">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-secondary shrink-0" />
                {user?.branchId ? (
                  <span className="font-semibold text-slate-800 dark:text-slate-100 max-w-[130px] sm:max-w-[180px] truncate">
                    {user.branchName || "Mi Sucursal"}
                  </span>
                ) : (
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer pr-1"
                  >
                    <option value="" className="dark:bg-slate-800">
                      Todas las sucursales
                    </option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="dark:bg-slate-800">
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Sección Centro: Buscador global tipo Burbuja */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar cliente, orden, producto..."
                  className="w-full pl-9 pr-12 py-1.5 text-xs rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                  <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-3xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/80 rounded border border-slate-200 dark:border-slate-600">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Sección Derecha: Burbujas de Acciones (Buscador Móvil, Tema, Notificaciones, Perfil) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Botón Buscador móvil */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Abrir buscador"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Burbuja: Toggle Tema Claro / Oscuro */}
              <button
                onClick={toggleTheme}
                type="button"
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                className="p-2 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-xs hover:shadow hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
                title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
                ) : (
                  <Moon className="h-4 w-4 text-primary transition-transform -rotate-12 hover:rotate-0" />
                )}
              </button>

              {/* Burbuja: Notificaciones */}
              <button
                className="p-2 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative cursor-pointer"
                aria-label="Notificaciones"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-secondary ring-2 ring-white dark:ring-slate-800"></span>
              </button>

              {/* Burbuja: Perfil de usuario */}
              <div className="flex items-center bg-white dark:bg-slate-800/90 rounded-2xl p-1.5 sm:px-3 sm:py-1.5 shadow-xs border border-slate-200/80 dark:border-slate-700/80 transition-all">
                <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white font-bold text-xs shadow-xs ring-2 ring-primary/20">
                  {userInitial}
                </div>
                <div className="ml-2 hidden sm:block text-left">
                  <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[120px]">
                    {user?.name || "Administrador"}
                  </span>
                  <span className="block text-3xs text-slate-400 dark:text-slate-400 font-medium leading-none mt-0.5">
                    {user?.role || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desplegable de buscador en móviles */}
          {mobileSearchOpen && (
            <div className="mt-2.5 md:hidden animate-fadeIn">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar cliente, orden, producto..."
                  autoFocus
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          )}
        </header>

        {/* Contenido dinámico */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
