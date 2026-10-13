import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  MoreVertical,
  TrendingUp,
  Wrench,
} from "lucide-react"
import StatusBadge from "../components/StatusBadge"
import { Alert, Button, Card, Loading } from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"
import { API_URL, api, money, queryString } from "../services/api"
import type { OrderStatus } from "../types"

type DashboardData = {
  stats: {
    todaySales: number
    pendingOrders: number
    readyOrders: number
    stockAlerts: number
  }
  recentOrders: {
    id: string
    number: string
    client: string
    device: string
    status: OrderStatus
    statusLabel: string
  }[]
  stockAlerts: {
    id: string
    name: string
    minStock: number
    stock: number
  }[]
}

export default function Dashboard() {
  const { branchId } = useBranch()
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState("")
  useEffect(() => {
    setError("")
    api<DashboardData>(`/dashboard${queryString({ branchId })}`)
      .then(setData)
      .catch((reason) => setError(reason.message))
  }, [branchId])

  const stats = data
    ? [
        {
          name: "Ventas de hoy",
          value: money(data.stats.todaySales),
          icon: TrendingUp,
          color: "text-blue-600",
          bg: "bg-blue-100",
        },
        {
          name: "Órdenes pendientes",
          value: String(data.stats.pendingOrders),
          icon: Wrench,
          color: "text-orange-600",
          bg: "bg-orange-100",
        },
        {
          name: "Reparaciones listas",
          value: String(data.stats.readyOrders),
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-100",
        },
        {
          name: "Alertas de stock",
          value: String(data.stats.stockAlerts),
          icon: AlertTriangle,
          color: "text-red-600",
          bg: "bg-red-100",
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Panel General</h1>
        <div className="flex gap-3">
          {user?.role === "ADMIN" && (
            <a
              href={`${API_URL}/reports/sales.csv${queryString({ branchId })}`}
            >
              <Button variant="outline">Descargar reporte</Button>
            </a>
          )}
          {user?.role !== "TECH" && (
            <Link to="/servicio-tecnico/nueva">
              <Button>Nueva orden</Button>
            </Link>
          )}
        </div>
      </div>
      {error && <Alert>{error}</Alert>}
      {!data ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Card key={item.name} className="p-5 flex items-center">
                <div className={`p-3 rounded-lg ${item.bg}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    {item.name}
                  </p>
                  <h3 className="text-xl font-bold">{item.value}</h3>
                </div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <div className="px-5 py-4 border-b flex justify-between">
                <h2 className="text-lg font-medium">
                  Últimas órdenes de trabajo
                </h2>
                <Link
                  to="/servicio-tecnico"
                  className="text-sm font-medium text-primary flex items-center"
                >
                  Ver todas <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Orden", "Cliente", "Equipo", "Estado", "Acción"].map(
                        (head) => (
                          <th
                            key={head}
                            className="px-5 py-3 text-left text-xs text-gray-500 uppercase"
                          >
                            {head}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-5 py-4 text-sm font-medium text-primary">
                          OT-{order.number}
                        </td>
                        <td className="px-5 py-4 text-sm">{order.client}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {order.device}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge
                            status={order.status}
                            label={order.statusLabel}
                          />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            aria-label={`Ver orden ${order.number}`}
                            to={`/servicio-tecnico/${order.id}`}
                          >
                            <MoreVertical className="w-5 h-5 inline text-gray-400" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <div className="px-5 py-4 border-b">
                <h2 className="text-lg font-medium">Alertas de stock</h2>
              </div>
              <ul className="p-5 space-y-4">
                {data.stockAlerts.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <div className="flex">
                      <AlertTriangle
                        className={`w-4 h-4 mt-1 ${
                          item.stock === 0 ? "text-red-500" : "text-orange-500"
                        }`}
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Mínimo sugerido: {item.minStock}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold">{item.stock} un.</span>
                  </li>
                ))}
              </ul>
              <div className="px-5 pb-5">
                <Link to="/inventario">
                  <Button variant="outline" className="w-full">
                    Ir al inventario
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
