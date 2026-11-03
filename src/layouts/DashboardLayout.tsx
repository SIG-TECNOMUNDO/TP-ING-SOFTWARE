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
    <div className="min-h-screen bg-[#0B2B4C] text-slate-900">
      {/* Marco izquierdo: Menú Lateral en azul oscuro corporativo (#0B2B4C) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B2B4C] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } md:translate-x-0 md:shadow-none`}
      >
        {/* Top: Logotipo transparente plano y limpio sin efectos ni sombras */}
        <div className="shrink-0 flex items-center justify-between h-20 px-5">
          <div className="w-full flex items-center justify-center">
            <img
              src="/logo.png"
              alt="TecnoMundo"
              className="w-full max-w-[205px] h-auto object-contain"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 ml-2 shrink-0"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Middle: Navegación con alto contraste */}
        <div className="flex-1 overflow-y-auto py-4 px-3.5 space-y-1">
          <p className="px-3.5 text-2xs uppercase tracking-wider text-blue-200/70 font-bold mb-3 font-heading">
            Menú Principal
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 text-sm rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-white/15 text-white font-semibold border-l-4 border-[#F56C00] pl-3"
                      : "text-slate-100/85 font-medium hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                        isActive ? "text-[#F56C00]" : "text-blue-200/80"
                      }`}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: Cerrar sesión */}
        <div className="shrink-0 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-white/8 text-slate-100 hover:bg-rose-500/20 hover:text-white transition-colors group cursor-pointer border border-white/10 hover:border-rose-400/30"
          >
            <LogOut className="mr-2 h-4 w-4 text-blue-200 group-hover:text-rose-300 transition-colors" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Marco superior oscuro + Área de Contenido Principal clara */}
      <div className="md:pl-64 flex flex-col min-h-screen min-w-0 bg-[#0B2B4C]">
        {/* Header Superior unificado en el mismo azul oscuro (#0B2B4C) */}
        <header className="sticky top-0 z-30 h-20 px-4 sm:px-6 lg:px-8 flex items-center bg-[#0B2B4C] text-white">
          <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
            {/* Izquierda: Menú móvil + Selector de Sucursal */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                className="md:hidden p-2.5 text-slate-100 hover:text-white rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center bg-white/10 hover:bg-white/15 rounded-2xl px-3.5 py-2 text-xs text-white border border-white/15 transition-colors">
                <MapPin className="h-3.5 w-3.5 mr-2 text-[#F56C00] shrink-0" />
                {user?.branchId ? (
                  <span className="font-semibold text-white max-w-[140px] sm:max-w-[180px] truncate">
                    {user.branchName || "Mi Sucursal"}
                  </span>
                ) : (
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-white cursor-pointer pr-1"
                  >
                    <option value="" className="bg-[#0B2B4C] text-white">
                      Todas las sucursales
                    </option>
                    {branches.map((b) => (
                      <option
                        key={b.id}
                        value={b.id}
                        className="bg-[#0B2B4C] text-white"
                      >
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Centro: Buscador oscuro translúcido (bg-white/10 y texto blanco) */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-200/70">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-white/10 border border-white/15 text-white placeholder-blue-200/60 focus:outline-none focus:bg-white/15 focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                />
              </div>
            </div>

            {/* Derecha: Notificaciones y Perfil en versión clara sobre fondo oscuro */}
            <div className="flex items-center gap-2.5">
              {/* Botón buscador en móvil */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Notificaciones */}
              <button
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 transition-colors relative cursor-pointer"
                aria-label="Notificaciones"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-[#F56C00] ring-2 ring-[#0B2B4C]"></span>
              </button>

              {/* Perfil de usuario */}
              <div className="flex items-center bg-white/10 rounded-2xl p-1.5 sm:px-3 sm:py-1.5 border border-white/15">
                <div className="h-7 w-7 rounded-xl bg-[#F56C00] text-white flex items-center justify-center font-bold text-xs">
                  {userInitial}
                </div>
                <div className="ml-2.5 hidden sm:block text-left pr-1">
                  <span className="block text-xs font-bold text-white leading-tight truncate max-w-[130px]">
                    {user?.name || "Administrador"}
                  </span>
                  <span className="block text-3xs text-blue-200/80 font-medium leading-none mt-0.5">
                    {user?.role || "ADMIN"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Buscador desplegable en móvil */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3 md:hidden bg-[#0B2B4C] animate-fadeIn">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-200/70">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Buscar..."
                autoFocus
                className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-white/10 border border-white/15 text-white placeholder-blue-200/60 focus:outline-none focus:bg-white/15 focus:border-white/30"
              />
            </div>
          </div>
        )}

        {/* Área de Contenido Principal: conserva su fondo gris claro (bg-slate-100) y tarjetas blancas */}
        <main className="flex-1 bg-slate-100 text-slate-900 md:rounded-tl-3xl p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
