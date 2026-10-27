import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BanknoteArrowDown,
  CreditCard,
  DollarSign,
  FileText,
  Plus,
  ReceiptText,
  Wrench,
} from "lucide-react"
import { Badge, Button, Card, Input, Label, Select } from "../components/ui"
import Modal from "../components/Modal"
import { useBranch } from "../context/BranchContext"
import { api, queryString } from "../services/api"

type SourceModule = "VENTAS" | "SAT" | "MANUAL"
type MovementType = "INCOME" | "EXPENSE"

type CashMovement = {
  id: string
  date: string
  branch: "Yofre Norte" | "Alta Córdoba"
  source: SourceModule
  concept: string
  paymentMethod: string
  user: string
  amount: number
  type: MovementType
}

const initialMovements: CashMovement[] = [
  {
    id: "MOV-001",
    date: "2026-10-27T10:15:00",
    branch: "Yofre Norte",
    source: "VENTAS",
    concept: "Venta de mostrador #000245",
    paymentMethod: "Efectivo",
    user: "Ventas Yofre",
    amount: 48500,
    type: "INCOME",
  },
  {
    id: "MOV-002",
    date: "2026-10-27T11:05:00",
    branch: "Alta Córdoba",
    source: "SAT",
    concept: "Cobro OT #000452",
    paymentMethod: "Tarjeta de crédito",
    user: "Técnico Alta Cba",
    amount: 76000,
    type: "INCOME",
  },
  {
    id: "MOV-003",
    date: "2026-10-27T12:30:00",
    branch: "Yofre Norte",
    source: "MANUAL",
    concept: "Compra de insumos de librería",
    paymentMethod: "Efectivo",
    user: "Administrador Principal",
    amount: 8900,
    type: "EXPENSE",
  },
  {
    id: "MOV-004",
    date: "2026-10-27T14:20:00",
    branch: "Alta Córdoba",
    source: "VENTAS",
    concept: "Venta de mostrador #000246",
    paymentMethod: "Mercado Pago",
    user: "Ventas Alta Cba",
    amount: 32750,
    type: "INCOME",
  },
  {
    id: "MOV-005",
    date: "2026-10-26T16:45:00",
    branch: "Yofre Norte",
    source: "SAT",
    concept: "Cobro OT #000451",
    paymentMethod: "Transferencia",
    user: "Administrador Principal",
    amount: 42500,
    type: "INCOME",
  },
]

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
})

const sourceLabel: Record<SourceModule, string> = {
  VENTAS: "Ventas",
  SAT: "SAT",
  MANUAL: "Manual",
}

const sourceVariant: Record<SourceModule, "green" | "blue" | "orange"> = {
  VENTAS: "green",
  SAT: "blue",
  MANUAL: "orange",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

export default function CashFlow() {
  const { branches } = useBranch()
  const [period, setPeriod] = useState("daily")
  const [branch, setBranch] = useState("Todas")
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [movements, setMovements] = useState<CashMovement[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formError, setFormError] = useState("")
  const [error, setError] = useState("")
  const selectedBranchId =
    branch === "Todas"
      ? ""
      : branches.find((item) => item.name === branch)?.id ?? ""

  const load = useCallback(async () => {
    try {
      const result = await api<{ data: CashMovement[] }>(
        `/cash-flow${queryString({
          branchId: selectedBranchId,
          period,
          date: selectedDate,
        })}`,
      )
      setMovements(result.data)
      setError("")
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudieron cargar los movimientos de caja.",
      )
    }
  }, [period, selectedBranchId, selectedDate])

  useEffect(() => {
    load()
  }, [load])

  const filteredMovements = useMemo(
    () =>
      movements.filter((movement) => {
        const matchesBranch = branch === "Todas" || movement.branch === branch
        const matchesDate = !selectedDate || movement.date.startsWith(selectedDate)
        return matchesBranch && (period === "daily" ? matchesDate : true)
      }),
    [branch, movements, period, selectedDate],
  )

  const summary = useMemo(() => {
    return filteredMovements.reduce(
      (current, movement) => {
        if (movement.type === "EXPENSE") {
          current.expenses += movement.amount
        } else if (movement.source === "VENTAS") {
          current.sales += movement.amount
        } else if (movement.source === "SAT") {
          current.sat += movement.amount
        } else {
          current.manualIncome += movement.amount
        }
        return current
      },
      { sales: 0, sat: 0, manualIncome: 0, expenses: 0 },
    )
  }, [filteredMovements])

  const balance = summary.sales + summary.sat + summary.manualIncome - summary.expenses

  const createManualMovement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const amount = Number(data.get("amount"))
    const type = String(data.get("type")) as MovementType
    const branchValue = String(data.get("branch"))
    const concept = String(data.get("concept")).trim()

    if (!concept || !Number.isFinite(amount) || amount <= 0) {
      setFormError("Completá un concepto y un importe mayor a cero.")
      return
    }

    const selected = branches.find((item) => item.name === branchValue)
    if (!selected) {
      setFormError("La sucursal seleccionada no es válida.")
      return
    }
    void api("/cash-flow/manual", {
      method: "POST",
      body: JSON.stringify({
        branchId: selected.id,
        type,
        concept,
        paymentMethod: String(data.get("paymentMethod")),
        amount,
      }),
    })
      .then(async () => {
        setFormError("")
        setIsModalOpen(false)
        await load()
      })
      .catch((reason) =>
        setFormError(
          reason instanceof Error
            ? reason.message
            : "No se pudo registrar el movimiento.",
        ),
      )
  }

  const cards = [
    {
      title: "Ingresos Ventas",
      value: summary.sales,
      icon: CreditCard,
      iconClass: "bg-blue-100 text-[#1565A9]",
    },
    {
      title: "Ingresos SAT",
      value: summary.sat,
      icon: Wrench,
      iconClass: "bg-orange-100 text-[#F28C28]",
    },
    {
      title: "Egresos / Ajustes",
      value: summary.expenses,
      icon: BanknoteArrowDown,
      iconClass: "bg-red-100 text-red-600",
    },
    {
      title: "Saldo Total en Caja",
      value: balance,
      icon: DollarSign,
      iconClass: "bg-green-100 text-green-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Caja y Movimientos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Registro centralizado de ingresos, egresos y ajustes de caja.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Nuevo Movimiento / Ajuste
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="cash-period">Período</Label>
            <Select
              id="cash-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="daily">Caja Diaria</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
              <option value="yearly">Anual</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="cash-branch">Sucursal</Label>
            <Select
              id="cash-branch"
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
            >
              <option>Todas</option>
              <option>Yofre Norte</option>
              <option>Alta Córdoba</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="cash-date">Consultar fecha</Label>
            <Input
              id="cash-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {currency.format(card.value)}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${card.iconClass}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Registro Histórico
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Ventas y órdenes técnicas deben registrar aquí sus cobros.
            </p>
          </div>
          <ReceiptText className="h-5 w-5 text-[#1565A9]" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Fecha/Hora",
                  "Sucursal",
                  "Módulo Origen",
                  "Concepto",
                  "Método de Pago",
                  "Usuario",
                  "Monto",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {formatDate(movement.date)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                    {movement.branch}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <Badge variant={sourceVariant[movement.source]}>
                      {sourceLabel[movement.source]}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {movement.concept}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {movement.paymentMethod}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {movement.user}
                  </td>
                  <td
                    className={`whitespace-nowrap px-5 py-4 text-right text-sm font-bold ${
                      movement.type === "EXPENSE"
                        ? "text-red-600"
                        : "text-green-700"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      {movement.type === "EXPENSE" ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                      {movement.type === "EXPENSE" ? "-" : "+"}
                      {currency.format(movement.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <Modal
          title="Nuevo Movimiento / Ajuste"
          onClose={() => {
            setFormError("")
            setIsModalOpen(false)
          }}
        >
          <form className="space-y-4" onSubmit={createManualMovement}>
            <div>
              <Label htmlFor="movement-type">Tipo de movimiento</Label>
              <Select id="movement-type" name="type" defaultValue="EXPENSE">
                <option value="INCOME">Ingreso manual</option>
                <option value="EXPENSE">Egreso / ajuste</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="movement-branch">Sucursal</Label>
              <Select id="movement-branch" name="branch" defaultValue="Yofre Norte">
                <option>Yofre Norte</option>
                <option>Alta Córdoba</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="movement-concept">Concepto / Justificación</Label>
              <Input
                id="movement-concept"
                name="concept"
                required
                placeholder="Ej. Diferencia de caja justificada"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="movement-payment">Método de pago</Label>
                <Select id="movement-payment" name="paymentMethod">
                  <option>Efectivo</option>
                  <option>Transferencia</option>
                  <option>Tarjeta</option>
                  <option>Otro</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="movement-amount">Importe</Label>
                <Input
                  id="movement-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0,00"
                />
              </div>
            </div>
            {formError && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" icon={FileText}>
                Registrar Movimiento
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
