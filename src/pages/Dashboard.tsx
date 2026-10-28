import React from "react"
import { Card, Badge, Button } from "../components/ui"
import {
  TrendingUp,
  Wrench,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MoreVertical,
} from "lucide-react"
import { Link } from "react-router-dom"

const stats = [
  {
    name: "Ventas de hoy",
    value: "$ 1.240.500",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    name: "Órdenes Pendientes",
    value: "24",
    icon: Wrench,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  {
    name: "Reparaciones Listas",
    value: "12",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    name: "Alertas de Stock",
    value: "8",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-100",
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Panel General</h1>
        <div className="flex space-x-3">
          <Button variant="outline">Descargar Reporte</Button>
          <Link to="/servicio-tecnico/nueva">
            <Button>Nueva Orden</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name} className="p-5 flex items-center">
            <div className={`p-3 rounded-lg ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{item.name}</p>
              <h3 className="text-xl font-bold text-gray-900">{item.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Últimas Órdenes de Trabajo
            </h2>
            <Link
              to="/servicio-tecnico"
              className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
            >
              Ver todas <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.client}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.device}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/servicio-tecnico/${order.id.replace("OT-", "")}`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="w-5 h-5 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity / Alerts */}
        <Card className="flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Alertas de Stock
            </h2>
          </div>
          <div className="p-5 flex-1">
            <ul className="space-y-4">
              {[
                { product: "Módulo Display iPhone 11", stock: 2, limit: 5 },
                { product: "Batería Samsung S20", stock: 1, limit: 3 },
                { product: "Funda Silicona Moto G52", stock: 0, limit: 10 },
                { product: "Pin de Carga Tipo C", stock: 4, limit: 20 },
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="mt-1">
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          item.stock === 0 ? "text-red-500" : "text-orange-500"
                        }`}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product}
                      </p>
                      <p className="text-xs text-gray-500">
                        Mínimo sugerido: {item.limit}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.stock === 0 ? "red" : "orange"}>
                    {item.stock} un.
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                Ir al Inventario
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
