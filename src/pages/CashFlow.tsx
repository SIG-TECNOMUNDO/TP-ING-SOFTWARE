import React, { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, Button, Badge, Input, Label, Select } from "../components/ui"
import Modal from "../components/Modal"
import {
  WalletCards,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Filter,
  Calculator,
  Printer,
  FileCheck2,
  Banknote,
  CreditCard,
  RotateCcw,
  X,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

export type MovementType = "INCOME" | "EXPENSE"

export interface CashMovement {
  id: string
  date: string // YYYY-MM-DDTHH:mm:ss
  concept: string
  paymentMethod: string
  user: string
  amount: number
  type: MovementType
}

const getIsoDate = (daysAgo: number, timeStr: string) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${timeStr}`
}

const todayDateStr = () => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

const initialMovements: CashMovement[] = [
  {
    id: "MOV-001",
    date: getIsoDate(0, "09:30:00"),
    concept: "Venta de mostrador #000245 - Samsung Galaxy A54",
    paymentMethod: "Efectivo",
    user: "Ventas Yofre",
    amount: 185000,
    type: "INCOME",
  },
  {
    id: "MOV-002",
    date: getIsoDate(0, "10:15:00"),
    concept: "Cobro OT #10452 - Cambio Módulo OLED iPhone 13 Pro",
    paymentMethod: "Tarjeta",
    user: "Técnico Alta Cba",
    amount: 125000,
    type: "INCOME",
  },
  {
    id: "MOV-003",
    date: getIsoDate(0, "11:20:00"),
    concept: "Compra de insumos de librería y rollos térmicos",
    paymentMethod: "Efectivo",
    user: "Ventas Yofre",
    amount: 12400,
    type: "EXPENSE",
  },
  {
    id: "MOV-004",
    date: getIsoDate(0, "12:45:00"),
    concept: "Venta de mostrador #000246 - Auriculares JBL + Funda MagSafe",
    paymentMethod: "Transferencia",
    user: "Ventas Alta Cba",
    amount: 60000,
    type: "INCOME",
  },
  {
    id: "MOV-005",
    date: getIsoDate(0, "14:10:00"),
    concept: "Cobro OT #10448 - Reparación pin de carga Motorola G22",
    paymentMethod: "Efectivo",
    user: "Técnico Yofre",
    amount: 38500,
    type: "INCOME",
  },
  {
    id: "MOV-006",
    date: getIsoDate(1, "16:20:00"),
    concept: "Envío cadetería de repuestos entre sucursales",
    paymentMethod: "Efectivo",
    user: "Ventas Yofre",
    amount: 8000,
    type: "EXPENSE",
  },
  {
    id: "MOV-007",
    date: getIsoDate(1, "17:15:00"),
    concept: "Cobro OT #10442 - Reemplazo de Batería Original iPhone 11",
    paymentMethod: "Efectivo",
    user: "Técnico Alta Cba",
    amount: 45000,
    type: "INCOME",
  },
  {
    id: "MOV-008",
    date: getIsoDate(2, "18:00:00"),
    concept: "Venta de mostrador #000240 - Cargador Samsung 25W Tipo C",
    paymentMethod: "Tarjeta",
    user: "Ventas Yofre",
    amount: 22000,
    type: "INCOME",
  },
]

const formatMoney = (val: number) =>
  `$ ${Math.abs(val).toLocaleString("es-AR")}`

const formatDateTime = (dateStr: string) => {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateStr))
}

interface DailyClosureReport {
  id: string
  closedAt: string
  employee: string
  initialCash: number
  systemCashIncome: number
  systemCardIncome: number
  systemExpenses: number
  expectedTotal: number
  countedCash: number
  countedCards: number
  countedTotal: number
  difference: number
  notes: string
}

export default function CashFlow() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [movements, setMovements] = useState<CashMovement[]>(initialMovements)

  // Inputs de filtro de fechas ("Desde" y "Hasta") + estado aplicado con botón "Filtrar"
  const [dateFromInput, setDateFromInput] = useState("")
  const [dateToInput, setDateToInput] = useState("")
  const [appliedDateRange, setAppliedDateRange] = useState<{
    from: string
    to: string
  }>({ from: "", to: "" })

  // Modal de Nuevo Movimiento
  const [isNewMovModalOpen, setIsNewMovModalOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: "EXPENSE" as MovementType,
    concept: "",
    paymentMethod: "Efectivo",
    amount: "",
    user: user?.name || "Operador de Turno",
  })

  // Modal de Cierre de Caja Diario y Reporte (Accesible a cualquier empleado)
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false)
  const [initialCashInput, setInitialCashInput] = useState("50000")
  const [countedCashInput, setCountedCashInput] = useState("")
  const [countedCardsInput, setCountedCardsInput] = useState("")
  const [closureNotes, setClosureNotes] = useState("")
  const [lastClosureReport, setLastClosureReport] =
    useState<DailyClosureReport | null>(null)

  useEffect(() => {
    if (searchParams.get("action") === "cierre") {
      setIsClosureModalOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  // Aplicar filtro de rango de fechas al hacer clic en "Filtrar"
  const handleApplyDateFilter = (e: React.FormEvent) => {
    e.preventDefault()
    setAppliedDateRange({
      from: dateFromInput,
      to: dateToInput,
    })
  }

  const handleResetDateFilter = () => {
    setDateFromInput("")
    setDateToInput("")
    setAppliedDateRange({ from: "", to: "" })
  }

  // Movimientos filtrados según "Desde" y "Hasta"
  const filteredMovements = useMemo(() => {
    return movements.filter((mov) => {
      const movDay = mov.date.slice(0, 10)
      if (appliedDateRange.from && movDay < appliedDateRange.from) {
        return false
      }
      if (appliedDateRange.to && movDay > appliedDateRange.to) {
        return false
      }
      return true
    })
  }, [movements, appliedDateRange])

  // Totales de la vista actual
  const summary = useMemo(() => {
    let totalIncome = 0
    let totalExpenses = 0
    let cashIncome = 0
    let cardAndDigitalIncome = 0
    let cashExpenses = 0

    for (const mov of filteredMovements) {
      if (mov.type === "INCOME") {
        totalIncome += mov.amount
        if (mov.paymentMethod === "Efectivo") {
          cashIncome += mov.amount
        } else {
          cardAndDigitalIncome += mov.amount
        }
      } else {
        totalExpenses += mov.amount
        if (mov.paymentMethod === "Efectivo") {
          cashExpenses += mov.amount
        }
      }
    }

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      cashIncome,
      cardAndDigitalIncome,
      cashExpenses,
    }
  }, [filteredMovements])

  // Cálculos automáticos para el Cierre de Caja del Turno
  const initialCash = Math.max(0, Number(initialCashInput) || 0)
  const expectedCashInDrawer = Math.max(
    0,
    initialCash + summary.cashIncome - summary.cashExpenses,
  )
  const expectedDigital = summary.cardAndDigitalIncome
  const expectedSystemTotal = expectedCashInDrawer + expectedDigital

  const countedCash =
    countedCashInput === ""
      ? expectedCashInDrawer
      : Math.max(0, Number(countedCashInput) || 0)
  const countedCards =
    countedCardsInput === ""
      ? expectedDigital
      : Math.max(0, Number(countedCardsInput) || 0)
  const countedTotal = countedCash + countedCards
  const difference = countedTotal - expectedSystemTotal

  const openClosureModal = () => {
    setCountedCashInput(String(expectedCashInDrawer))
    setCountedCardsInput(String(expectedDigital))
    setClosureNotes("")
    setIsClosureModalOpen(true)
  }

  const handleConfirmClosure = (e: React.FormEvent) => {
    e.preventDefault()
    const report: DailyClosureReport = {
      id: `CIE-${Math.floor(1000 + Math.random() * 9000)}`,
      closedAt: new Date().toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      employee: user?.name || "Operador de Turno",
      initialCash,
      systemCashIncome: summary.cashIncome,
      systemCardIncome: summary.cardAndDigitalIncome,
      systemExpenses: summary.totalExpenses,
      expectedTotal: expectedSystemTotal,
      countedCash,
      countedCards,
      countedTotal,
      difference,
      notes: closureNotes.trim() || "Sin observaciones adicionales.",
    }

    setLastClosureReport(report)
    setIsClosureModalOpen(false)
    setToastMessage(
      `Cierre de Caja ${report.id} y Reporte Diario generados con éxito por ${report.employee}.`,
    )
    window.setTimeout(() => setToastMessage(null), 5000)
  }

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const numAmount = parseFloat(formData.amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError("Por favor ingresá un monto válido mayor a 0.")
      return
    }

    if (!formData.concept.trim()) {
      setFormError("Por favor ingresá un concepto.")
      return
    }

    const newMov: CashMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      concept: formData.concept.trim(),
      paymentMethod: formData.paymentMethod,
      user: formData.user.trim() || user?.name || "Operador",
      amount: numAmount,
      type: formData.type,
    }

    setMovements((prev) => [newMov, ...prev])
    setIsNewMovModalOpen(false)
    setToastMessage(
      `${formData.type === "INCOME" ? "Ingreso" : "Egreso"} de ${formatMoney(numAmount)} registrado en caja.`,
    )
    window.setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado minimalista con acceso directo a Cierre de Caja para todos los empleados */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Caja y Movimientos
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Control minimalista de ingresos, egresos y arqueo de cierre de turno
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            icon={PlusCircle}
            onClick={() => {
              setFormData({
                type: "EXPENSE",
                concept: "",
                paymentMethod: "Efectivo",
                amount: "",
                user: user?.name || "Operador de Turno",
              })
              setFormError(null)
              setIsNewMovModalOpen(true)
            }}
            className="bg-white py-2.5 px-4 text-xs sm:text-sm font-semibold"
          >
            Registrar Movimiento
          </Button>

          <Button
            variant="secondary"
            icon={Calculator}
            onClick={openClosureModal}
            className="py-2.5 px-4 sm:px-5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg"
          >
            Cierre de Caja y Reporte Diario
          </Button>
        </div>
      </div>

      {/* Toast de Confirmación */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Tarjeta de Reporte Diario Generado (si el empleado acaba de cerrar turno) */}
      {lastClosureReport && (
        <Card className="p-5 border-2 border-emerald-200 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                    Reporte Diario de Cierre Emitido ({lastClosureReport.id})
                  </h2>
                  <Badge variant="green">Cerrado</Badge>
                </div>
                <p className="text-2xs text-slate-500">
                  Responsable: <strong>{lastClosureReport.employee}</strong> •
                  Fecha: {lastClosureReport.closedAt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                icon={Printer}
                onClick={() => window.print()}
                className="text-xs py-1.5 px-3"
              >
                Imprimir Reporte
              </Button>
              <button
                type="button"
                onClick={() => setLastClosureReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                aria-label="Ocultar reporte"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="block text-3xs uppercase font-bold text-slate-400">
                Fondo Inicial
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
                {formatMoney(lastClosureReport.initialCash)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="block text-3xs uppercase font-bold text-slate-400">
                Saldo Sistema Esperado
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
                {formatMoney(lastClosureReport.expectedTotal)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="block text-3xs uppercase font-bold text-slate-400">
                Total Real Recontado
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono text-[#00559D]">
                {formatMoney(lastClosureReport.countedTotal)}
              </span>
            </div>
            <div
              className={`p-3 rounded-xl border ${
                lastClosureReport.difference === 0
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : lastClosureReport.difference > 0
                    ? "bg-blue-50 border-blue-200 text-blue-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              <span className="block text-3xs uppercase font-bold opacity-75">
                Diferencia de Caja
              </span>
              <span className="text-xs sm:text-sm font-extrabold font-mono">
                {lastClosureReport.difference === 0
                  ? "$ 0 (Exacto)"
                  : `${lastClosureReport.difference > 0 ? "+" : "-"}${formatMoney(lastClosureReport.difference)}`}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* 3 Tarjetas Minimalistas de Resumen de Caja */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Ingresos
            </p>
            <p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">
              + {formatMoney(summary.totalIncome)}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Egresos
            </p>
            <p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-rose-600 font-mono">
              - {formatMoney(summary.totalExpenses)}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/50">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Balance Neto de Movimientos
            </p>
            <p className="mt-1.5 text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {formatMoney(summary.netBalance)}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 text-[#00559D] border border-blue-200/50">
            <WalletCards className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Card Principal: Filtro de Fechas ("Desde" y "Hasta" + Botón "Filtrar") y Tabla Minimalista */}
      <Card className="overflow-hidden">
        {/* Cabecera superior de la tabla con Filtro de Fechas */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Movimientos de Caja
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Mostrando {filteredMovements.length} movimientos registrados
            </p>
          </div>

          <form
            onSubmit={handleApplyDateFilter}
            className="flex flex-wrap sm:flex-nowrap items-end gap-3"
          >
            <div className="w-full sm:w-44">
              <Label
                htmlFor="date-from"
                className="text-2xs uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3 text-primary" />
                Desde
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFromInput}
                onChange={(e) => setDateFromInput(e.target.value)}
                className="py-2 text-xs"
              />
            </div>

            <div className="w-full sm:w-44">
              <Label
                htmlFor="date-to"
                className="text-2xs uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1"
              >
                <Calendar className="w-3 h-3 text-primary" />
                Hasta
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateToInput}
                onChange={(e) => setDateToInput(e.target.value)}
                className="py-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                variant="primary"
                icon={Filter}
                className="py-2 px-4 text-xs font-bold"
              >
                Filtrar
              </Button>
              {(appliedDateRange.from || appliedDateRange.to) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetDateFilter}
                  className="py-2 px-3 text-xs"
                  title="Limpiar filtro de fechas"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla Minimalista: únicamente Fecha, Concepto, Método, Monto, Usuario */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/90">
              <tr>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-5 py-3.5 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Usuario
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredMovements.map((mov) => {
                const isExpense = mov.type === "EXPENSE"
                return (
                  <tr
                    key={mov.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* 1. Fecha */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {formatDateTime(mov.date)}
                    </td>

                    {/* 2. Concepto */}
                    <td className="px-5 py-4 text-xs sm:text-sm font-semibold text-slate-900">
                      {mov.concept}
                    </td>

                    {/* 3. Método */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-2xs font-semibold text-slate-700">
                        {mov.paymentMethod}
                      </span>
                    </td>

                    {/* 4. Monto (Verde para ingresos, Rojo/Naranja para egresos) */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <span
                        className={`inline-flex items-center justify-end gap-1 px-2.5 py-1 rounded-xl text-xs sm:text-sm font-extrabold font-mono ${
                          isExpense
                            ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        }`}
                      >
                        {isExpense ? (
                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        {isExpense ? "-" : "+"} {formatMoney(mov.amount)}
                      </span>
                    </td>

                    {/* 5. Usuario */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-medium text-slate-600">
                      {mov.user}
                    </td>
                  </tr>
                )
              })}

              {filteredMovements.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No se encontraron movimientos en el rango de fechas
                    seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Cierre de Caja Diario y Reporte (Intuitivo y Habilitado para Empleados) */}
      {isClosureModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cash-closure-title"
        >
          <div className="bg-slate-100 text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Cabecera Oscura */}
            <div className="px-6 py-4 bg-[#0B2B4C] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#F56C00] text-white">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="cash-closure-title"
                    className="text-base sm:text-lg font-bold font-heading"
                  >
                    Cierre de Caja Diario y Arqueo de Turno
                  </h2>
                  <p className="text-2xs text-blue-200/80">
                    Operador: {user?.name || "Empleado en Turno"} • Fecha:{" "}
                    {todayDateStr()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClosureModalOpen(false)}
                className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleConfirmClosure}
              className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1"
            >
              {/* Paso 1: Monto Inicial y Totales Calculados por el Sistema */}
              <Card className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    1. Resumen del Turno según Sistema
                  </h3>
                  <Badge variant="blue">Cálculo Automático</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="initial-cash">
                      Monto Inicial en Caja (Fondo de Cambio $)
                    </Label>
                    <Input
                      id="initial-cash"
                      type="number"
                      min="0"
                      value={initialCashInput}
                      onChange={(e) => setInitialCashInput(e.target.value)}
                      className="font-mono font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                      <span className="block text-3xs uppercase font-bold text-emerald-700">
                        Ingresos del Turno
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold font-mono text-emerald-800">
                        + {formatMoney(summary.totalIncome)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/70">
                      <span className="block text-3xs uppercase font-bold text-rose-700">
                        Egresos del Turno
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold font-mono text-rose-800">
                        - {formatMoney(summary.totalExpenses)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desglose esperado */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      Efectivo Esperado en Cajón
                    </span>
                    <span className="text-sm font-extrabold font-mono text-slate-900">
                      {formatMoney(expectedCashInDrawer)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      Tarjetas / Transferencias
                    </span>
                    <span className="text-sm font-extrabold font-mono text-slate-900">
                      {formatMoney(expectedDigital)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="block text-3xs uppercase font-bold text-[#00559D]">
                      Total Esperado Sistema
                    </span>
                    <span className="text-sm font-extrabold font-mono text-[#00559D]">
                      {formatMoney(expectedSystemTotal)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Paso 2: Recuento Real Ingresado por el Trabajador y Cálculo de Diferencias */}
              <Card className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    2. Recuento Real en Caja (Arqueo del Empleado)
                  </h3>
                  <Badge variant="orange">Recuento Físico</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="counted-cash"
                      className="flex items-center gap-1.5"
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Efectivo Real Contado en Cajón ($)
                    </Label>
                    <Input
                      id="counted-cash"
                      type="number"
                      min="0"
                      required
                      value={countedCashInput}
                      onChange={(e) => setCountedCashInput(e.target.value)}
                      placeholder="Ingresá el efectivo físico contado..."
                      className="font-mono font-bold"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="counted-cards"
                      className="flex items-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4 text-primary" />
                      Total Comprobantes Tarjeta / Transf. ($)
                    </Label>
                    <Input
                      id="counted-cards"
                      type="number"
                      min="0"
                      required
                      value={countedCardsInput}
                      onChange={(e) => setCountedCardsInput(e.target.value)}
                      placeholder="Ingresá la suma de cupones/transferencias..."
                      className="font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Indicador automático de Diferencia (Sobrante / Faltante / Exacto) */}
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    difference === 0
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : difference > 0
                        ? "bg-blue-50 border-blue-200 text-blue-900"
                        : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide">
                      {difference === 0
                        ? "Arqueo Perfecto (Sin diferencias)"
                        : difference > 0
                          ? "Sobrante detectado en caja"
                          : "Faltante detectado en caja"}
                    </p>
                    <p className="text-2xs opacity-80 mt-0.5">
                      Recuento real: {formatMoney(countedTotal)} vs. Sistema:{" "}
                      {formatMoney(expectedSystemTotal)}
                    </p>
                  </div>
                  <div className="text-lg font-extrabold font-mono">
                    {difference === 0
                      ? "$ 0"
                      : `${difference > 0 ? "+" : "-"} ${formatMoney(difference)}`}
                  </div>
                </div>

                <div>
                  <Label htmlFor="closure-notes">
                    Observaciones o Justificación de Diferencias (Opcional)
                  </Label>
                  <Input
                    id="closure-notes"
                    type="text"
                    value={closureNotes}
                    onChange={(e) => setClosureNotes(e.target.value)}
                    placeholder="Ej. Turno cerrado sin novedades / Cambio chico..."
                  />
                </div>
              </Card>

              <div className="flex justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsClosureModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="secondary"
                  icon={FileCheck2}
                  className="px-5 font-bold shadow-md"
                >
                  Confirmar Cierre y Generar Reporte Diario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Registrar Nuevo Movimiento (Ingreso / Egreso) */}
      {isNewMovModalOpen && (
        <Modal
          title="Registrar Movimiento de Caja"
          onClose={() => setIsNewMovModalOpen(false)}
        >
          <form onSubmit={handleCreateMovement} className="space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-700 font-medium">
                  {formError}
                </span>
              </div>
            )}

            <div>
              <Label htmlFor="mov-type">Tipo de Movimiento</Label>
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
                <option value="EXPENSE">Egreso / Salida (-)</option>
                <option value="INCOME">Ingreso (+)</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="mov-concept">Concepto *</Label>
              <Input
                id="mov-concept"
                type="text"
                required
                placeholder="Ej. Pago de cadetería, ingreso manual..."
                value={formData.concept}
                onChange={(e) =>
                  setFormData({ ...formData, concept: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mov-payment">Método</Label>
                <Select
                  id="mov-payment"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </Select>
              </div>

              <div>
                <Label htmlFor="mov-amount">Monto ($) *</Label>
                <Input
                  id="mov-amount"
                  type="number"
                  min="1"
                  required
                  placeholder="Ej. 5000"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="font-mono"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mov-user">Usuario</Label>
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

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewMovModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Guardar Movimiento
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
