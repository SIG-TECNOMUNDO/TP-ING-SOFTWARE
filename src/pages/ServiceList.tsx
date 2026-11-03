import React, { useState } from "react"
import { Card, Button, Input, Select } from "../components/ui"
import {
  Search,
  Plus,
  Eye,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react"
import { Link } from "react-router-dom"

interface ServiceOrderRow {
  id: string
  client: string
  dni: string
  phone: string
  device: string
  issue: string
  status: string
  date: string
  branch: string
  totalCost: number
}

const initialOrders: ServiceOrderRow[] = [
  {
    id: "10452",
    client: "Martín Pérez",
    dni: "32.456.789",
    phone: "351-555-4321",
    device: "Samsung S22 Ultra",
    issue: "Módulo astillado por caída",
    status: "En Reparación",
    date: "Hoy, 14:30",
    branch: "Alta Córdoba",
    totalCost: 160000,
  },
  {
    id: "10451",
    client: "Laura Gómez",
    dni: "28.123.456",
    phone: "351-444-9876",
    device: "iPhone 13 Pro",
    issue: "No carga, pin dañado",
    status: "Listo para Entrega",
    date: "Hoy, 12:15",
    branch: "Yofre Norte",
    totalCost: 48000,
  },
  {
    id: "10450",
    client: "Carlos Ruiz",
    dni: "40.987.654",
    phone: "351-777-1122",
    device: "Notebook HP Pavilion",
    issue: "Mantenimiento y pasta térmica",
    status: "Ingresado",
    date: "Hoy, 10:40",
    branch: "Alta Córdoba",
    totalCost: 35000,
  },
  {
    id: "10449",
    client: "Ana Martínez",
    dni: "35.654.321",
    phone: "351-222-3344",
    device: "Motorola Edge 30",
    issue: "Corto en placa principal (mojado)",
    status: "Sin Solución",
    date: "Ayer, 18:20",
    branch: "Yofre Norte",
    totalCost: 0,
  },
  {
    id: "10448",
    client: "Diego Fernández",
    dni: "29.876.543",
    phone: "351-666-8899",
    device: "iPad Air 5",
    issue: "Reemplazo de batería agotada",
    status: "En Diagnóstico",
    date: "Ayer, 15:10",
    branch: "Alta Córdoba",
    totalCost: 92000,
  },
  {
    id: "10447",
    client: "Sofía López",
    dni: "42.123.987",
    phone: "351-333-2211",
    device: "iPhone 11",
    issue: "Flex botón de encendido",
    status: "Entregado",
    date: "20/10/2023",
    branch: "Yofre Norte",
    totalCost: 38000,
  },
]

const STATUS_OPTIONS = [
  "Ingresado",
  "En Diagnóstico",
  "En Reparación",
  "Listo para Entrega",
  "Sin Solución",
  "Entregado",
]

const getStatusSelectStyle = (status: string) => {
  switch (status) {
    case "Ingresado":
      return "bg-slate-100 text-slate-700 border-slate-200"
    case "En Diagnóstico":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "En Reparación":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "Listo para Entrega":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Sin Solución":
      return "bg-rose-50 text-rose-700 border-rose-200"
    case "Entregado":
      return "bg-purple-50 text-purple-700 border-purple-200"
    default:
      return "bg-slate-100 text-slate-700 border-slate-200"
  }
}

export default function ServiceList() {
  const [orders, setOrders] = useState<ServiceOrderRow[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos")
  const [branchFilter, setBranchFilter] = useState("Todas")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleQuickStatusChange = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    )
    setToastMessage(`Orden OT-${id} actualizada a "${newStatus}"`)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.trim().toLowerCase()
    const cleanDni = order.dni.replace(/\./g, "")
    const cleanQ = q.replace(/\./g, "")
    const matchesQuery =
      !q ||
      order.client.toLowerCase().includes(q) ||
      order.dni.toLowerCase().includes(q) ||
      cleanDni.includes(cleanQ) ||
      order.id.toLowerCase().includes(q) ||
      `ot-${order.id}`.includes(q) ||
      order.device.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter === "Todos" || order.status === statusFilter
    const matchesBranch =
      branchFilter === "Todas" || order.branch === branchFilter

    return matchesQuery && matchesStatus && matchesBranch
  })

  return (
    <div className="space-y-5">
      {/* Toast flotante de actualización rápida */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Servicio Técnico
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Seguimiento de órdenes de trabajo, diagnóstico y cambio rápido de
            estado
          </p>
        </div>
        <Link to="/servicio-tecnico/nueva">
          <Button icon={Plus} className="shadow-md py-2.5 px-4 font-bold">
            Nueva Orden
          </Button>
        </Link>
      </div>

      {/* 4 Contadores de Estado Horizontales y Compactos (en una sola línea limpia) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-blue-50 text-primary border border-blue-200/50 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600 truncate">
              En Diagnóstico
            </span>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 font-heading ml-2">
            {
              orders.filter(
                (o) =>
                  o.status === "Ingresado" || o.status === "En Diagnóstico",
              ).length
            }
          </span>
        </Card>

        <Card className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-orange-50 text-[#F56C00] border border-orange-200/50 shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600 truncate">
              En Reparación
            </span>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 font-heading ml-2">
            {orders.filter((o) => o.status === "En Reparación").length}
          </span>
        </Card>

        <Card className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600 truncate">
              Listos para Entrega
            </span>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 font-heading ml-2">
            {orders.filter((o) => o.status === "Listo para Entrega").length}
          </span>
        </Card>

        <Card className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/50 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-600 truncate">
              Sin Solución
            </span>
          </div>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 font-heading ml-2">
            {orders.filter((o) => o.status === "Sin Solución").length}
          </span>
        </Card>
      </div>

      {/* Barra de Filtrado y Búsqueda Rápida */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, DNI, equipo o N° de orden (ej. OT-10452)..."
              className="pl-10 pr-9 py-2"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
            <Select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full sm:w-44 py-2"
            >
              <option value="Todas">Todas las sucursales</option>
              <option value="Yofre Norte">Yofre Norte</option>
              <option value="Alta Córdoba">Alta Córdoba</option>
            </Select>
          </div>
        </div>

        {/* Píldoras rápidas de filtro por Estado */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            Estado:
          </span>
          {["Todos", ...STATUS_OPTIONS].map((st) => {
            const active = statusFilter === st
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#00559D] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {st}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Tabla de Órdenes Limpia y Despejada */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/90">
              <tr>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Equipo y Falla
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3.5 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="block text-sm font-extrabold text-primary">
                      OT-{order.id}
                    </span>
                    <span className="block text-2xs text-slate-400 mt-0.5">
                      {order.date}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="block text-sm font-bold text-slate-900">
                      {order.client}
                    </span>
                    <span className="block text-xs text-slate-400 font-mono mt-0.5">
                      DNI {order.dni}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="block text-sm font-bold text-slate-900">
                      {order.device}
                    </span>
                    <span className="block text-xs text-slate-500 max-w-xs truncate mt-0.5">
                      {order.issue}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-600">
                    {order.branch}
                  </td>

                  {/* Selector único semántico para cambiar estado sin duplicar badge + select */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <select
                      aria-label={`Cambiar estado de OT-${order.id}`}
                      value={order.status}
                      onChange={(e) =>
                        handleQuickStatusChange(order.id, e.target.value)
                      }
                      className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors ${getStatusSelectStyle(order.status)}`}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option
                          key={st}
                          value={st}
                          className="bg-white text-slate-800"
                        >
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <Link to={`/servicio-tecnico/${order.id}`}>
                      <Button
                        variant="outline"
                        className="px-3 py-1.5 text-xs font-semibold text-primary border-primary/25 hover:bg-blue-50"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Ver Orden
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No se encontraron órdenes de trabajo para los filtros
                    seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
