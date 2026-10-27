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
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for Desktop */}
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
            Menú Principal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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
            className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-md text-blue-100 hover:bg-primary-dark hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden sm:flex items-center bg-gray-100 rounded-md px-3 py-1.5 text-sm text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <select className="bg-transparent border-none focus:ring-0 text-sm font-medium cursor-pointer">
                <option>Todas las sucursales</option>
                <option>Yofre Norte</option>
                <option>Alta Córdoba</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar cliente, orden..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
              />
            </div>

            <button className="text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-secondary ring-2 ring-white"></span>
            </button>

            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

