import React, { useState } from "react"
import {
  findSoldDevice,
  isValidImei,
  warrantyInfo,
} from "../data/soldDevices"
import { Card, Button, Input, Label, Select, Badge } from "../components/ui"
import {
  ArrowLeft,
  Printer,
  User,
  Smartphone,
  Stethoscope,
  CheckCircle2,
  ClipboardCheck,
  Check,
  ChevronDown,
  ArrowRight,
} from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function NewOrder() {
  const navigate = useNavigate()
  const location = useLocation()
  const linkedState = location.state as {
    linkedOrder?: string
    client?: { name?: string; dni?: string; phone?: string }
  } | null

  const [success, setSuccess] = useState(false)

  // Estado del acordeón paso a paso (Paso 1 desplegado al iniciar, 2-4 colapsados)
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
  })

  // 1. Datos del Cliente
  const [clientName, setClientName] = useState(linkedState?.client?.name || "")
  const [clientDni, setClientDni] = useState(linkedState?.client?.dni || "")
  const [clientPhone, setClientPhone] = useState(
    linkedState?.client?.phone || "",
  )
  const [clientEmail, setClientEmail] = useState("")

  // 2. Datos del Equipo
  const [deviceType, setDeviceType] = useState("celular")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [imei, setImei] = useState("")
  const [unlockCode, setUnlockCode] = useState("")
  const [accessories, setAccessories] = useState("")

  // 3. Diagnóstico de Falla
  const [reportedIssue, setReportedIssue] = useState("")
  const [physicalCondition, setPhysicalCondition] = useState("")

  // 4. Condiciones de Recepción y Seña
  const [branch, setBranch] = useState("yofre")
  const [priority, setPriority] = useState("Normal")
  const [advancePayment, setAdvancePayment] = useState<string>("")

  // Validación de campos obligatorios por paso para el indicador visual
  const isStep1Complete =
    clientName.trim().length > 0 && clientPhone.trim().length > 0
  const isStep2Complete =
    Boolean(deviceType) &&
    brand.trim().length > 0 &&
    model.trim().length > 0
  const isStep3Complete = reportedIssue.trim().length > 0
  const isStep4Complete = Boolean(branch)

  const toggleStep = (step: number) => {
    setOpenSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }))
  }

  const goToStep = (currentStep: number, targetStep: number) => {
    setOpenSteps((prev) => ({
      ...prev,
      [currentStep]: false,
      [targetStep]: true,
    }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isStep1Complete) {
      setOpenSteps((prev) => ({ ...prev, 1: true }))
      return
    }
    if (!isStep2Complete) {
      setOpenSteps((prev) => ({ ...prev, 2: true }))
      return
    }
    if (!isStep3Complete) {
      setOpenSteps((prev) => ({ ...prev, 3: true }))
      return
    }

    setSuccess(true)
    setTimeout(() => {
      navigate("/servicio-tecnico")
    }, 1600)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            to="/servicio-tecnico"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            aria-label="Volver a Servicio Técnico"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
                Nueva Orden de Trabajo
              </h1>
              {linkedState?.linkedOrder && (
                <Badge variant="blue">
                  Vinculada a {linkedState.linkedOrder}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Recepción rápida de equipos en mostrador
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-bold">
            Orden generada exitosamente. Redirigiendo al listado de taller...
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* PASO 01 — Datos del cliente */}
        <Card className="overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleStep(1)}
            aria-expanded={openSteps[1]}
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
                    Datos del cliente
                  </h2>
                  {isStep1Complete && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-2xs font-bold"
                      title="Campos obligatorios completos"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completo
                    </span>
                  )}
                </div>
                <p className="text-2xs text-slate-400 mt-0.5">
                  Identificación y contacto
                </p>
              </div>
            </div>

            <ChevronDown
              className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                openSteps[1] ? "rotate-180 text-slate-700" : ""
              }`}
            />
          </button>

          {openSteps[1] && (
            <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="sm:col-span-2">
                  <Label>Nombre y Apellido *</Label>
                  <Input
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <Label>DNI / CUIT</Label>
                  <Input
                    value={clientDni}
                    onChange={(e) => setClientDni(e.target.value)}
                    placeholder="Sin puntos"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>Teléfono / WhatsApp *</Label>
                  <Input
                    required
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ej. 351-555-4321"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Correo electrónico (opcional)</Label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cliente@correo.com"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                <Button
                  type="button"
                  onClick={() => goToStep(1, 2)}
                  className="py-2.5 px-5 text-xs font-bold cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* PASO 02 — Datos del equipo */}
        <Card className="overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleStep(2)}
            aria-expanded={openSteps[2]}
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
                    Datos del equipo
                  </h2>
                  {isStep2Complete && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-2xs font-bold"
                      title="Campos obligatorios completos"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completo
                    </span>
                  )}
                </div>
                <p className="text-2xs text-slate-400 mt-0.5">
                  Dispositivo, modelo y accesorios
                </p>
              </div>
            </div>

            <ChevronDown
              className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                openSteps[2] ? "rotate-180 text-slate-700" : ""
              }`}
            />
          </button>

          {openSteps[2] && (
            <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Tipo de equipo *</Label>
                  <Select
                    required
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                  >
                    <option value="celular">Celular / Smartphone</option>
                    <option value="tablet">Tablet / iPad</option>
                    <option value="notebook">Notebook / MacBook</option>
                    <option value="pc">PC de Escritorio</option>
                    <option value="consola">Consola</option>
                    <option value="otro">Otro</option>
                  </Select>
                </div>
                <div>
                  <Label>Marca *</Label>
                  <Input
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej. Samsung, Apple, Motorola"
                  />
                </div>
                <div>
                  <Label>Modelo exacto *</Label>
                  <Input
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ej. Galaxy S22, iPhone 13 Pro"
                  />
                </div>
                <div>
                  <Label>Número de serie / IMEI</Label>
                  <Input
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    placeholder="15 dígitos o N° Serie"
                    className="font-mono"
                  />
                  {isValidImei(imei) &&
                    (() => {
                      // Reingreso por garantía: ¿lo vendió Tecnomundo?
                      const sold = findSoldDevice(imei)
                      if (!sold)
                        return (
                          <p className="mt-1.5 text-2xs text-slate-500">
                            Este IMEI no figura en ventas de Tecnomundo.
                          </p>
                        )
                      const warranty = warrantyInfo(sold)
                      return (
                        <div
                          className={`mt-1.5 rounded-lg border p-2 text-2xs ${
                            warranty.active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-rose-200 bg-rose-50 text-rose-800"
                          }`}
                        >
                          <p className="font-bold">
                            {warranty.active
                              ? `En garantía: quedan ${warranty.daysLeft} días`
                              : "Garantía vencida"}
                          </p>
                          <p>
                            {sold.productName} vendido el{" "}
                            {new Date(sold.soldAt).toLocaleDateString("es-AR")}{" "}
                            ({sold.saleId}) a {sold.client}
                          </p>
                          {warranty.active && priority !== "Garantía" && (
                            <button
                              type="button"
                              onClick={() => setPriority("Garantía")}
                              className="mt-1 font-bold underline cursor-pointer"
                            >
                              Marcar como reingreso por garantía
                            </button>
                          )}
                        </div>
                      )
                    })()}
                </div>
                <div>
                  <Label>PIN / Patrón de desbloqueo</Label>
                  <Input
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value)}
                    placeholder="Ej. PIN 1234 / Sin clave"
                  />
                </div>
                <div>
                  <Label>Accesorios que ingresan</Label>
                  <Input
                    value={accessories}
                    onChange={(e) => setAccessories(e.target.value)}
                    placeholder="Ej. Funda, Bandeja SIM, Cargador"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(2, 1)}
                  className="py-2.5 px-4 text-xs font-semibold bg-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>Anterior</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => goToStep(2, 3)}
                  className="py-2.5 px-5 text-xs font-bold cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* PASO 03 — Diagnóstico de falla */}
        <Card className="overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleStep(3)}
            aria-expanded={openSteps[3]}
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
                    Diagnóstico de falla
                  </h2>
                  {isStep3Complete && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-2xs font-bold"
                      title="Campos obligatorios completos"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completo
                    </span>
                  )}
                </div>
                <p className="text-2xs text-slate-400 mt-0.5">
                  Problema informado y estado físico
                </p>
              </div>
            </div>

            <ChevronDown
              className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                openSteps[3] ? "rotate-180 text-slate-700" : ""
              }`}
            />
          </button>

          {openSteps[3] && (
            <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100 space-y-5">
              <div className="space-y-4">
                <div>
                  <Label>Falla reportada por el cliente *</Label>
                  <textarea
                    required
                    rows={3}
                    value={reportedIssue}
                    onChange={(e) => setReportedIssue(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Detalle los síntomas o problemas reportados por el cliente..."
                  />
                </div>

                <div>
                  <Label>Observaciones físicas al ingresar</Label>
                  <textarea
                    rows={3}
                    value={physicalCondition}
                    onChange={(e) => setPhysicalCondition(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Ej. Tapa trasera astillada, marcos con desgaste, equipo ingresa apagado..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(3, 2)}
                  className="py-2.5 px-4 text-xs font-semibold bg-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>Anterior</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => goToStep(3, 4)}
                  className="py-2.5 px-5 text-xs font-bold cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* PASO 04 — Condiciones de recepción */}
        <Card className="overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleStep(4)}
            aria-expanded={openSteps[4]}
            className="w-full p-5 sm:px-6 sm:py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/50 shrink-0">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="green">04</Badge>
                  <h2 className="text-base font-bold text-slate-900 font-heading">
                    Condiciones de recepción
                  </h2>
                  {isStep4Complete && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-2xs font-bold"
                      title="Campos obligatorios completos"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completo
                    </span>
                  )}
                </div>
                <p className="text-2xs text-slate-400 mt-0.5">
                  Sucursal, prioridad y seña
                </p>
              </div>
            </div>

            <ChevronDown
              className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                openSteps[4] ? "rotate-180 text-slate-700" : ""
              }`}
            />
          </button>

          {openSteps[4] && (
            <div className="px-5 pb-5 pt-4 sm:px-6 sm:pb-6 border-t border-slate-100 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Sucursal receptora *</Label>
                  <Select
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    <option value="yofre">Yofre Norte</option>
                    <option value="alta">Alta Córdoba</option>
                  </Select>
                </div>

                <div>
                  <Label>Nivel de prioridad</Label>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Normal">Normal (48-72 hs)</option>
                    <option value="Alta">Alta / Express (24 hs)</option>
                    <option value="Garantía">Reingreso por Garantía</option>
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <Label>Seña / Adelanto recibido ($) (opcional)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={advancePayment}
                    onChange={(e) => setAdvancePayment(e.target.value)}
                    placeholder="Ej. 15000 (Dejar en blanco si no abona seña)"
                    className="font-mono"
                  />
                  <p className="text-2xs text-slate-400 mt-1">
                    Los costos de repuestos y mano de obra los completará el
                    técnico luego de revisar el equipo.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(4, 3)}
                  className="py-2.5 px-4 text-xs font-semibold bg-white cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>Anterior</span>
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Pie del formulario debajo del paso 04, fuera de los acordeones */}
        <Card className="p-4 sm:px-6 sm:py-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/servicio-tecnico")}
              className="w-full sm:w-auto py-2.5 px-5 text-xs font-semibold bg-white cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              icon={Printer}
              className="w-full sm:w-auto py-2.5 px-4 text-xs font-semibold bg-white cursor-pointer"
            >
              Imprimir Recibo
            </Button>
          </div>

          <Button
            type="submit"
            icon={Check}
            className="w-full sm:w-auto sm:min-w-64 py-3 px-6 text-sm font-bold shadow-md cursor-pointer"
          >
            Confirmar y Generar Orden
          </Button>
        </Card>
      </form>
    </div>
  )
}
