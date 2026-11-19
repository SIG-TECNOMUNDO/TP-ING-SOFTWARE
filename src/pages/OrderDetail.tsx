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
  Check,
  ChevronDown,
  MapPin,
} from "lucide-react"

interface OrderFullData {
  clientName: string
  clientDni: string
  clientPhone: string
  clientEmail: string
  deviceType: string
  device: string
  imei: string
  unlockPin: string
  accessories: string
  issue: string
  observations: string
  technicalReport: string
  branch: string
  priority: string
  partsCost: number
  laborCost: number
  advancePaid: number
  budgetStatus: string
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState("En Reparación")
  const [isEditingOrder, setIsEditingOrder] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Bloques verticales de la columna izquierda (abiertos por defecto para lectura rápida)
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  })

  const [orderData, setOrderData] = useState<OrderFullData>({
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
    technicalReport:
      "Se corroboró el daño severo en el módulo OLED tras caída frontal. Placa lógica y circuito de carga en perfecto estado. Se procede al reemplazo por repuesto original Service Pack.",
    branch: "Alta Córdoba",
    priority: "Normal (48-72 hs)",
    partsCost: 125000,
    laborCost: 35000,
    advancePaid: 30000,
    budgetStatus: "Aprobado",
  })

  // Copia temporal para el Modo Edición General (permite Cancelar sin perder datos originales)
  const [draftData, setDraftData] = useState<OrderFullData>(orderData)

  const activeData = isEditingOrder ? draftData : orderData
  const totalCost = activeData.partsCost + activeData.laborCost
  const pendingBalance = Math.max(0, totalCost - activeData.advancePaid)

  const toggleSection = (section: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const showTemporarySuccess = (message: string) => {
    setSuccessMessage(message)
    window.setTimeout(() => setSuccessMessage(""), 3200)
  }

  const startGeneralEdit = () => {
    setDraftData(orderData)
    setOpenSections({ 1: true, 2: true, 3: true, 4: true })
    setIsEditingOrder(true)
  }

  const cancelGeneralEdit = () => {
    setDraftData(orderData)
    setIsEditingOrder(false)
  }

  const saveGeneralEdit = (event?: React.FormEvent) => {
    if (event) event.preventDefault()
    setOrderData(draftData)
    setIsEditingOrder(false)
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

      {/* Encabezado Principal con Edición General unificada */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3.5">
          <Link
            to="/servicio-tecnico"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            aria-label="Volver a Servicio Técnico"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
                Orden OT-{id || "10452"}
              </h1>
              <Badge variant="orange" className="px-3 py-1 text-xs">
                {status}
              </Badge>
              {isEditingOrder && (
                <Badge variant="blue" className="px-3 py-1 text-xs">
                  Modo Edición General
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sucursal {orderData.branch} • Ingresada el 23/10/2023 a las 16:20
              hs
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditingOrder ? (
            <>
              <Button
                type="button"
                icon={Check}
                onClick={() => saveGeneralEdit()}
                className="font-bold shadow-sm"
              >
                Guardar Cambios
              </Button>
              <Button
                type="button"
                variant="outline"
                icon={X}
                onClick={cancelGeneralEdit}
                className="bg-white font-semibold"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              type="button"
              icon={Edit}
              onClick={startGeneralEdit}
              className="font-bold"
            >
              Editar Orden
            </Button>
          )}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Columna Izquierda (2/3): Formato vertical limpio (01 a 04) + Modo Lectura / Modo Edición General */}
        <form
          onSubmit={saveGeneralEdit}
          className="lg:col-span-2 space-y-4"
        >
          {/* 01 · Datos del Cliente */}
          <Card className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(1)}
              aria-expanded={openSections[1]}
              className="w-full p-5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-[#00559D] border border-blue-200/50 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant="blue">01</Badge>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      01 · Datos del Cliente
                    </h2>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Titular de la orden y medios de contacto
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <Badge variant="blue">Titular</Badge>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    openSections[1] ? "rotate-180 text-slate-700" : ""
                  }`}
                />
              </div>
            </button>

            {openSections[1] && (
              <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100">
                {isEditingOrder ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div className="sm:col-span-2">
                      <Label>Nombre Completo *</Label>
                      <Input
                        required
                        value={draftData.clientName}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            clientName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>DNI / Documento</Label>
                      <Input
                        value={draftData.clientDni}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            clientDni: e.target.value,
                          }))
                        }
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label>Teléfono / WhatsApp *</Label>
                      <Input
                        required
                        value={draftData.clientPhone}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            clientPhone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Correo Electrónico</Label>
                      <Input
                        type="email"
                        value={draftData.clientEmail}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            clientEmail: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        Nombre Completo
                      </span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        {orderData.clientName}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        DNI / Documento
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-800 mt-0.5 block">
                        {orderData.clientDni}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        Teléfono
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                        {orderData.clientPhone}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        Email
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {orderData.clientEmail}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* 02 · Datos del Equipo */}
          <Card className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(2)}
              aria-expanded={openSections[2]}
              className="w-full p-5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-2xl bg-orange-50 text-[#F56C00] border border-orange-200/50 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant="orange">02</Badge>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      02 · Datos del Equipo
                    </h2>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Identificación del dispositivo, serie, seguridad y
                    accesorios
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <Badge variant="orange">{activeData.deviceType}</Badge>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    openSections[2] ? "rotate-180 text-slate-700" : ""
                  }`}
                />
              </div>
            </button>

            {openSections[2] && (
              <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100">
                {isEditingOrder ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <Label>Tipo de Equipo</Label>
                      <Select
                        value={draftData.deviceType}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            deviceType: e.target.value,
                          }))
                        }
                      >
                        <option value="Smartphone">Smartphone</option>
                        <option value="Tablet">Tablet / iPad</option>
                        <option value="Notebook">Notebook / MacBook</option>
                        <option value="PC">PC de Escritorio</option>
                        <option value="Consola">Consola</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Marca y Modelo *</Label>
                      <Input
                        required
                        value={draftData.device}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            device: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>IMEI / Número de Serie</Label>
                      <Input
                        value={draftData.imei}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            imei: e.target.value,
                          }))
                        }
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label>PIN / Patrón de Desbloqueo</Label>
                      <Input
                        value={draftData.unlockPin}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            unlockPin: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Accesorios Ingresados</Label>
                      <Input
                        value={draftData.accessories}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            accessories: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        Tipo, Marca y Modelo
                      </span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        {orderData.device}{" "}
                        <span className="text-xs font-medium text-slate-500">
                          ({orderData.deviceType})
                        </span>
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        IMEI / Serie
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-800 mt-0.5 block">
                        {orderData.imei}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        PIN / Patrón de Desbloqueo
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#F56C00] shrink-0" />
                        {orderData.unlockPin}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-2xs uppercase font-bold text-slate-400">
                        Accesorios Ingresados
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5 block">
                        {orderData.accessories}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* 03 · Diagnóstico de Falla e Informe Técnico */}
          <Card className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(3)}
              aria-expanded={openSections[3]}
              className="w-full p-5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/50 shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant="purple">03</Badge>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      03 · Diagnóstico de Falla e Informe Técnico
                    </h2>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Comparativa entre falla reportada por el cliente e informe
                    técnico de laboratorio
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <Badge variant="purple">Laboratorio SAT</Badge>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    openSections[3] ? "rotate-180 text-slate-700" : ""
                  }`}
                />
              </div>
            </button>

            {openSections[3] && (
              <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100 space-y-4">
                {isEditingOrder ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-issue">
                        Falla Reportada al Ingresar *
                      </Label>
                      <textarea
                        id="edit-issue"
                        required
                        rows={2}
                        value={draftData.issue}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            issue: e.target.value,
                          }))
                        }
                        className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-observations">
                        Observaciones Estéticas de Recepción
                      </Label>
                      <textarea
                        id="edit-observations"
                        rows={2}
                        value={draftData.observations}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            observations: e.target.value,
                          }))
                        }
                        className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tech-report">
                        Informe Técnico y Resolución de Laboratorio
                      </Label>
                      <textarea
                        id="tech-report"
                        rows={3}
                        value={draftData.technicalReport}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            technicalReport: e.target.value,
                          }))
                        }
                        className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <span className="block text-2xs uppercase font-bold text-slate-500 mb-1">
                          Falla Reportada al Ingresar
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                          {orderData.issue}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <span className="block text-2xs uppercase font-bold text-slate-500 mb-1">
                          Observaciones Estéticas de Recepción
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {orderData.observations}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/70">
                      <span className="block text-2xs uppercase font-bold text-purple-800 mb-1">
                        Informe Técnico y Resolución de Laboratorio
                      </span>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {orderData.technicalReport}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* 04 · Condiciones, Costos y Seña */}
          <Card className="overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection(4)}
              aria-expanded={openSections[4]}
              className="w-full p-5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/50 shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant="green">04</Badge>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      04 · Condiciones, Costos y Seña
                    </h2>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Sucursal, prioridad, repuestos asignados, mano de obra y
                    saldo pendiente
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <Badge
                  variant={
                    activeData.budgetStatus === "Aprobado"
                      ? "green"
                      : activeData.budgetStatus === "Rechazado"
                        ? "red"
                        : "yellow"
                  }
                >
                  {activeData.budgetStatus === "Aprobado"
                    ? "Presupuesto Aprobado"
                    : activeData.budgetStatus === "Rechazado"
                      ? "Presupuesto Rechazado"
                      : "Pendiente de Aprobación"}
                </Badge>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                    openSections[4] ? "rotate-180 text-slate-700" : ""
                  }`}
                />
              </div>
            </button>

            {openSections[4] && (
              <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100 space-y-4">
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
                    $ {activeData.partsCost.toLocaleString("es-AR")}
                  </span>
                </div>

                {isEditingOrder ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                      <Label>Sucursal Receptora</Label>
                      <Select
                        value={draftData.branch}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            branch: e.target.value,
                          }))
                        }
                      >
                        <option value="Yofre Norte">Yofre Norte</option>
                        <option value="Alta Córdoba">Alta Córdoba</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Prioridad</Label>
                      <Select
                        value={draftData.priority}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            priority: e.target.value,
                          }))
                        }
                      >
                        <option value="Normal (48-72 hs)">
                          Normal (48-72 hs)
                        </option>
                        <option value="Alta / Express (24 hs)">
                          Alta / Express (24 hs)
                        </option>
                        <option value="Reingreso por Garantía">
                          Reingreso por Garantía
                        </option>
                      </Select>
                    </div>
                    <div>
                      <Label>Costo de Repuestos ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={draftData.partsCost}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            partsCost: Math.max(0, Number(e.target.value) || 0),
                          }))
                        }
                        className="font-mono font-bold"
                      />
                    </div>
                    <div>
                      <Label>Mano de Obra ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={draftData.laborCost}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            laborCost: Math.max(0, Number(e.target.value) || 0),
                          }))
                        }
                        className="font-mono font-bold"
                      />
                    </div>
                    <div>
                      <Label>Estado del Presupuesto</Label>
                      <Select
                        value={draftData.budgetStatus}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            budgetStatus: e.target.value,
                          }))
                        }
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
                        value={draftData.advancePaid}
                        onChange={(e) =>
                          setDraftData((p) => ({
                            ...p,
                            advancePaid: Math.max(
                              0,
                              Number(e.target.value) || 0,
                            ),
                          }))
                        }
                        className="font-mono font-bold text-emerald-700"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        Sucursal
                      </span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F56C00] shrink-0" />
                        {orderData.branch}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        Prioridad
                      </span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                        {orderData.priority}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        Costo Repuestos
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
                        $ {orderData.partsCost.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                      <span className="block text-3xs uppercase font-bold text-slate-400">
                        Mano de Obra
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
                        $ {orderData.laborCost.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                )}

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
                      - $ {activeData.advancePaid.toLocaleString("es-AR")}
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
              </div>
            )}
          </Card>

          {/* Barra de acciones al pie cuando está activo el Modo Edición General */}
          {isEditingOrder && (
            <Card className="p-4 sm:px-6 flex items-center justify-end gap-3 bg-white">
              <Button
                type="button"
                variant="outline"
                icon={X}
                onClick={cancelGeneralEdit}
                className="bg-white font-semibold"
              >
                Cancelar
              </Button>
              <Button type="submit" icon={Check} className="font-bold shadow-md">
                Guardar Cambios
              </Button>
            </Card>
          )}
        </form>

        {/* Columna Derecha (1/3): Actualizar Estado e Historial (INTACTA) */}
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
    </div>
  )
}
