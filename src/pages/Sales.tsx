import React, { useState } from "react"
import { Card, Badge, Button } from "../components/ui"
import {
  Plus,
  Receipt,
  Clock,
  User,
  CreditCard,
  TrendingUp,
  ShoppingBag,
} from "lucide-react"
import RegisterSaleModal, {
  RegisterSaleForm,
  SaleRecord,
} from "../components/RegisterSaleModal"

const initialSalesHistory: SaleRecord[] = [
  {
    id: "VTA-84910",
    date: "Hoy",
    time: "16:20",
    seller: "Administrador",
    items: [
      {
        id: "PRD-002",
        barcode: "7790002",
        name: "Funda Silicona MagSafe iPhone 14",
        price: 15000,
        stock: 14,
        minStock: 5,
        category: "Accesorios",
        quantity: 2,
      },
      {
        id: "PRD-005",
        barcode: "7790005",
        name: "Vidrio Templado 9D Full Glue",
        price: 6500,
        stock: 25,
        minStock: 10,
        category: "Accesorios",
        quantity: 1,
      },
    ],
    subtotal: 36500,
    discountAmount: 3650,
    total: 32850,
    paymentSummary: "Efectivo (10% OFF)",
  },
  {
    id: "VTA-84892",
    date: "Hoy",
    time: "14:45",
    seller: "Vendedor Mostrador",
    items: [
      {
        id: "PRD-003",
        barcode: "7790003",
        name: "Auriculares Bluetooth JBL Tune 510BT",
        price: 52000,
        stock: 8,
        minStock: 4,
        category: "Audio",
        quantity: 1,
      },
    ],
    subtotal: 52000,
    discountAmount: 0,
    total: 52000,
    paymentSummary:
      "Mixto (Efectivo: $20.000 + MP/Transf.: $32.000)",
  },
]

export default function Sales() {
  const [modalOpen, setModalOpen] = useState(false)
  const [salesHistory, setSalesHistory] =
    useState<SaleRecord[]>(initialSalesHistory)

  const handleSaleRegistered = (newSale: SaleRecord) => {
    setSalesHistory((prev) => [newSale, ...prev])
  }

  const sessionTotal = salesHistory.reduce((acc, s) => acc + s.total, 0)

  return (
    <div className="space-y-6">
      {/* Encabezado con botón prominente "+ Registrar Venta" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Módulo de Ventas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Terminal de facturación rápida con lector de código de barras y cobro
            multimétodo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-3xs uppercase font-bold text-slate-400">
                Facturado en turno ({salesHistory.length})
              </span>
              <span className="block text-xs font-extrabold text-slate-900 font-heading">
                $ {sessionTotal.toLocaleString("es-AR")}
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={() => setModalOpen(true)}
            className="text-xs sm:text-sm py-2.5 px-4 sm:px-5 font-bold shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Registrar Venta
          </Button>
        </div>
      </div>

      {/* Formulario Principal de Punto de Venta integrado en la vista */}
      <RegisterSaleForm onSaleRegistered={handleSaleRegistered} />

      {/* Historial de Operaciones Recientes del Turno */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-primary border border-blue-200/50">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                Últimas Ventas Registradas
              </h2>
              <p className="text-2xs text-slate-400">
                Comprobantes emitidos durante la sesión actual
              </p>
            </div>
          </div>
          <Badge variant="blue">{salesHistory.length} operaciones</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Operación
                </th>
                <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Artículos
                </th>
                <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Vendedor / Hora
                </th>
                <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Método de Pago
                </th>
                <th className="px-4 sm:px-5 py-3 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Cobrado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {salesHistory.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-bold text-primary">
                      {sale.id}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">
                        {sale.items
                          .map((i) => `${i.quantity}x ${i.name}`)
                          .join(", ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3 text-2xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <User className="w-3 h-3 text-slate-400" />
                        {sale.seller}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {sale.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold bg-slate-100 text-slate-700">
                      <CreditCard className="w-3 h-3 text-primary" />
                      {sale.paymentSummary}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-right">
                    <span className="text-xs font-extrabold text-slate-900 font-heading">
                      $ {sale.total.toLocaleString("es-AR")}
                    </span>
                    {sale.discountAmount > 0 && (
                      <span className="block text-3xs font-semibold text-emerald-600">
                        Desc: -$ {sale.discountAmount.toLocaleString("es-AR")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal "+ Registrar Venta" */}
      <RegisterSaleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaleRegistered={handleSaleRegistered}
      />
    </div>
  )
}
