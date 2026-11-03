import React from "react"
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
} from "lucide-react"
import { Link } from "react-router-dom"

const stats = [
  {
    name: "Ventas de hoy",
    value: "$ 1.240.500",
    icon: TrendingUp,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40",
  },
  {
    name: "Órdenes Pendientes",
    value: "24",
    icon: Wrench,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/60 border border-orange-200/50 dark:border-orange-800/40",
  },
  {
    name: "Reparaciones Listas",
    value: "12",
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40",
  },
  {
    name: "Alertas de Stock",
    value: "8",
    icon: AlertTriangle,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/60 border border-rose-200/50 dark:border-rose-800/40",
  },
]

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
  return (
    <div className="space-y-6">
      {/* Encabezado responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            Panel General
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Resumen en tiempo real del estado de tu sucursal
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Button variant="outline" className="text-xs py-2 px-3 sm:px-4 sm:py-2.5">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Descargar Reporte
          </Button>
          <Link to="/servicio-tecnico/nueva" className="flex-1 sm:flex-initial">
            <Button className="w-full text-xs py-2 px-3 sm:px-4 sm:py-2.5">
              <Plus className="w-4 h-4 mr-1.5" />
              Nueva Orden
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid de Métricas / Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item) => (
          <Card
            key={item.name}
            className="p-4 sm:p-5 flex items-center hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-2xl ${item.bg} shrink-0`}>
              <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
            </div>
            <div className="ml-4 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                {item.name}
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate font-heading mt-0.5">
                {item.value}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Órdenes Recientes */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                Últimas Órdenes de Trabajo
              </h2>
              <p className="text-2xs sm:text-xs text-slate-400 dark:text-slate-500">
                Seguimiento de reparaciones activas
              </p>
            </div>
            <Link
              to="/servicio-tecnico"
              className="text-xs font-semibold text-primary dark:text-blue-400 hover:text-primary-dark flex items-center group"
            >
              Ver todas{" "}
              <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/80">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 sm:px-5 py-3 text-right text-2xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs font-bold text-primary dark:text-blue-400">
                      {order.id}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs font-medium text-slate-900 dark:text-slate-200">
                      {order.client}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {order.device}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                      <Link
                        to={`/servicio-tecnico/${order.id.replace("OT-", "")}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-block transition-colors"
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
        </Card>

        {/* Alertas de Stock */}
        <Card className="flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
              Alertas de Stock
            </h2>
            <p className="text-2xs sm:text-xs text-slate-400 dark:text-slate-500">
              Artículos por debajo del punto de reorden
            </p>
          </div>
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <ul className="space-y-3.5">
              {[
                { product: "Módulo Display iPhone 11", stock: 2, limit: 5 },
                { product: "Batería Samsung S20", stock: 1, limit: 3 },
                { product: "Funda Silicona Moto G52", stock: 0, limit: 10 },
                { product: "Pin de Carga Tipo C", stock: 4, limit: 20 },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60"
                >
                  <div className="flex items-start min-w-0 mr-2">
                    <div className="mt-0.5 shrink-0">
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          item.stock === 0
                            ? "text-rose-500 dark:text-rose-400"
                            : "text-amber-500 dark:text-amber-400"
                        }`}
                      />
                    </div>
                    <div className="ml-2.5 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.product}
                      </p>
                      <p className="text-3xs sm:text-2xs text-slate-400 dark:text-slate-500">
                        Mínimo sugerido: {item.limit} un.
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.stock === 0 ? "red" : "orange"} className="shrink-0 text-3xs sm:text-xs">
                    {item.stock} un.
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <Link to="/inventario">
                <Button variant="outline" className="w-full text-xs py-2">
                  Gestionar Inventario
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
