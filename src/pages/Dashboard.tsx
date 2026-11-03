import React, { useState } from "react"
import { Card, Badge, Button, Input, Label } from "../components/ui"
import Modal from "../components/Modal"
import {
  TrendingUp,
  Wrench,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  MoreVertical,
  Download,
  Plus,
  ShoppingCart,
  AlertOctagon,
  PackagePlus,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react"
import { Link } from "react-router-dom"
import RegisterSaleModal, { SaleRecord } from "../components/RegisterSaleModal"

const todayOrders = [
  {
    id: "OT-10459",
    client: "Martín Pérez",
    device: "Samsung S22 Ultra",
    status: "En Reparación",
    time: "17:15 hs",
  },
  {
    id: "OT-10458",
    client: "Laura Gómez",
    device: "iPhone 13 Pro",
    status: "Listo para Entrega",
    time: "16:30 hs",
  },
  {
    id: "OT-10457",
    client: "Carlos Ruiz",
    device: "Notebook HP Pavilion",
    status: "Ingresado",
    time: "15:40 hs",
  },
  {
    id: "OT-10456",
    client: "Ana Martínez",
    device: "Motorola Edge 30",
    status: "En Diagnóstico",
    time: "14:20 hs",
  },
  {
    id: "OT-10455",
    client: "Diego Fernández",
    device: "iPad Air 5",
    status: "En Reparación",
    time: "13:05 hs",
  },
  {
    id: "OT-10454",
    client: "Sofía López",
    device: "iPhone 14 Pro Max",
    status: "Listo para Entrega",
    time: "11:50 hs",
  },
  {
    id: "OT-10453",
    client: "Lucas Cabrera",
    device: "Xiaomi Redmi Note 12",
    status: "Ingresado",
    time: "10:45 hs",
  },
  {
    id: "OT-10452",
    client: "Valeria Sosa",
    device: "MacBook Air M2",
    status: "En Diagnóstico",
    time: "09:30 hs",
  },
  {
    id: "OT-10451",
    client: "Nicolás Castro",
    device: "Samsung Galaxy A54",
    status: "Sin Solución",
    time: "09:10 hs",
  },
]

interface TodaySaleRow {
  id: string
  time: string
  itemsSummary: string
  paymentMethod: string
  total: number
}

const initialTodaySales: TodaySaleRow[] = [
  {
    id: "VTA-84910",
    time: "17:05 hs",
    itemsSummary: "2x Funda MagSafe iPhone 14, 1x Vidrio Templado 9D",
    paymentMethod: "Efectivo",
    total: 32850,
  },
  {
    id: "VTA-84892",
    time: "16:12 hs",
    itemsSummary: "1x Auriculares Bluetooth JBL Tune 510BT",
    paymentMethod: "Pago Mixto",
    total: 52000,
  },
  {
    id: "VTA-84875",
    time: "15:00 hs",
    itemsSummary: "1x Samsung Galaxy A54 256GB + Cargador 25W",
    paymentMethod: "Tarjeta",
    total: 685000,
  },
  {
    id: "VTA-84860",
    time: "13:45 hs",
    itemsSummary: "1x Módulo Display iPhone 13 Pro OLED",
    paymentMethod: "Transferencia",
    total: 125000,
  },
  {
    id: "VTA-84841",
    time: "12:20 hs",
    itemsSummary: "1x Cargador Rápido Samsung 25W + Cable USB-C",
    paymentMethod: "Efectivo",
    total: 28000,
  },
  {
    id: "VTA-84819",
    time: "11:10 hs",
    itemsSummary: "1x Motorola Moto G84 5G",
    paymentMethod: "Transferencia",
    total: 295650,
  },
  {
    id: "VTA-84802",
    time: "09:50 hs",
    itemsSummary: "2x Cargador Rápido Samsung 25W USB-C",
    paymentMethod: "Efectivo",
    total: 22000,
  },
]

interface StockAlertItem {
  sku: string
  product: string
  stock: number
  limit: number
  category: string
}

const initialStockAlerts: StockAlertItem[] = [
  {
    sku: "PRD-004",
    product: "Batería Original Motorola G22",
    stock: 0,
    limit: 3,
    category: "Repuestos",
  },
  {
    sku: "PRD-011",
    product: "Funda Silicona Moto G52",
    stock: 0,
    limit: 10,
    category: "Accesorios",
  },
  {
    sku: "PRD-001",
    product: "Módulo Display iPhone 13 Pro OLED",
    stock: 2,
    limit: 5,
    category: "Repuestos",
  },
  {
    sku: "PRD-006",
    product: "Pin de Carga Tipo C Samsung A52",
    stock: 3,
    limit: 10,
    category: "Repuestos",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Ingresado":
      return <Badge variant="gray">{status}</Badge>
    case "En Diagnóstico":
      return <Badge variant="blue">{status}</Badge>
    case "En Reparación":
      return <Badge variant="orange">{status}</Badge>
    case "Listo para Entrega":
      return <Badge variant="green">{status}</Badge>
    case "Sin Solución":
      return <Badge variant="red">{status}</Badge>
    default:
      return <Badge variant="gray">{status}</Badge>
  }
}

export default function Dashboard() {
  const [saleModalOpen, setSaleModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"orders" | "sales">("orders")
  const [todaySales, setTodaySales] =
    useState<TodaySaleRow[]>(initialTodaySales)
  const [todaySalesTotal, setTodaySalesTotal] = useState(1240500)
  const [stockAlerts, setStockAlerts] =
    useState<StockAlertItem[]>(initialStockAlerts)
  const [restockModalItem, setRestockModalItem] =
    useState<StockAlertItem | null>(null)
  const [restockQty, setRestockQty] = useState("10")
  const [restockToast, setRestockToast] = useState<string | null>(null)

  const handleSaleRegistered = (sale: SaleRecord) => {
    setTodaySalesTotal((prev) => prev + sale.total)
    setTodaySales((prev) => [
      {
        id: sale.id,
        time: `${sale.time} hs`,
        itemsSummary: sale.items
          .map((i) => `${i.quantity}x ${i.name}`)
          .join(", "),
        paymentMethod: sale.paymentSummary,
        total: sale.total,
      },
      ...prev,
    ])
    setActiveTab("sales")
  }

  const openRestockModal = (item: StockAlertItem) => {
    setRestockModalItem(item)
    setRestockQty(String(Math.max(5, item.limit * 2 - item.stock)))
  }

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!restockModalItem) return

    const added = Math.max(1, Number(restockQty) || 1)
    const targetName = restockModalItem.product

    setStockAlerts((prev) =>
      prev.filter((item) => item.sku !== restockModalItem.sku),
    )
    setRestockModalItem(null)
    setRestockToast(
      `Se repusieron +${added} un. de "${targetName}". El artículo fue removido de las alertas.`,
    )
    setTimeout(() => setRestockToast(null), 4000)
  }

  const stats = [
    {
      name: "Ventas de hoy",
      value: `$ ${todaySalesTotal.toLocaleString("es-AR")}`,
      subtitle: "+12% vs. ayer",
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50 border border-blue-200/50",
    },
    {
      name: "Órdenes de Hoy",
      value: `${todayOrders.length}`,
      subtitle: "Ingresadas en la jornada",
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-50 border border-orange-200/50",
    },
    {
      name: "Reparaciones Listas",
      value: "12",
      subtitle: "Pendientes de retiro",
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border border-emerald-200/50",
    },
    {
      name: "Alertas de Stock",
      value: `${stockAlerts.length}`,
      subtitle:
        stockAlerts.length === 0
          ? "Stock al día"
          : `${stockAlerts.filter((a) => a.stock === 0).length} agotados críticos`,
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50 border border-rose-200/50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Toast flotante de reposición */}
      {restockToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{restockToast}</span>
        </div>
      )}

      {/* Encabezado responsive con botones claramente diferenciados */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Panel General
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Resumen en tiempo real del estado de tu sucursal
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* 1. Botón Blanco: Descargar Reporte */}
          <Button
            variant="outline"
            className="text-xs sm:text-sm py-2.5 px-4 bg-white"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Descargar Reporte
          </Button>

          {/* 2. Botón Azul Corporativo Sólido: + Nueva Orden */}
          <Link to="/servicio-tecnico/nueva">
            <Button
              variant="primary"
              className="text-xs sm:text-sm py-2.5 px-4 sm:px-5 font-bold shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
              Nueva Orden
            </Button>
          </Link>

          {/* 3. Botón Naranja: + Registrar Venta */}
          <Button
            variant="secondary"
            onClick={() => setSaleModalOpen(true)}
            className="text-xs sm:text-sm py-2.5 px-4 sm:px-5 font-bold shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Registrar Venta
          </Button>
        </div>
      </div>

      {/* Grid de Métricas / Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item) => (
          <Card
            key={item.name}
            className="p-4 sm:p-5 flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center min-w-0">
              <div className={`p-3 rounded-2xl ${item.bg} shrink-0`}>
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
              </div>
              <div className="ml-3.5 min-w-0">
                <p className="text-xs font-medium text-slate-500 truncate">
                  {item.name}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate font-heading mt-0.5">
                  {item.value}
                </h3>
                <p className="text-xs text-gray-500 font-normal mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Tarjeta Principal Izquierda con Sistema de Pestañas (Tabs): 🔧 Órdenes del Día y 🛒 Ventas de Hoy */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden h-[480px]">
          <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-white">
            {/* Selector de Pestañas Grande y Claro */}
            <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200/70">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#00559D] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span aria-hidden="true">🔧</span>
                <span>Órdenes del Día</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-2xs font-bold ${
                    activeTab === "orders"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {todayOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("sales")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "sales"
                    ? "bg-[#00559D] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span aria-hidden="true">🛒</span>
                <span>Ventas de Hoy</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-2xs font-bold ${
                    activeTab === "sales"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {todaySales.length}
                </span>
              </button>
            </div>

            <Link
              to={activeTab === "orders" ? "/servicio-tecnico" : "/ventas"}
              className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center group self-end sm:self-center"
            >
              {activeTab === "orders" ? "Ver taller" : "Ir a ventas"}{" "}
              <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Listado a altura completa con scroll vertical limpio (sin pie de tabla ni espacio sobrante) */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
            {activeTab === "orders" ? (
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/95 sticky top-0 z-10 backdrop-blur-xs">
                  <tr>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Orden / Hora
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {todayOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                        <span className="block text-xs font-bold text-primary">
                          {order.id}
                        </span>
                        <span className="flex items-center gap-1 text-2xs text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {order.time}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs font-medium text-slate-900">
                        {order.client}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                        {order.device}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-xs">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-right text-xs font-medium">
                        <Link
                          to={`/servicio-tecnico/${order.id.replace("OT-", "")}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 inline-block transition-colors"
                          aria-label={`Ver detalles de ${order.id}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/95 sticky top-0 z-10 backdrop-blur-xs">
                  <tr>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Artículos
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Método de Pago
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {todaySales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                        <span className="block text-xs font-bold text-primary">
                          {sale.id}
                        </span>
                        <span className="flex items-center gap-1 text-2xs text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {sale.time}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-xs font-semibold text-slate-800 max-w-xs truncate">
                        {sale.itemsSummary}
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold bg-slate-100 text-slate-700">
                          <CreditCard className="w-3 h-3 text-primary" />
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 whitespace-nowrap text-right text-xs sm:text-sm font-extrabold text-emerald-700 font-mono">
                        $ {sale.total.toLocaleString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Alertas de Stock nivelada en altura (h-[480px]) */}
        <Card className="flex flex-col overflow-hidden h-[480px]">
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Alertas de Stock
            </h2>
            <p className="text-2xs sm:text-xs text-slate-400 mt-0.5">
              Artículos críticos o agotados por reponer
            </p>
          </div>

          <div className="p-4 sm:p-5 flex-1 min-h-0 flex flex-col justify-between">
            {stockAlerts.length === 0 ? (
              <div className="py-12 px-4 text-center flex flex-col items-center justify-center flex-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  ¡Todo el stock está al día!
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  No quedan artículos por debajo del punto de reorden.
                </p>
              </div>
            ) : (
              <ul className="space-y-3 overflow-y-auto pr-1">
                {stockAlerts.map((item) => {
                  const isOut = item.stock === 0
                  const percentage = Math.min(
                    100,
                    Math.round((item.stock / item.limit) * 100),
                  )
                  return (
                    <li
                      key={item.sku}
                      className={`p-3 rounded-2xl border transition-all ${
                        isOut
                          ? "bg-rose-50/60 border-rose-200/80 hover:border-rose-300"
                          : "bg-orange-50/50 border-orange-200/70 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start min-w-0">
                          <div
                            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              isOut
                                ? "bg-rose-100 text-rose-600"
                                : "bg-orange-100 text-[#F56C00]"
                            }`}
                          >
                            {isOut ? (
                              <AlertOctagon className="w-4 h-4" />
                            ) : (
                              <AlertTriangle className="w-4 h-4" />
                            )}
                          </div>
                          <div className="ml-2.5 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {item.product}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-3xs font-mono font-semibold text-slate-500">
                                {item.sku}
                              </span>
                              <span className="text-3xs text-slate-400">•</span>
                              <span className="text-3xs text-slate-500">
                                Mínimo: {item.limit} un.
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-full text-3xs font-bold border ${
                            isOut
                              ? "bg-rose-600 text-white border-rose-700 shadow-2xs"
                              : "bg-orange-500 text-white border-orange-600 shadow-2xs"
                          }`}
                        >
                          {isOut ? "AGOTADO" : `${item.stock} un.`}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/80 rounded-full overflow-hidden border border-slate-200/60">
                          <div
                            className={`h-full rounded-full ${
                              isOut ? "bg-rose-500" : "bg-[#F56C00]"
                            }`}
                            style={{ width: `${isOut ? 6 : percentage}%` }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => openRestockModal(item)}
                          className={`text-2xs font-bold shrink-0 hover:underline cursor-pointer ${
                            isOut ? "text-rose-700" : "text-orange-700"
                          }`}
                        >
                          Reponer →
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}

            <div className="pt-3 border-t border-slate-100 shrink-0 mt-3">
              <Link to="/inventario" className="block">
                <Button
                  variant="primary"
                  className="w-full text-xs py-2.5 font-semibold"
                >
                  <PackagePlus className="w-3.5 h-3.5 mr-1.5" />
                  Gestionar Stock
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal rápido de confirmación de reposición */}
      {restockModalItem && (
        <Modal
          title="Confirmar Reposición de Stock"
          onClose={() => setRestockModalItem(null)}
        >
          <form onSubmit={handleConfirmRestock} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-bold text-slate-900">
                {restockModalItem.product}
              </p>
              <p className="text-2xs text-slate-500 mt-0.5">
                Código: <span className="font-mono">{restockModalItem.sku}</span>{" "}
                • Stock actual:{" "}
                <strong className="text-rose-600">
                  {restockModalItem.stock} un.
                </strong>{" "}
                (Mínimo requerido: {restockModalItem.limit} un.)
              </p>
            </div>

            <div>
              <Label htmlFor="restock-qty">
                Cantidad de unidades a ingresar
              </Label>
              <Input
                id="restock-qty"
                type="number"
                min="1"
                required
                autoFocus
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRestockModalItem(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Confirmar Reposición
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de Registrar Venta */}
      <RegisterSaleModal
        isOpen={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        onSaleRegistered={handleSaleRegistered}
      />
    </div>
  )
}
