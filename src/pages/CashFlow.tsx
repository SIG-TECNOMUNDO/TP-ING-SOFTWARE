import React, { useMemo, useState } from "react"
import { Card, Button, Badge, Input, Label, Select } from "../components/ui"
import Modal from "../components/Modal"
import {
  ShoppingCart,
  Wrench,
  TrendingDown,
  WalletCards,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  FileText,
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
} from "lucide-react"

export type SourceModule = "VENTAS" | "SAT" | "MANUAL"
export type MovementType = "INCOME" | "EXPENSE"

export interface CashMovement {
  id: string
  date: string // ISO string YYYY-MM-DDTHH:mm:ss
  branch: "Yofre Norte" | "Alta Córdoba"
  source: SourceModule
  concept: string
  paymentMethod: string
  user: string
  amount: number
  type: MovementType
}

// Generador de fechas para mock data consistente con el día actual
const getIsoDate = (daysAgo: number, timeStr: string) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${timeStr}`
}

// Datos iniciales de demostración mezclando Ventas, SAT y Ajustes manuales
const initialMovements: CashMovement[] = [
  {
    id: "MOV-001",
    date: getIsoDate(0, "09:30:00"),
    branch: "Yofre Norte",
    source: "VENTAS",
    concept: "Venta de mostrador #000245 - Samsung Galaxy A54",
    paymentMethod: "Efectivo",
    user: "Ventas Yofre",
    amount: 185000,
    type: "INCOME",
  },
  {
    id: "MOV-002",
    date: getIsoDate(0, "10:15:00"),
    branch: "Alta Córdoba",
    source: "SAT",
    concept: "Cobro OT #042 - Cambio Módulo OLED iPhone 13 Pro",
    paymentMethod: "Tarjeta de Crédito",
    user: "Técnico Alta Cba",
    amount: 125000,
    type: "INCOME",
  },
  {
    id: "MOV-003",
    date: getIsoDate(0, "11:20:00"),
    branch: "Yofre Norte",
    source: "MANUAL",
    concept: "Compra de insumos de librería, rollos de papel y remitos",
    paymentMethod: "Efectivo",
    user: "Administrador Principal",
    amount: 12400,
    type: "EXPENSE",
  },
  {
    id: "MOV-004",
    date: getIsoDate(0, "12:45:00"),
    branch: "Alta Córdoba",
    source: "VENTAS",
    concept: "Venta de mostrador #000246 - Auriculares JBL + Funda MagSafe",
    paymentMethod: "Mercado Pago",
    user: "Ventas Alta Cba",
    amount: 60000,
    type: "INCOME",
  },
  {
    id: "MOV-005",
    date: getIsoDate(0, "14:10:00"),
    branch: "Yofre Norte",
    source: "SAT",
    concept: "Cobro OT #038 - Reparación pin de carga Motorola G22",
    paymentMethod: "Transferencia",
    user: "Técnico Yofre",
    amount: 38500,
    type: "INCOME",
  },
  {
    id: "MOV-006",
    date: getIsoDate(0, "15:30:00"),
    branch: "Alta Córdoba",
    source: "MANUAL",
    concept: "Ajuste por sobrante de caja chica turno mañana",
    paymentMethod: "Efectivo",
    user: "Administrador Principal",
    amount: 3500,
    type: "INCOME",
  },
  {
    id: "MOV-007",
    date: getIsoDate(1, "16:20:00"),
    branch: "Yofre Norte",
    source: "MANUAL",
    concept: "Envío cadetería urgente de repuestos entre sucursales",
    paymentMethod: "Efectivo",
    user: "Administrador Principal",
    amount: 8000,
    type: "EXPENSE",
  },
  {
    id: "MOV-008",
    date: getIsoDate(1, "17:15:00"),
    branch: "Alta Córdoba",
    source: "SAT",
    concept: "Cobro OT #035 - Reemplazo de Batería Original iPhone 11",
    paymentMethod: "Efectivo",
    user: "Técnico Alta Cba",
    amount: 45000,
    type: "INCOME",
  },
  {
    id: "MOV-009",
    date: getIsoDate(2, "18:00:00"),
    branch: "Yofre Norte",
    source: "VENTAS",
    concept: "Venta de mostrador #000244 - Cargador Samsung 25W Tipo C",
    paymentMethod: "Tarjeta de Débito",
    user: "Ventas Yofre",
    amount: 22000,
    type: "INCOME",
  },
  {
    id: "MOV-010",
    date: getIsoDate(2, "19:10:00"),
    branch: "Alta Córdoba",
    source: "MANUAL",
    concept: "Justificación de diferencia / redondeo en cambio de caja",
    paymentMethod: "Efectivo",
    user: "Administrador Principal",
    amount: 1500,
    type: "EXPENSE",
  },
]

// Formateadores de moneda y fecha
const formatMoney = (val: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(val)

const formatDateTime = (dateStr: string) => {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateStr))
}

export default function CashFlow() {
  // Estado de los movimientos de caja
  const [movements, setMovements] = useState<CashMovement[]>(initialMovements)

  // Filtros superiores
  const [period, setPeriod] =
    useState<"Diario" | "Semanal" | "Mensual" | "Anual">("Diario")
  const [branchFilter, setBranchFilter] = useState("Todas")
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )

  // Estado para modal de Nuevo Movimiento / Ajuste
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Formulario del nuevo movimiento
  const [formData, setFormData] = useState({
    type: "EXPENSE" as MovementType,
    branch: "Yofre Norte" as "Yofre Norte" | "Alta Córdoba",
    concept: "",
    paymentMethod: "Efectivo",
    amount: "",
    user: "Administrador Principal",
  })

  // Filtrado de movimientos según período, sucursal y fecha
  const filteredMovements = useMemo(() => {
    return movements.filter((item) => {
      // Filtro de Sucursal
      if (branchFilter !== "Todas" && item.branch !== branchFilter) {
        return false
      }

      // Filtro de Período y Fecha
      if (period === "Diario") {
        if (selectedDate) {
          return item.date.startsWith(selectedDate)
        }
      } else if (period === "Semanal") {
        if (selectedDate) {
          const target = new Date(selectedDate + "T23:59:59").getTime()
          const itemTime = new Date(item.date).getTime()
          const diffDays = (target - itemTime) / (1000 * 60 * 60 * 24)
          return diffDays >= 0 && diffDays <= 7
        }
      } else if (period === "Mensual") {
        if (selectedDate) {
          return item.date.slice(0, 7) === selectedDate.slice(0, 7)
        }
      } else if (period === "Anual") {
        if (selectedDate) {
          return item.date.slice(0, 4) === selectedDate.slice(0, 4)
        }
      }

      return true
    })
  }, [movements, branchFilter, period, selectedDate])

  // Cálculo dinámico de los 4 KPIs Financieros
  const kpiData = useMemo(() => {
    let salesIncome = 0
    let satIncome = 0
    let manualIncome = 0
    let expenses = 0

    for (const mov of filteredMovements) {
      if (mov.type === "EXPENSE") {
        expenses += mov.amount
      } else {
        if (mov.source === "VENTAS") salesIncome += mov.amount
        else if (mov.source === "SAT") satIncome += mov.amount
        else manualIncome += mov.amount
      }
    }

    const totalBalance = salesIncome + satIncome + manualIncome - expenses

    return {
      salesIncome,
      satIncome,
      expenses,
      totalBalance,
    }
  }, [filteredMovements])

  // Handlers para el Modal de Ajuste
  const handleOpenModal = () => {
    setFormData({
      type: "EXPENSE",
      branch: "Yofre Norte",
      concept: "",
      paymentMethod: "Efectivo",
      amount: "",
      user: "Administrador Principal",
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormError(null)
  }

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const numAmount = parseFloat(formData.amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError("Por favor ingrese un monto válido mayor a 0.")
      return
    }

    if (!formData.concept.trim()) {
      setFormError("Por favor ingrese un concepto o justificación.")
      return
    }

    const newMov: CashMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      branch: formData.branch,
      source: "MANUAL",
      concept: formData.concept.trim(),
      paymentMethod: formData.paymentMethod,
      user: formData.user.trim() || "Administrador",
      amount: numAmount,
      type: formData.type,
    }

    setMovements((prev) => [newMov, ...prev])
    setIsModalOpen(false)
    const actionLabel =
      formData.type === "INCOME" ? "Ingreso manual" : "Egreso/Ajuste"
    setToastMessage(
      `${actionLabel} de ${formatMoney(numAmount)} registrado correctamente.`,
    )
    window.setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className="space-y-6">
      {/* 1. Encabezado y Botón de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <WalletCards className="h-7 w-7 text-primary" />
            Caja y Movimientos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Registro histórico centralizado y flujo de fondos de Ventas,
            Servicio Técnico (SAT) y movimientos manuales.
          </p>
        </div>

        <Button
          icon={PlusCircle}
          onClick={handleOpenModal}
          className="shadow-sm py-2 px-4 text-sm font-semibold whitespace-nowrap"
        >
          Nuevo Movimiento / Ajuste
        </Button>
      </div>

      {/* Toast de Éxito */}
      {toastMessage && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center justify-between shadow-xs animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-green-600 hover:text-green-800 text-xs font-semibold uppercase tracking-wider"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* 1. Barra de Filtros Superiores */}
      <Card className="p-4 bg-white border-gray-200 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label
              htmlFor="period-select"
              className="flex items-center gap-1.5 text-xs text-gray-600 uppercase font-semibold"
            >
              <Clock className="w-3.5 h-3.5 text-primary" /> Período
            </Label>
            <Select
              id="period-select"
              value={period}
              onChange={(e) =>
                setPeriod(
                  e.target.value as "Diario" | "Semanal" | "Mensual" | "Anual",
                )
              }
            >
              <option value="Diario">Caja Diaria</option>
              <option value="Semanal">Semanal</option>
              <option value="Mensual">Mensual</option>
              <option value="Anual">Anual</option>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="branch-select"
              className="flex items-center gap-1.5 text-xs text-gray-600 uppercase font-semibold"
            >
              <Building2 className="w-3.5 h-3.5 text-primary" /> Sucursal
            </Label>
            <Select
              id="branch-select"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="Todas">Todas las sucursales</option>
              <option value="Yofre Norte">Yofre Norte</option>
              <option value="Alta Córdoba">Alta Córdoba</option>
            </Select>
          </div>

          <div>
            <Label
              htmlFor="date-select"
              className="flex items-center gap-1.5 text-xs text-gray-600 uppercase font-semibold"
            >
              <Calendar className="w-3.5 h-3.5 text-primary" /> Consultar Fecha
              Específica
            </Label>
            <Input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* 2. Panel de Indicadores (KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos Ventas */}
        <Card className="p-5 border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ingresos Ventas
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 font-mono">
                {formatMoney(kpiData.salesIncome)}
              </p>
              <p className="mt-1 text-xs text-blue-600 font-medium flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Módulo de Ventas
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Ingresos SAT */}
        <Card className="p-5 border-l-4 border-l-secondary hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ingresos SAT
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 font-mono">
                {formatMoney(kpiData.satIncome)}
              </p>
              <p className="mt-1 text-xs text-orange-600 font-medium flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Servicio Técnico
              </p>
            </div>
            <div className="p-3 bg-orange-50 text-secondary rounded-xl">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Egresos / Ajustes */}
        <Card className="p-5 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Egresos / Ajustes
              </p>
              <p className="mt-2 text-2xl font-bold text-red-600 font-mono">
                {formatMoney(kpiData.expenses)}
              </p>
              <p className="mt-1 text-xs text-red-600 font-medium flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> Salidas y
                gastos
              </p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </Card>

        {/* Saldo Total en Caja */}
        <Card className="p-5 border-l-4 border-l-green-600 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Saldo Total en Caja
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 font-mono">
                {formatMoney(kpiData.totalBalance)}
              </p>
              <p className="mt-1 text-xs text-green-700 font-medium flex items-center">
                <CheckCircle className="w-3.5 h-3.5 mr-0.5" /> Balance operativo
                neto
              </p>
            </div>
            <div className="p-3 bg-green-50 text-green-700 rounded-xl">
              <WalletCards className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Tabla de Registro Histórico */}
      <Card className="overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Registro Histórico de Movimientos
            </h2>
            <p className="text-xs text-gray-500">
              Mostrando {filteredMovements.length} transacciones para el período
              seleccionado
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              Filtrado por:{" "}
              <strong className="text-gray-700">{branchFilter}</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha/Hora
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Módulo Origen
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredMovements.map((mov) => {
                const isExpense = mov.type === "EXPENSE"

                return (
                  <tr
                    key={mov.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    {/* Fecha/Hora */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {formatDateTime(mov.date)}
                    </td>

                    {/* Sucursal */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {mov.branch}
                    </td>

                    {/* Módulo Origen con Badge temático */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {mov.source === "VENTAS" && (
                        <Badge variant="blue" className="gap-1">
                          <ShoppingCart className="w-3 h-3" /> Ventas
                        </Badge>
                      )}
                      {mov.source === "SAT" && (
                        <Badge variant="orange" className="gap-1">
                          <Wrench className="w-3 h-3" /> SAT
                        </Badge>
                      )}
                      {mov.source === "MANUAL" && (
                        <Badge variant="gray" className="gap-1">
                          <FileText className="w-3 h-3" /> Manual
                        </Badge>
                      )}
                    </td>

                    {/* Concepto */}
                    <td className="px-5 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                      {mov.concept}
                    </td>

                    {/* Método de Pago */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-700">
                        {mov.paymentMethod}
                      </span>
                    </td>

                    {/* Usuario */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                      {mov.user}
                    </td>

                    {/* Monto con formato +/- */}
                    <td
                      className={`px-5 py-4 whitespace-nowrap text-right text-sm font-bold font-mono ${
                        isExpense ? "text-red-600" : "text-green-700"
                      }`}
                    >
                      <span className="inline-flex items-center justify-end gap-1">
                        {isExpense ? (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        )}
                        {isExpense ? "-" : "+"}
                        {formatMoney(mov.amount)}
                      </span>
                    </td>
                  </tr>
                )
              })}

              {filteredMovements.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No se registran movimientos para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Modal para Nuevo Movimiento / Ajuste de Caja */}
      {isModalOpen && (
        <Modal
          title="Nuevo Movimiento / Ajuste de Caja"
          onClose={handleCloseModal}
        >
          <form onSubmit={handleCreateMovement} className="space-y-4">
            <p className="text-xs text-gray-500 -mt-2">
              Asienta gastos menores, egresos de caja, ingresos manuales o
              justificaciones de descuadre.
            </p>

            {formError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-red-700 font-medium">
                  {formError}
                </span>
              </div>
            )}

            <div>
              <Label htmlFor="mov-type">Tipo de Operación</Label>
              <Select
                id="mov-type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as MovementType,
                  })
                }
              >
                <option value="EXPENSE">Egreso / Gasto operativo (-)</option>
                <option value="INCOME">
                  Ingreso manual extraordinario (+)
                </option>
              </Select>
            </div>

            <div>
              <Label htmlFor="mov-branch">Sucursal</Label>
              <Select
                id="mov-branch"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    branch: e.target.value as "Yofre Norte" | "Alta Córdoba",
                  })
                }
              >
                <option value="Yofre Norte">Yofre Norte</option>
                <option value="Alta Córdoba">Alta Córdoba</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="mov-concept">Concepto / Justificación</Label>
              <Input
                id="mov-concept"
                type="text"
                required
                placeholder="Ej. Compra de librería, Faltante justificado..."
                value={formData.concept}
                onChange={(e) =>
                  setFormData({ ...formData, concept: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mov-payment">Método de Pago</Label>
                <Select
                  id="mov-payment"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Mercado Pago">Mercado Pago</option>
                  <option value="Otro">Otro</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="mov-amount">Importe ($)</Label>
                <Input
                  id="mov-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mov-user">Usuario Responsable</Label>
              <Input
                id="mov-user"
                type="text"
                required
                value={formData.user}
                onChange={(e) =>
                  setFormData({ ...formData, user: e.target.value })
                }
              />
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Registrar Movimiento
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
