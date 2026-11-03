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
  User,
  Smartphone,
  Stethoscope,
  Calculator,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Wrench,
} from "lucide-react"

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("En Reparación")
  const [showEditOrder, setShowEditOrder] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [technicalReport, setTechnicalReport] = useState(
    "Se corroboró el daño severo en el módulo OLED tras caída frontal. Placa lógica y circuito de carga en perfecto estado. Se procede al reemplazo por repuesto original Service Pack.",
  )
  const [partsCost, setPartsCost] = useState(125000)
  const [laborCost, setLaborCost] = useState(35000)
  const [advancePaid, setAdvancePaid] = useState(30000)
  const [budgetStatus, setBudgetStatus] = useState("Aprobado")

  const [orderData, setOrderData] = useState({
    clientName: "Martín Pérez",
    clientDni: "32.456.789",
    clientPhone: "351-555-4321",
    clientEmail: "martin.p@email.com",
    deviceType: "Smartphone",
    device: "Samsung S22 Ultra",
    imei: "354123098765432",
    unlockPin: "Patrón en L / PIN 2580",
    accessories: "Funda de silicona transparente, bandeja SIM",
    issue: "Módulo astillado por caída, el táctil funciona a medias.",
    observations:
      "Rayones leves en los marcos laterales inferiores, ingresa apagado.",
  })

  const totalCost = partsCost + laborCost
  const pendingBalance = Math.max(0, totalCost - advancePaid)

  const showTemporarySuccess = (message: string) => {
    setSuccessMessage(message)
    window.setTimeout(() => setSuccessMessage(""), 3200)
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
          name: orderData.clientName,
          dni: orderData.clientDni,
          phone: orderData.clientPhone,
        },
      },
    })
  }

  const history = [
    {
      date: "24/10/2023 14:30",
      user: "Técnico Alta Cba",
      action: "Actualizó estado a En Reparación",
      note: "Se comenzó a reemplazar el módulo OLED.",
    },
    {
      date: "24/10/2023 10:15",
      user: "Admin",
      action: "Presupuesto Aprobado",
      note: "El cliente aceptó el presupuesto vía WhatsApp.",
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
      note: "Ingresa equipo por mostrador.",
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {successMessage && (
        <div
          className="fixed right-6 bottom-6 z-50 flex items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-900 shadow-lg animate-fadeIn"
          role="status"
        >
          <CheckCircle className="mr-2 h-5 w-5 text-emerald-600 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Encabezado Principal */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3.5">
          <Link
            to="/servicio-tecnico"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors"
            aria-label="Volver a Servicio Técnico"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
                Orden OT-{id || "10452"}
              </h1>
              <Badge variant="orange" className="px-3 py-1 text-xs">
                {status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sucursal Alta Córdoba • Ingresada el 23/10/2023 a las 16:20 hs
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button icon={Edit} onClick={() => setShowEditOrder(true)}>
            Editar Orden
          </Button>
          <Button variant="secondary" icon={Copy} onClick={duplicateOrder}>
            Duplicar / Vinculada
          </Button>
          <Button variant="outline" icon={Printer} className="bg-white">
            Imprimir
          </Button>
          <Button variant="outline" icon={FileText} className="bg-white">
            Generar Remito
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Los 4 Apartados Visuales en Tarjetas Separadas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* APARTADO 1: Datos del Cliente */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#00559D] border border-blue-200/50">
                      <User className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                      1. Datos del Cliente
                    </h2>
                  </div>
                  <Badge variant="blue">Titular</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="block text-2xs uppercase font-bold text-slate-400">
                      Nombre Completo
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {orderData.clientName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        DNI / Documento
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {orderData.clientDni}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        Teléfono
                      </span>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-primary" />
                        {orderData.clientPhone}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{orderData.clientEmail}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* APARTADO 2: Datos del Equipo */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-orange-50 text-[#F56C00] border border-orange-200/50">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                      2. Datos del Equipo
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditOrder(true)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="block text-2xs uppercase font-bold text-slate-400">
                      Marca y Modelo ({orderData.deviceType})
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {orderData.device}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        IMEI / Serie
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {orderData.imei}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        Desbloqueo
                      </span>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-[#F56C00]" />
                        {orderData.unlockPin}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 pt-1">
                    <span className="font-semibold text-slate-700">
                      Accesorios:
                    </span>{" "}
                    {orderData.accessories}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* APARTADO 3: Diagnóstico de Falla */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/50">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                    3. Diagnóstico de Falla
                  </h2>
                  <p className="text-2xs text-slate-400">
                     Comparativa entre falla reportada por el cliente e informe
                    técnico de laboratorio
                  </p>
                </div>
              </div>
              <Badge variant="purple">Laboratorio SAT</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="block text-2xs uppercase font-bold text-slate-500 mb-1">
                  Falla Reportada al Ingresar
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {orderData.issue}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="block text-2xs uppercase font-bold text-slate-500 mb-1">
                  Observaciones Estéticas de Recepción
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {orderData.observations}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="tech-report">
                Informe Técnico y Resolución de Laboratorio
              </Label>
              <textarea
                id="tech-report"
                rows={3}
                value={technicalReport}
                onChange={(e) => setTechnicalReport(e.target.value)}
                className="w-full mt-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </Card>

          {/* APARTADO 4: Costos y Presupuesto */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                    4. Costos y Presupuesto
                  </h2>
                  <p className="text-2xs text-slate-400">
                    Desglose técnico de repuestos, mano de obra y estado del presupuesto
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  budgetStatus === "Aprobado"
                    ? "green"
                    : budgetStatus === "Rechazado"
                      ? "red"
                      : "yellow"
                }
              >
                {budgetStatus === "Aprobado"
                  ? "Presupuesto Aprobado"
                  : budgetStatus === "Rechazado"
                    ? "Presupuesto Rechazado"
                    : "Pendiente de Aprobación"}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Repuesto asignado */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-primary">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">
                      Módulo Display Orig. Samsung S22 Ultra
                    </p>
                    <p className="text-2xs text-slate-500 font-mono">
                      Cód: PRD-002 • Cantidad: 1 un.
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
                  $ {partsCost.toLocaleString("es-AR")}
                </span>
              </div>

              {/* Edición de costos y estado del presupuesto por el técnico */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Costo de Repuestos ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={partsCost}
                    onChange={(e) =>
                      setPartsCost(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="font-mono font-bold"
                  />
                </div>
                <div>
                  <Label>Mano de Obra ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={laborCost}
                    onChange={(e) =>
                      setLaborCost(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="font-mono font-bold"
                  />
                </div>
                <div>
                  <Label>Estado del Presupuesto</Label>
                  <Select
                    value={budgetStatus}
                    onChange={(e) => setBudgetStatus(e.target.value)}
                  >
                    <option value="Pendiente de Aprobación">
                      Pendiente de Aprobación
                    </option>
                    <option value="Aprobado">Aprobado por el Cliente</option>
                    <option value="Rechazado">Rechazado / Sin Cargo</option>
                  </Select>
                </div>
                <div>
                  <Label>Seña / Adelanto Recibido ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={advancePaid}
                    onChange={(e) =>
                      setAdvancePaid(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Resumen financiero */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal Repuestos + Mano de Obra:</span>
                  <span className="font-mono font-bold text-slate-900">
                    $ {totalCost.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-emerald-700 font-medium">
                  <span>Seña abonada por el cliente:</span>
                  <span className="font-mono">
                    - $ {advancePaid.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2.5 border-t border-blue-200">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase">
                    Total a Cobrar en Entrega:
                  </span>
                  <span className="text-xl font-extrabold text-[#00559D] font-mono">
                    $ {pendingBalance.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  onClick={() =>
                    showTemporarySuccess(
                      "Diagnóstico, costos y estado del presupuesto guardados con éxito.",
                    )
                  }
                  className="bg-[#0B2B4C] hover:bg-[#133A63] text-white font-bold"
                >
                  Guardar Diagnóstico y Presupuesto
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna Derecha (1/3): Actualizar Estado e Historial */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-base font-bold text-slate-900 font-heading mb-3.5">
              Actualizar Estado de Orden
            </h2>
            <div className="space-y-3.5">
              <div>
                <Label>Estado Actual</Label>
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
              </div>

              <div>
                <Label>Nota Interna de Seguimiento</Label>
                <textarea
                  placeholder="Agregar observación para el historial..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 shadow-2xs focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none"
                  rows={2}
                />
              </div>

              <Button
                className="w-full font-bold"
                onClick={() =>
                  showTemporarySuccess(
                    `Estado actualizado a "${status}" correctamente.`,
                  )
                }
              >
                Guardar Cambios
              </Button>
            </div>

            {status === "Listo para Entrega" && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button
                  variant="secondary"
                  icon={CreditCard}
                  className="w-full font-bold"
                  onClick={() =>
                    showTemporarySuccess(
                      "Entrega y cobro de saldo registrados con éxito.",
                    )
                  }
                >
                  Registrar Entrega y Cobro
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-base font-bold text-slate-900 font-heading mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#00559D]" />
              Trazabilidad de la Orden
            </h2>
            <div className="relative border-l-2 border-slate-200 ml-2.5 space-y-5">
              {history.map((item, index) => (
                <div key={index} className="pl-5 relative">
                  <div
                    className={`absolute w-3 h-3 rounded-full -left-[7px] top-1 border-2 border-white ${
                      index === 0 ? "bg-[#F56C00]" : "bg-slate-300"
                    }`}
                  />
                  <p className="text-2xs text-slate-400 font-medium">
                    {item.date} • {item.user}
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {item.action}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Edición de Orden */}
      {showEditOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-order-title"
        >
          <Card className="w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between border-b border-slate-100 p-5 bg-slate-50">
              <div>
                <h2
                  id="edit-order-title"
                  className="text-base font-bold text-slate-900 font-heading"
                >
                  Editar datos de la orden
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
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
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              <div className="flex justify-end gap-2 border-t border-slate-100 p-5 bg-slate-50/50">
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
