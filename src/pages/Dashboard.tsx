import React, { useState } from "react"
import { Card, Badge, Button } from "../components/ui"
import {
  TrendingUp,
  Wrench,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MoreVertical,
  Download,
  Plus,
  ShoppingCart,
  AlertOctagon,
  PackagePlus,
} from "lucide-react"
import { Link } from "react-router-dom"
import RegisterSaleModal, { SaleRecord } from "../components/RegisterSaleModal"

const recentOrders = [
  {
    id: "OT-10452",
    client: "Martín Pérez",
    device: "Samsung S22 Ultra",
    status: "En Reparación",
    date: "24/10/2023",
  },
  {
    id: "OT-10451",
    client: "Laura Gómez",
    device: "iPhone 13 Pro",
    status: "Listo para Entrega",
    date: "23/10/2023",
  },
  {
    id: "OT-10450",
    client: "Carlos Ruiz",
    device: "Notebook HP Pavilion",
    status: "Ingresado",
    date: "23/10/2023",
  },
  {
    id: "OT-10449",
    client: "Ana Martínez",
    device: "Motorola Edge 30",
    status: "Sin Solución",
    date: "22/10/2023",
  },
  {
    id: "OT-10448",
    client: "Diego Fernández",
    device: "iPad Air 5",
    status: "En Diagnóstico",
    date: "22/10/2023",
  },
]

const stockAlerts = [
  {
    sku: "PRD-004",
    product: "Batería Original Motorola G22",
    stock: 0,
    limit: 3,
    category: "Repuestos",
  },
  {
    sku: "PRD-011",
    product: "Funda Silicona Moto G52",
    stock: 0,
    limit: 10,
    category: "Accesorios",
  },
  {
    sku: "PRD-001",
    product: "Módulo Display iPhone 13 Pro OLED",
    stock: 2,
    limit: 5,
    category: "Repuestos",
  },
  {
    sku: "PRD-006",
    product: "Pin de Carga Tipo C Samsung A52",
    stock: 3,
    limit: 10,
    category: "Repuestos",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Ingresado":
      return <Badge variant="gray">{status}</Badge>
    case "En Diagnóstico":
      return <Badge variant="blue">{status}</Badge>
    case "En Reparación":
      return <Badge variant="orange">{status}</Badge>
    case "Listo para Entrega":
      return <Badge variant="green">{status}</Badge>
    case "Sin Solución":
      return <Badge variant="red">{status}</Badge>
    default:
      return <Badge variant="gray">{status}</Badge>
  }
}

export default function Dashboard() {
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [todaySalesTotal, setTodaySalesTotal] = useState(1240500)

  const handleSaleRegistered = (sale: SaleRecord) => {
    setTodaySalesTotal((prev) => prev + sale.total)
  }

  const stats = [
    {
      name: "Ventas de hoy",
      value: `$ ${todaySalesTotal.toLocaleString("es-AR")}`,
      subtitle: "+12% vs. ayer",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50 border border-blue-200/50",
    },
    {
      name: "Órdenes Pendientes",
      value: "24",
      subtitle: "8 en taller activo",
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-50 border border-orange-200/50",
    },
    {
      name: "Reparaciones Listas",
      value: "12",
      subtitle: "Pendientes de retiro",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border border-emerald-200/50",
    },
    {
      name: "Alertas de Stock",
      value: `${stockAlerts.length}`,
      subtitle: "2 agotados críticos",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50 border border-rose-200/50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Encabezado responsive con botón prominente "+ Registrar Venta" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Panel General
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Resumen en tiempo real del estado de tu sucursal
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Button
            variant="outline"
            className="text-xs py-2.5 px-3.5 sm:px-4 bg-white"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Descargar Reporte
          </Button>
          <Link to="/servicio-tecnico/nueva">
            <Button
              variant="outline"
              className="text-xs py-2.5 px-3.5 sm:px-4 bg-white border-primary/30 text-primary hover:bg-blue-50/50"
            >
              <Wrench className="w-3.5 h-3.5 mr-1.5" />
              Nueva Orden
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => setSaleModalOpen(true)}
            className="text-xs sm:text-sm py-2.5 px-4 sm:px-5 font-bold shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Registrar Venta
          </Button>
        </div>
      </div>

      {/* Grid de Métricas / Estadísticas en tarjetas blancas con sombras suaves */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item) => (
          <Card
            key={item.name}
            className="p-4 sm:p-5 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center min-w-0">
              <div className={`p-3 rounded-2xl ${item.bg} shrink-0`}>
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
              </div>
              <div className="ml-3.5 min-w-0">
                <p className="text-xs font-medium text-slate-500 truncate">
                  {item.name}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate font-heading mt-0.5">
                  {item.value}
                </h3>
                <p className="text-3xs text-slate-400 font-medium mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Órdenes Recientes */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Últimas Órdenes de Trabajo
              </h2>
              <p className="text-2xs sm:text-xs text-slate-400">
                Seguimiento de reparaciones activas en sucursal
              </p>
            </div>
            <Link
              to="/servicio-tecnico"
              className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center group"
            >
              Ver todas{" "}
              <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs font-bold text-primary">
                      {order.id}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs font-medium text-slate-900">
                      {order.client}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                      {order.device}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                      <Link
                        to={`/servicio-tecnico/${order.id.replace("OT-", "")}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 inline-block transition-colors"
                        aria-label={`Ver detalles de ${order.id}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
            <span className="text-2xs text-slate-500">
              Mostrando las 5 órdenes más recientes
            </span>
            <button
              type="button"
              onClick={() => setSaleModalOpen(true)}
              className="text-xs font-bold text-[#F56C00] hover:text-[#e65c00] flex items-center gap-1 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Facturar repuesto o venta rápida →
            </button>
          </div>
        </Card>

        {/* Apartado Mejorado: Alertas de Stock con Colores Semánticos de Urgencia */}
        <Card className="flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                  Alertas de Stock
                </h2>
                <span className="px-2 py-0.5 text-3xs font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                  Urgente
                </span>
              </div>
              <p className="text-2xs sm:text-xs text-slate-400 mt-0.5">
                Artículos críticos o agotados por reponer
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
            <ul className="space-y-3">
              {stockAlerts.map((item) => {
                const isOut = item.stock === 0
                const percentage = Math.min(
                  100,
                  Math.round((item.stock / item.limit) * 100),
                )
                return (
                  <li
                    key={item.sku}
                    className={`p-3 rounded-2xl border transition-all ${
                      isOut
                        ? "bg-rose-50/60 border-rose-200/80 hover:border-rose-300"
                        : "bg-orange-50/50 border-orange-200/70 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start min-w-0">
                        <div
                          className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            isOut
                              ? "bg-rose-100 text-rose-600"
                              : "bg-orange-100 text-[#F56C00]"
                          }`}
                        >
                          {isOut ? (
                            <AlertOctagon className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="ml-2.5 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.product}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-3xs font-mono font-semibold text-slate-500">
                              {item.sku}
                            </span>
                            <span className="text-3xs text-slate-400">•</span>
                            <span className="text-3xs text-slate-500">
                              Mínimo: {item.limit} un.
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-3xs font-bold border ${
                          isOut
                            ? "bg-rose-600 text-white border-rose-700 shadow-2xs"
                            : "bg-orange-500 text-white border-orange-600 shadow-2xs"
                        }`}
                      >
                        {isOut ? "AGOTADO" : `${item.stock} un.`}
                      </span>
                    </div>

                    {/* Barra de nivel de stock semántica */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/80 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className={`h-full rounded-full ${
                            isOut ? "bg-rose-500" : "bg-[#F56C00]"
                          }`}
                          style={{ width: `${ isOut ? 6 : percentage }%` }}
                        />
                      </div>
                      <Link
                        to="/inventario"
                        className={`text-3xs font-bold shrink-0 hover:underline ${
                          isOut ? "text-rose-700" : "text-orange-700"
                        }`}
                      >
                        Reponer →
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <Link to="/inventario" className="flex-1">
                <Button
                  variant="primary"
                  className="w-full text-xs py-2.5 font-semibold"
                >
                  <PackagePlus className="w-3.5 h-3.5 mr-1.5" />
                  Gestionar Stock
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal Avanzado de Registrar Venta */}
      <RegisterSaleModal
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onSaleRegistered={handleSaleRegistered}
      />
    </div>
  )
}
