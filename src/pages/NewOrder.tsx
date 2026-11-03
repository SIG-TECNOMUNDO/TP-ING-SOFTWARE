import React, { useState } from "react"
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => {
      navigate("/servicio-tecnico")
    }, 1600)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link
            to="/servicio-tecnico"
            className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors"
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Grid simétrico en 2 columnas para las 4 tarjetas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* APARTADO 1: Datos del Cliente */}
          <Card className="p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-50 text-[#00559D] border border-blue-200/50">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      1. Datos del Cliente
                    </h2>
                    <p className="text-2xs text-slate-400">
                      Información de contacto y titularidad
                    </p>
                  </div>
                </div>
                <Badge variant="blue">Paso 1</Badge>
              </div>

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
                  <Label>Correo Electrónico (Opcional)</Label>
                  <Input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="cliente@correo.com"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* APARTADO 2: Datos del Equipo */}
          <Card className="p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-orange-50 text-[#F56C00] border border-orange-200/50">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      2. Datos del Equipo
                    </h2>
                    <p className="text-2xs text-slate-400">
                      Identificación del dispositivo y accesorios
                    </p>
                  </div>
                </div>
                <Badge variant="orange">Paso 2</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Tipo de Equipo *</Label>
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
                  <Label>Modelo Exacto *</Label>
                  <Input
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ej. Galaxy S22, iPhone 13 Pro"
                  />
                </div>
                <div>
                  <Label>Número de Serie / IMEI</Label>
                  <Input
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    placeholder="15 dígitos o N° Serie"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label>PIN / Patrón de Desbloqueo</Label>
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
            </div>
          </Card>

          {/* APARTADO 3: Diagnóstico de Falla (con píldora violeta clara "Paso 3") */}
          <Card className="p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200/50">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      3. Diagnóstico de Falla
                    </h2>
                    <p className="text-2xs text-slate-400">
                      Problema reportado y estado estético al recibir
                    </p>
                  </div>
                </div>
                <Badge variant="purple">Paso 3</Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Falla Reportada por el Cliente *</Label>
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
                  <Label>Observaciones Físicas al Ingresar</Label>
                  <textarea
                    rows={3}
                    value={physicalCondition}
                    onChange={(e) => setPhysicalCondition(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Ej. Tapa trasera astillada, marcos con desgaste, equipo ingresa apagado..."
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* APARTADO 4: Condiciones de Recepción y Seña */}
          <Card className="p-5 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-heading">
                      4. Condiciones de Recepción y Seña
                    </h2>
                    <p className="text-2xs text-slate-400">
                      Sucursal, prioridad de revisión y adelanto opcional
                    </p>
                  </div>
                </div>
                <Badge variant="green">Paso 4</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label>Sucursal Receptora *</Label>
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
                  <Label>Nivel de Prioridad</Label>
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
                  <Label>Seña / Adelanto Recibido ($) (Opcional)</Label>
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
            </div>

            {/* Botón grande de "Confirmar y Generar Orden" + Acciones secundarias */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
              <Button
                type="submit"
                icon={Check}
                className="w-full py-3 text-sm font-bold shadow-md"
              >
                Confirmar y Generar Orden
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/servicio-tecnico")}
                  className="w-full py-2 text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  icon={Printer}
                  className="w-full py-2 text-xs"
                >
                  Imprimir Recibo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
