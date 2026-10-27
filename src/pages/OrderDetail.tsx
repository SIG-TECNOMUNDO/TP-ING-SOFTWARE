import React, { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, Button, Badge, Select, Input, Label } from "../components/ui"
import {
  ArrowLeft,
  Edit,
  Clock,
  Printer,
  FileText,
  Copy,
  X,
  CheckCircle,
} from "lucide-react"

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("En Reparación")
  const [showEditOrder, setShowEditOrder] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [orderData, setOrderData] = useState({
    device: "Samsung S22 Ultra",
    imei: "354123098765432",
    issue: "Módulo astillado por caída, el táctil funciona a medias.",
    observations:
      "Rayones en los marcos laterales, ingresa con funda de silicona transparente.",
  })

  const showTemporarySuccess = (message: string) => {
    setSuccessMessage(message)
    window.setTimeout(() => setSuccessMessage(""), 3000)
  }

  const saveOrderChanges = (event: React.FormEvent) => {
    event.preventDefault()
    setShowEditOrder(false)
    showTemporarySuccess("Los datos de la orden se actualizaron correctamente.")
  }

  const duplicateOrder = () => {
    navigate("/servicio-tecnico/nueva", {
      state: {
        linkedOrder: `OT-${id || "10452"}`,
        client: {
          name: "Martín Pérez",
          dni: "32.456.789",
          phone: "351-555-4321",
        },
      },
    })
  }

  const history = [
    {
      date: "24/10/2023 14:30",
      user: "Técnico Alta Cba",
      action: "Actualizó estado a En Reparación",
      note: "Se comenzó a reemplazar el módulo.",
    },
    {
      date: "24/10/2023 10:15",
      user: "Admin",
      action: "Presupuesto Aprobado",
      note: "El cliente aceptó el presupuesto por teléfono.",
    },
    {
      date: "23/10/2023 18:45",
      user: "Técnico Alta Cba",
      action: "Diagnóstico Completado",
      note: "Módulo dañado severamente, placa intacta. Requiere cambio de módulo.",
    },
    {
      date: "23/10/2023 16:20",
      user: "Ventas Alta Cba",
      action: "Orden Creada",
      note: "Ingresa equipo.",
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {successMessage && (
        <div
          className="fixed right-6 top-6 z-50 flex items-center rounded-lg border border-green-200 bg-white px-4 py-3 text-sm font-medium text-green-800 shadow-lg"
          role="status"
        >
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          {successMessage}
        </div>
      )}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/servicio-tecnico"
            className="text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Orden OT-{id || "10452"}
          </h1>
          <Badge variant="orange" className="ml-2 px-3 py-1 text-sm">
            {status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={Edit} onClick={() => setShowEditOrder(true)}>
            Editar Orden
          </Button>
          <Button variant="secondary" icon={Copy} onClick={duplicateOrder}>
            Duplicar / Nueva Orden Vinculada
          </Button>
          <Button variant="outline" icon={Printer}>
            Imprimir
          </Button>
          <Button variant="outline" icon={FileText}>
            Generar Remito
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Información del Equipo
              </h2>
              <Button variant="ghost" className="text-sm p-1">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">Martín Pérez</p>
                <p className="text-sm">32.456.789 | 351-555-4321</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Equipo</p>
                <p className="font-medium">{orderData.device}</p>
                <p className="text-sm">IMEI: {orderData.imei}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Falla Reportada</p>
                <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                  {orderData.issue}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">
                  Observaciones al Ingreso
                </p>
                <p className="text-sm mt-1">
                  {orderData.observations}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-3 mb-4">
              Diagnóstico y Presupuesto
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Informe Técnico
                </p>
                <textarea
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-primary focus:border-primary border"
                  rows={3}
                  defaultValue="Se corroboró el daño en el módulo. No hay daños internos en la placa base."
                />
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-900">
                    Estado del Presupuesto
                  </span>
                  <Badge variant="green">Aprobado</Badge>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Costo de Repuestos:</span>
                  <span>$ 125.000</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Mano de Obra:</span>
                  <span>$ 35.000</span>
                </div>
                <div className="flex justify-between font-bold text-base mt-3 pt-2 border-t border-blue-200">
                  <span>Total a Cobrar:</span>
                  <span>$ 160.000</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-3 mb-4">
              Repuestos Utilizados
            </h2>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200">
              <div>
                <p className="font-medium text-sm">
                  Módulo Display Orig. Samsung S22 Ultra
                </p>
                <p className="text-xs text-gray-500">
                  Cód: PRD-002 • Cantidad: 1
                </p>
              </div>
              <div className="font-medium text-sm">$ 125.000</div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-3 text-sm"
              icon={Edit}
            >
              Agregar o Modificar Repuestos
            </Button>
          </Card>
        </div>

        {/* Right Column: Actions & History */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Actualizar Estado
            </h2>
            <div className="space-y-4">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full"
              >
                <option value="Ingresado">Ingresado</option>
                <option value="En Diagnóstico">En Diagnóstico</option>
                <option value="Esperando Aprobación">
                  Esperando Aprobación
                </option>
                <option value="En Reparación">En Reparación</option>
                <option value="Listo para Entrega">Listo para Entrega</option>
                <option value="Sin Solución">Sin Solución</option>
                <option value="Entregado">Entregado</option>
              </Select>

              <textarea
                placeholder="Agregar una nota interna (opcional)..."
                className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-primary focus:border-primary border"
                rows={2}
              ></textarea>

              <Button
                className="w-full"
                onClick={() =>
                  showTemporarySuccess(
                    `Estado actualizado a “${status}” correctamente.`,
                  )
                }
              >
                Guardar Cambios
              </Button>
            </div>

            {status === "Listo para Entrega" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="secondary" className="w-full">
                  Registrar Entrega y Cobro
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              Historial
            </h2>
            <div className="relative border-l border-gray-200 ml-3 space-y-6">
              {history.map((item, index) => (
                <div key={index} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[6.5px] top-1.5 border-2 border-white"></div>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.date} • {item.user}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {item.action}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-sm">
                Ver historial completo
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showEditOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-order-title"
        >
          <Card className="w-full max-w-2xl shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 p-5">
              <div>
                <h2
                  id="edit-order-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Editar datos de la orden
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Modificá la información inicial del equipo y la falla
                  reportada.
                </p>
              </div>
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => setShowEditOrder(false)}
                aria-label="Cerrar edición de orden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={saveOrderChanges}>
              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="edit-device">Equipo</Label>
                  <Input
                    id="edit-device"
                    value={orderData.device}
                    onChange={(event) =>
                      setOrderData((current) => ({
                        ...current,
                        device: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-imei">IMEI / Número de serie</Label>
                  <Input
                    id="edit-imei"
                    value={orderData.imei}
                    onChange={(event) =>
                      setOrderData((current) => ({
                        ...current,
                        imei: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-issue">Falla Reportada</Label>
                  <textarea
                    id="edit-issue"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                    value={orderData.issue}
                    onChange={(event) =>
                      setOrderData((current) => ({
                        ...current,
                        issue: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-observations">
                    Observaciones al Ingreso
                  </Label>
                  <textarea
                    id="edit-observations"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                    value={orderData.observations}
                    onChange={(event) =>
                      setOrderData((current) => ({
                        ...current,
                        observations: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-200 p-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditOrder(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Orden</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}


