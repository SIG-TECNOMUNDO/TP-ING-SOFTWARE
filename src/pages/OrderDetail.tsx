import { useCallback, useEffect, useMemo, useState } from "react"
import { ArrowLeft, Clock, FileText, Plus, Printer, Save } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import StatusBadge from "../components/StatusBadge"
import {
  Alert,
  Button,
  Card,
  Input,
  Label,
  Loading,
  Select,
} from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { api, dateTime, money, queryString } from "../services/api"
import type { OrderStatus, Product } from "../types"

const labels: Record<OrderStatus, string> = {
  INGRESADO: "Ingresado",
  EN_DIAGNOSTICO: "En Diagnóstico",
  ESPERANDO_APROBACION: "Esperando Aprobación",
  EN_REPARACION: "En Reparación",
  LISTO_ENTREGA: "Listo para Entrega",
  SIN_SOLUCION: "Sin Solución",
  ENTREGADO: "Entregado",
}
type Detail = {
  id: string
  number: string
  branch_id: string
  branch_name: string
  client_name: string
  dni: string | null
  phone: string
  email: string | null
  device_type: string
  brand: string
  model: string
  serial_imei: string | null
  reported_issue: string
  physical_condition: string | null
  accessories: string | null
  diagnosis: string | null
  labor_cost: string
  budget_status: string
  status: OrderStatus
  statusLabel: string
  history: {
    id: string
    from_status: OrderStatus | null
    to_status: OrderStatus
    note: string | null
    created_at: string
    user_name: string
  }[]
  parts: {
    id: string
    code: string
    name: string
    quantity: number
    unit_price: number
  }[]
}

export default function OrderDetail() {
  const { id = "" } = useParams()
  const { user } = useAuth()
  const canEdit = user?.role === "ADMIN" || user?.role === "TECH"
  const [order, setOrder] = useState<Detail | null>(null)
  const [status, setStatus] = useState<OrderStatus>("INGRESADO")
  const [note, setNote] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [laborCost, setLaborCost] = useState("0")
  const [products, setProducts] = useState<Product[]>([])
  const [partId, setPartId] = useState("")
  const [partQuantity, setPartQuantity] = useState("1")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const load = useCallback(async () => {
    try {
      const result = await api<{ data: Detail }>(`/orders/${id}`)
      setOrder(result.data)
      setStatus(result.data.status)
      setDiagnosis(result.data.diagnosis ?? "")
      setLaborCost(String(result.data.labor_cost ?? 0))
      if (canEdit)
        api<{ data: Product[] }>(
          `/products${queryString({ branchId: result.data.branch_id })}`,
        )
          .then((items) => setProducts(items.data))
          .catch(() => undefined)
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "No se pudo cargar la orden",
      )
    }
  }, [id, canEdit])
  useEffect(() => {
    load()
  }, [load])
  const partsTotal = useMemo(
    () =>
      order?.parts.reduce(
        (sum, part) => sum + part.unit_price * part.quantity,
        0,
      ) ?? 0,
    [order],
  )
  const updateStatus = async () => {
    setError("")
    setMessage("")
    try {
      await api(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      })
      setNote("")
      setMessage("Estado actualizado correctamente")
      await load()
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "No se pudo actualizar",
      )
    }
  }
  const saveDiagnosis = async () => {
    try {
      await api(`/orders/${id}/diagnosis`, {
        method: "PATCH",
        body: JSON.stringify({ diagnosis, laborCost: Number(laborCost) }),
      })
      setMessage("Diagnóstico guardado")
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar")
    }
  }
  const addPart = async () => {
    if (!partId) return
    try {
      await api(`/orders/${id}/parts`, {
        method: "POST",
        body: JSON.stringify({
          productId: partId,
          quantity: Number(partQuantity),
        }),
      })
      setPartId("")
      setMessage("Repuesto asignado y stock actualizado")
      await load()
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo asignar el repuesto",
      )
    }
  }
  const registerPayment = async () => {
    try {
      await api(`/orders/${id}/payment`, {
        method: "POST",
        body: JSON.stringify({ method: "efectivo", installments: 1 }),
      })
      setMessage("Cobro registrado")
      if (status !== "ENTREGADO") {
        setStatus("ENTREGADO")
        await api(`/orders/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "ENTREGADO",
            note: "Equipo entregado y cobrado",
          }),
        })
      }
      await load()
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo registrar el cobro",
      )
    }
  }

  if (!order && !error) return <Loading label="Cargando orden…" />
  if (!order) return <Alert>{error}</Alert>
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link to="/servicio-tecnico" aria-label="Volver">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Orden OT-{order.number}</h1>
          <StatusBadge status={order.status} label={order.statusLabel} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={Printer}
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
          <Button
            variant="outline"
            icon={FileText}
            onClick={() => window.print()}
          >
            Generar remito
          </Button>
        </div>
      </div>
      {error && <Alert>{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h2 className="text-lg font-medium border-b pb-3 mb-4">
              Información del equipo
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">{order.client_name}</p>
                <p className="text-sm">
                  {order.dni || "Sin DNI"} · {order.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Equipo</p>
                <p className="font-medium">
                  {order.brand} {order.model}
                </p>
                <p className="text-sm">
                  {order.serial_imei || "Sin número de serie"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Falla reportada</p>
                <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                  {order.reported_issue}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">
                  Observaciones al ingreso
                </p>
                <p className="text-sm mt-1">
                  {order.physical_condition || "Sin observaciones"}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-medium border-b pb-3 mb-4">
              Diagnóstico y presupuesto
            </h2>
            <Label htmlFor="diagnosis">Informe técnico</Label>
            <textarea
              id="diagnosis"
              disabled={!canEdit}
              rows={3}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full mt-1 border rounded-md p-2 text-sm disabled:bg-gray-50"
            />
            <div className="mt-3">
              <Label htmlFor="laborCost">Mano de obra</Label>
              <Input
                id="laborCost"
                disabled={!canEdit}
                type="number"
                min="0"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
              />
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mt-4">
              <div className="flex justify-between text-sm">
                <span>Repuestos:</span>
                <span>{money(partsTotal)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Mano de obra:</span>
                <span>{money(Number(laborCost))}</span>
              </div>
              <div className="flex justify-between font-bold mt-3 pt-2 border-t">
                <span>Total:</span>
                <span>{money(partsTotal + Number(laborCost))}</span>
              </div>
            </div>
            {canEdit && (
              <Button className="mt-3" icon={Save} onClick={saveDiagnosis}>
                Guardar diagnóstico
              </Button>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-medium border-b pb-3 mb-4">
              Repuestos utilizados
            </h2>
            {order.parts.length ? (
              order.parts.map((part) => (
                <div
                  key={part.id}
                  className="flex justify-between bg-gray-50 p-3 rounded mb-2"
                >
                  <div>
                    <p className="font-medium text-sm">{part.name}</p>
                    <p className="text-xs text-gray-500">
                      {part.code} · Cantidad: {part.quantity}
                    </p>
                  </div>
                  <div className="font-medium text-sm">
                    {money(part.unit_price * part.quantity)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No hay repuestos asignados.
              </p>
            )}
            {canEdit && (
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <Select
                  aria-label="Repuesto"
                  value={partId}
                  onChange={(e) => setPartId(e.target.value)}
                >
                  <option value="">Seleccionar repuesto…</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
                <Input
                  aria-label="Cantidad"
                  className="sm:w-24"
                  type="number"
                  min="1"
                  value={partQuantity}
                  onChange={(e) => setPartQuantity(e.target.value)}
                />
                <Button icon={Plus} onClick={addPart}>
                  Agregar
                </Button>
              </div>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          {canEdit && (
            <Card className="p-5">
              <h2 className="text-lg font-medium mb-4">Actualizar estado</h2>
              <div className="space-y-4">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                >
                  {Object.entries(labels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nota interna…"
                  className="w-full border rounded-md p-2 text-sm"
                  rows={2}
                />
                <Button className="w-full" onClick={updateStatus}>
                  Guardar cambios
                </Button>
                {order.status === "LISTO_ENTREGA" && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={registerPayment}
                  >
                    Registrar entrega y cobro
                  </Button>
                )}
              </div>
            </Card>
          )}
          <Card className="p-5">
            <h2 className="text-lg font-medium mb-4 flex">
              <Clock className="w-5 h-5 mr-2" />
              Historial
            </h2>
            <div className="border-l ml-3 space-y-6">
              {order.history.map((item) => (
                <div key={item.id} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[6.5px] top-1.5 border-2 border-white" />
                  <p className="text-xs text-gray-500">
                    {dateTime(item.created_at)} · {item.user_name}
                  </p>
                  <p className="text-sm font-semibold">
                    {labels[item.to_status]}
                  </p>
                  {item.note && (
                    <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
