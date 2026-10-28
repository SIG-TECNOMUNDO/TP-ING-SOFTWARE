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
  Bell,
  Search,
  MapPin,
  WalletCards,
  ChevronDown,
} from "lucide-react"

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
  const location = useLocation()
  const navigate = useNavigate()

  // Hide layout on login page
  if (location.pathname === "/login") {
    return <Outlet />
  }

  const handleLogout = () => {
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar fijo (Fixed / Sticky) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0B3A64] via-[#1565A9] to-[#092B4B] text-white flex flex-col justify-between shadow-xl shadow-slate-900/10 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top: Logo de TecnoMundo */}
        <div className="shrink-0 flex items-center justify-center h-20 px-4 border-b border-white/10">
          <div className="bg-white rounded-xl py-2 px-4 shadow-sm shadow-blue-950/20 flex items-center justify-center w-full max-w-[215px] transition-transform hover:scale-[1.01]">
            <img
              src="/logo.png"
              alt="TecnoMundo"
              className="h-8 w-auto object-contain max-w-full"
            />
          </div>
        </div>

        {/* Middle: Navegación scrollable independiente */}
        <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-1">
          <p className="px-3 text-2xs uppercase tracking-wider text-blue-200/70 font-bold mb-3 font-heading">
            Menú Principal
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-white/15 text-white shadow-xs font-semibold backdrop-blur-xs border-l-4 border-secondary pl-3"
                      : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <item.icon className="mr-3 h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom: Botón de Cerrar Sesión fijo en la parte inferior */}
        <div className="shrink-0 p-3.5 border-t border-white/10 bg-black/15">
          <div className="mb-2 px-2 flex items-center justify-between text-xs text-blue-200/60">
            <span>Sesión activa</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3.5 py-2.5 text-sm font-medium rounded-xl text-blue-100 hover:bg-rose-500/20 hover:text-white transition-all group cursor-pointer"
          >
            <LogOut className="mr-3 h-4 w-4 text-blue-200 group-hover:text-rose-400 transition-colors" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Área de contenido principal con padding izquierdo para el sidebar fijo */}
      <div className="md:pl-64 flex flex-col min-h-screen min-w-0 bg-[#F8FAFC]">
        {/* Header superior con efecto glassmorphism */}
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Selector de Sucursal con diseño moderno */}
            <div className="hidden sm:flex items-center bg-slate-100/90 hover:bg-slate-100 rounded-xl px-3 py-1.5 text-sm text-slate-700 transition-colors border border-slate-200/60">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <select className="bg-transparent border-none focus:ring-0 text-xs font-semibold text-slate-800 cursor-pointer pr-1">
                <option>Todas las sucursales</option>
                <option>Yofre Norte</option>
                <option>Alta Córdoba</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Buscador global estilizado */}
            <div className="relative hidden md:block w-64 lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar cliente, orden, producto..."
                className="block w-full pl-9 pr-3.5 py-1.5 border border-slate-200 rounded-xl leading-5 bg-slate-50/60 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Notificaciones */}
            <button
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors relative"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-secondary ring-2 ring-white"></span>
            </button>

            {/* Perfil de usuario */}
            <div className="flex items-center pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center text-white font-bold text-xs shadow-xs ring-2 ring-primary/20">
                A
              </div>
              <div className="ml-2.5 hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  Administrador
                </span>
                <span className="block text-2xs text-slate-400 font-medium">
                  admin@tecnomundo.com
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido dinámico con espaciado amplio */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}
