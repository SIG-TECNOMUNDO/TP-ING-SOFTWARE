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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Menú Lateral (Sidebar) en azul oscuro corporativo */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0A2747] via-[#0B2D52] to-[#071D36] text-white flex flex-col justify-between shadow-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top: Logotipo transparente con tamaño y margen destacados sobre el fondo oscuro */}
        <div className="shrink-0 flex items-center justify-between pt-6 pb-5 px-5 border-b border-white/10">
          <div className="w-full flex items-center justify-center">
            <img
              src="/logo.png"
              alt="TecnoMundo"
              className="w-full max-w-[210px] h-auto object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.22)] brightness-110"
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
        <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-1">
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
                      ? "bg-white/15 text-white font-semibold shadow-xs border-l-4 border-[#F56C00] pl-3"
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
        <div className="shrink-0 p-4 border-t border-white/10 bg-black/15">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center px-3.5 py-2.5 text-xs font-semibold rounded-xl text-slate-100 hover:bg-rose-500/20 hover:text-white transition-colors group cursor-pointer border border-white/10 hover:border-rose-400/30"
          >
            <LogOut className="mr-2 h-4 w-4 text-blue-200 group-hover:text-rose-300 transition-colors" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="md:pl-64 flex flex-col min-h-screen min-w-0 bg-slate-100">
        {/* Barra Superior con tarjetas/burbujas blancas */}
        <header className="sticky top-0 z-30 h-20 px-4 sm:px-6 lg:px-8 flex items-center bg-slate-100/90 backdrop-blur-md">
          <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
            {/* Izquierda: Menú móvil + Burbuja de Sucursal */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                className="md:hidden p-2.5 text-slate-600 hover:text-slate-900 rounded-2xl bg-white border border-slate-200/90 shadow-xs cursor-pointer"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center bg-white rounded-2xl px-3.5 py-2 text-xs text-slate-700 shadow-xs border border-slate-200/90">
                <MapPin className="h-3.5 w-3.5 mr-2 text-[#F56C00] shrink-0" />
                {user?.branchId ? (
                  <span className="font-semibold text-slate-800 max-w-[140px] sm:max-w-[180px] truncate">
                    {user.branchName || "Mi Sucursal"}
                  </span>
                ) : (
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-semibold text-slate-800 cursor-pointer pr-1"
                  >
                    <option value="">Todas las sucursales</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Centro: Buscador limpio (solo lupa y "Buscar...") */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-white border border-slate-200/90 text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Derecha: Burbujas de Notificaciones y Perfil */}
            <div className="flex items-center gap-2.5">
              {/* Botón buscador en móvil */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-600 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Burbuja: Notificaciones */}
              <button
                className="p-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-600 shadow-xs hover:bg-slate-50 transition-colors relative cursor-pointer"
                aria-label="Notificaciones"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-[#F56C00] ring-2 ring-white"></span>
              </button>

              {/* Burbuja: Perfil de usuario */}
              <div className="flex items-center bg-white rounded-2xl p-1.5 sm:px-3 sm:py-1.5 shadow-xs border border-slate-200/90">
                <div className="h-7 w-7 rounded-xl bg-[#00559D] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {userInitial}
                </div>
                <div className="ml-2.5 hidden sm:block text-left pr-1">
                  <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                    {user?.name || "Administrador"}
                  </span>
                  <span className="block text-3xs text-slate-400 font-medium leading-none mt-0.5">
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
                className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Área de Trabajo Principal: Fondo gris claro neutro (bg-slate-100) donde resaltan las tarjetas blancas */}
        <main className="flex-1 bg-slate-100 px-4 sm:px-6 lg:px-8 pb-8 pt-2 overflow-y-auto">
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
