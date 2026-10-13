import { useCallback, useEffect, useState } from "react"
import { Eye, Plus, Search } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import StatusBadge from "../components/StatusBadge"
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Input,
  Loading,
  Select,
} from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"
import { api, queryString, shortDate } from "../services/api"
import type { ServiceOrder } from "../types"

export default function ServiceList() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const { branchId } = useBranch()
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      setOrders(
        (
          await api<{ data: ServiceOrder[] }>(
            `/orders${queryString({ branchId, search, status })}`,
          )
        ).data,
      )
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudieron cargar las órdenes",
      )
    } finally {
      setLoading(false)
    }
  }, [branchId, search, status])
  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "")
  }, [searchParams])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Servicio Técnico</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de órdenes de trabajo (SAT).
          </p>
        </div>
        {user?.role !== "TECH" && (
          <Link to="/servicio-tecnico/nueva">
            <Button icon={Plus}>Nueva orden</Button>
          </Link>
        )}
      </div>
      {error && <Alert>{error}</Alert>}
      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              aria-label="Buscar órdenes"
              className="pl-10"
              placeholder="Cliente, equipo o número de orden…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            aria-label="Filtrar estado"
            className="sm:w-56"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="INGRESADO">Ingresado</option>
            <option value="EN_DIAGNOSTICO">En diagnóstico</option>
            <option value="ESPERANDO_APROBACION">Esperando aprobación</option>
            <option value="EN_REPARACION">En reparación</option>
            <option value="LISTO_ENTREGA">Listo para entrega</option>
            <option value="SIN_SOLUCION">Sin solución</option>
            <option value="ENTREGADO">Entregado</option>
          </Select>
        </div>
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          <EmptyState>No se encontraron órdenes.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Orden / Fecha",
                    "Cliente",
                    "Equipo / Falla",
                    "Sucursal",
                    "Estado",
                    "Acciones",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs text-gray-500 uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary text-sm">
                        OT-{order.number}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shortDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{order.client}</div>
                      <div className="text-xs text-gray-500">
                        DNI: {order.dni || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{order.device}</div>
                      <div className="text-xs text-gray-500 max-w-52 truncate">
                        {order.issue}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.branch}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={order.status}
                        label={order.statusLabel}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/servicio-tecnico/${order.id}`}>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-primary"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
