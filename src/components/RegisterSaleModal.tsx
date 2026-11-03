import React, { useState, useEffect, useRef } from "react"
import {
  Barcode,
  Plus,
  Minus,
  Trash2,
  User,
  Calendar,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  Split,
  Percent,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  X,
  Check,
} from "lucide-react"
import { Card, Button, Input, Select, Badge, Label } from "./ui"
import Modal from "./Modal"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"

export interface SaleCatalogProduct {
  id: string
  code: string
  barcode: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
}

export interface CartItem extends SaleCatalogProduct {
  quantity: number
}

export interface CompletedSaleRecord {
  id: string
  date: string
  seller: string
  branch: string
  itemsCount: number
  subtotal: number
  discountAmount: number
  total: number
  paymentMethod: string
  paymentBreakdown?: {
    efectivo: number
    tarjeta: number
    transferencia: number
  }
}

export const CATALOG_PRODUCTS: SaleCatalogProduct[] = [
  {
    id: "2bac0ac1-eccd-4fb1-833a-d7442d088f2f",
    code: "PRD-001",
    barcode: "7790001",
    name: "Módulo Display iPhone 13 Pro",
    category: "Repuestos",
    price: 125000,
    stock: 2,
    minStock: 3,
  },
  {
    id: "ab5487df-945e-47c1-a5a3-08f89fd354b5",
    code: "PRD-002",
    barcode: "7790002",
    name: "Samsung Galaxy S23 Ultra 256GB",
    category: "Equipos",
    price: 1450000,
    stock: 4,
    minStock: 2,
  },
  {
    id: "19e363d0-0473-42b6-ac5f-7732121b8f6b",
    code: "PRD-003",
    barcode: "7790003",
    name: "Funda Silicona MagSafe iPhone 14",
    category: "Accesorios",
    price: 15000,
    stock: 15,
    minStock: 5,
  },
  {
    id: "04e93d64-bb74-4c6f-982e-ff19c8f82325",
    code: "PRD-004",
    barcode: "7790004",
    name: "Batería Original Motorola G22",
    category: "Repuestos",
    price: 35000,
    stock: 0,
    minStock: 3,
  },
  {
    id: "1a092c8f-7fff-401d-a11f-6bbf91885a2d",
    code: "PRD-005",
    barcode: "7790005",
    name: "Auriculares JBL Tune 510BT",
    category: "Audio",
    price: 45000,
    stock: 8,
    minStock: 3,
  },
  {
    id: "6f8a92c1-12ab-4ef0-9911-3c4d5e6f7a8b",
    code: "PRD-006",
    barcode: "7790006",
    name: "Cargador Rápido Apple 20W USB-C",
    category: "Accesorios",
    price: 28000,
    stock: 1,
    minStock: 4,
  },
]

interface ToastAlert {
  id: number
  type: "warning" | "error" | "success"
  title: string
  message: string
}

export function RegisterSaleForm({
  onSaleSuccess,
  onCloseModal,
  isModal = false,
}: {
  onSaleSuccess?: (sale: CompletedSaleRecord) => void
  onCloseModal?: () => void
  isModal?: boolean
}) {
  const { user } = useAuth()
  const { branches, branchId } = useBranch()
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  const [barcodeQuery, setBarcodeQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  // Descuento
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent")
  const [discountValue, setDiscountValue] = useState<string>("")

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState<
    "efectivo" | "tarjeta" | "transferencia" | "mixto"
  >("efectivo")
  const [mixedPayments, setMixedPayments] = useState({
    efectivo: "",
    tarjeta: "",
    transferencia: "",
  })

  // Confirmación de cancelación
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Toasts no intrusivos
  const [toasts, setToasts] = useState<ToastAlert[]>([])

  const addToast = (
    type: "warning" | "error" | "success",
    title: string,
    message: string,
  ) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }

  // Reloj en tiempo real y auto-focus inicial
  useEffect(() => {
    barcodeInputRef.current?.focus()
    const timer = setInterval(() => setCurrentDateTime(new Date()), 15000)
    return () => clearInterval(timer)
  }, [])

  // Cálculos de totales
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const numericDiscountInput = Math.max(0, Number(discountValue) || 0)
  const discountAmount =
    discountType === "percent"
      ? Math.round(subtotal * (Math.min(100, numericDiscountInput) / 100))
      : Math.min(subtotal, numericDiscountInput)
  const total = Math.max(0, subtotal - discountAmount)

  // Cálculo para pago mixto
  const mixedEfectivo = Math.max(0, Number(mixedPayments.efectivo) || 0)
  const mixedTarjeta = Math.max(0, Number(mixedPayments.tarjeta) || 0)
  const mixedTransferencia = Math.max(0, Number(mixedPayments.transferencia) || 0)
  const mixedTotalCovered = mixedEfectivo + mixedTarjeta + mixedTransferencia
  const mixedRemaining = total - mixedTotalCovered

  // Función para escanear / agregar un producto al carrito
  const handleAddProduct = (product: SaleCatalogProduct) => {
    if (product.stock <= 0) {
      addToast(
        "error",
        "Producto sin stock disponible",
        `${product.name} (${product.code}) tiene 0 unidades en stock y no puede agregarse.`,
      )
      barcodeInputRef.current?.focus()
      return
    }

    const existing = cart.find((item) => item.id === product.id)
    const nextQty = existing ? existing.quantity + 1 : 1

    if (nextQty > product.stock) {
      addToast(
        "warning",
        "Límite de stock alcanzado",
        `Solo hay ${product.stock} un. disponibles de ${product.name}.`,
      )
      barcodeInputRef.current?.focus()
      return
    }

    if (product.stock <= product.minStock) {
      addToast(
        "warning",
        "Alerta de bajo stock",
        `${product.name} está en nivel crítico (quedan ${product.stock} un. disponibles).`,
      )
    }

    setCart((prev) =>
      existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantity: nextQty } : item,
          )
        : [...prev, { ...product, quantity: 1 }],
    )
    setBarcodeQuery("")
    barcodeInputRef.current?.focus()
  }

  const handleBarcodeSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const query = barcodeQuery.trim().toLowerCase()
    if (!query) return

    const match = CATALOG_PRODUCTS.find(
      (p) =>
        p.barcode.toLowerCase() === query ||
        p.code.toLowerCase() === query ||
        p.name.toLowerCase().includes(query),
    )

    if (!match) {
      addToast(
        "error",
        "Código no encontrado",
        `No se encontró ningún artículo con el código o nombre "${barcodeQuery}".`,
      )
      return
    }

    handleAddProduct(match)
  }

  const updateItemQuantity = (id: string, delta: number) => {
    const target = cart.find((item) => item.id === id)
    if (!target) return

    const nextQty = target.quantity + delta
    if (nextQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
      return
    }

    if (nextQty > target.stock) {
      addToast(
        "warning",
        "Stock insuficiente",
        `No podés superar las ${target.stock} unidades disponibles de ${target.name}.`,
      )
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: nextQty } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
    barcodeInputRef.current?.focus()
  }

  const resetForm = () => {
    setCart([])
    setBarcodeQuery("")
    setDiscountValue("")
    setPaymentMethod("efectivo")
    setMixedPayments({ efectivo: "", tarjeta: "", transferencia: "" })
    setShowCancelConfirm(false)
    setTimeout(() => barcodeInputRef.current?.focus(), 50)
  }

  const handleConfirmSale = () => {
    if (cart.length === 0) {
      addToast(
        "error",
        "Venta vacía",
        "Escaneá o seleccioná al menos un producto antes de confirmar la operación.",
      )
      barcodeInputRef.current?.focus()
      return
    }

    if (paymentMethod === "mixto") {
      if (mixedTotalCovered !== total) {
        addToast(
          "error",
          "Pago mixto incompleto",
          mixedRemaining > 0
            ? `Faltan cubrir $ ${mixedRemaining.toLocaleString("es-AR")} para alcanzar el total de la venta.`
            : `El monto ingresado supera el total por $ ${Math.abs(mixedRemaining).toLocaleString("es-AR")}.`,
        )
        return
      }
    }

    const activeBranchName =
      branches.find((b) => b.id === branchId)?.name ||
      user?.branchName ||
      "Sucursal Central"

    const paymentLabels: Record<string, string> = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta",
      transferencia: "Transferencia / Mercado Pago",
      mixto: "Pago Mixto",
    }

    const record: CompletedSaleRecord = {
      id: `V-${Math.floor(10000 + Math.random() * 90000)}`,
      date: currentDateTime.toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      seller: user?.name || "Administrador Principal",
      branch: activeBranchName,
      itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
      subtotal,
      discountAmount,
      total,
      paymentMethod: paymentLabels[paymentMethod],
      paymentBreakdown:
        paymentMethod === "mixto"
          ? {
              efectivo: mixedEfectivo,
              tarjeta: mixedTarjeta,
              transferencia: mixedTransferencia,
            }
          : undefined,
    }

    addToast(
      "success",
      "¡Venta registrada con éxito!",
      `Comprobante ${record.id} por $ ${total.toLocaleString("es-AR")} procesado correctamente.`,
    )

    onSaleSuccess?.(record)
    resetForm()
  }

  const handleRequestCancel = () => {
    if (cart.length === 0 && !discountValue) {
      onCloseModal?.()
      return
    }
    setShowCancelConfirm(true)
  }

  return (
    <div className="space-y-5 relative">
      {/* Contenedor flotante de Toasts no intrusivos */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border animate-fadeIn ${
                t.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : t.type === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}
            >
              {t.type === "error" && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              {t.type === "warning" && (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              {t.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold">{t.title}</p>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((item) => item.id !== t.id))
                }
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Barra superior de metadatos de la operación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="p-2 rounded-xl bg-blue-50 text-[#00559D]">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-2xs uppercase tracking-wider font-semibold text-slate-400">
              Vendedor a cargo
            </span>
            <span className="block text-xs font-bold text-slate-900 truncate">
              {user?.name || "Administrador Principal"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="p-2 rounded-xl bg-orange-50 text-[#F56C00]">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-2xs uppercase tracking-wider font-semibold text-slate-400">
              Fecha de Operación
            </span>
            <span className="block text-xs font-bold text-slate-900">
              {currentDateTime.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-2xs uppercase tracking-wider font-semibold text-slate-400">
              Hora Automática
            </span>
            <span className="block text-xs font-bold text-slate-900">
              {currentDateTime.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              hs
            </span>
          </div>
        </div>
      </div>

      {/* Cuerpo en 2 columnas: Escáner + Grilla (Izquierda) y Cobro + Descuentos (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Escáner de Código de Barras y Grilla de Productos */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          <Card className="p-4 sm:p-5">
            <form onSubmit={handleBarcodeSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="barcode-scanner" className="mb-0 flex items-center gap-1.5 text-slate-700">
                  <Barcode className="w-4 h-4 text-[#00559D]" />
                  <span>Escanear Código de Barras o SKU</span>
                </Label>
                <span className="text-2xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Auto-Focus Activo
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Barcode className="w-4 h-4" />
                  </div>
                  <input
                    ref={barcodeInputRef}
                    id="barcode-scanner"
                    type="text"
                    autoFocus
                    value={barcodeQuery}
                    onChange={(e) => setBarcodeQuery(e.target.value)}
                    placeholder="Escaneá el código de barras (ej. 7790001 o PRD-001) y presioná Enter..."
                    className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <Button type="submit" icon={Plus} className="shrink-0">
                  Agregar
                </Button>
              </div>

              {/* Accesos rápidos de escaneo para demostración (incluye stock normal, crítico y sin stock) */}
              <div className="pt-1">
                <p className="text-2xs text-slate-400 font-medium mb-2">
                  Simulador rápido de lector de código de barras (clic para escanear):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CATALOG_PRODUCTS.map((prod) => {
                    const isOut = prod.stock === 0
                    const isLow = prod.stock > 0 && prod.stock <= prod.minStock
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleAddProduct(prod)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-2xs font-medium border transition-all cursor-pointer ${
                          isOut
                            ? "bg-rose-50/70 border-rose-200 text-rose-700 hover:bg-rose-100"
                            : isLow
                              ? "bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-mono font-bold">{prod.barcode}</span>
                        <span className="truncate max-w-[130px]">{prod.name}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-3xs font-bold ${
                            isOut
                              ? "bg-rose-200/80 text-rose-900"
                              : isLow
                                ? "bg-amber-200/80 text-amber-900"
                                : "bg-slate-200/80 text-slate-700"
                          }`}
                        >
                          {isOut ? "0 un." : `${prod.stock} un.`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </form>
          </Card>

          {/* Grilla de productos de la venta actual */}
          <Card className="overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#00559D]" />
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Detalle de Productos Escaneados
                </h3>
              </div>
              <Badge variant="blue">
                {cart.reduce((acc, i) => acc + i.quantity, 0)} artículos
              </Badge>
            </div>

            {cart.length === 0 ? (
              <div className="py-14 px-4 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Barcode className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No hay productos cargados en la venta
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Escaneá un código de barras arriba o seleccioná un artículo de acceso rápido para comenzar.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/90">
                    <tr>
                      <th className="px-4 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-4 py-3 text-center text-2xs font-bold text-slate-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-4 py-3 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-4 py-3 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                      <th className="px-3 py-3 text-center text-2xs font-bold text-slate-500 uppercase tracking-wider w-10">
                        <span className="sr-only">Quitar</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {cart.map((item) => {
                      const isLow = item.stock <= item.minStock
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex flex-col">
                              <span className="text-xs sm:text-sm font-semibold text-slate-900">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-2xs font-mono text-slate-400">
                                  {item.code} • {item.barcode}
                                </span>
                                {isLow && (
                                  <span className="text-3xs font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                    Stock crítico ({item.stock} disp.)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Controles in-line rápidos (+) y (-) */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-center">
                            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, -1)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-slate-900 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, 1)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-2xs transition-all cursor-pointer"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs font-medium text-slate-600 font-mono">
                            $ {item.price.toLocaleString("es-AR")}
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs sm:text-sm font-bold text-slate-900 font-mono">
                            $ {(item.price * item.quantity).toLocaleString("es-AR")}
                          </td>

                          <td className="px-3 py-3.5 whitespace-nowrap text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              aria-label={`Eliminar ${item.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Columna Derecha: Descuentos, Métodos de Pago y Total a Cobrar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          <Card className="p-5 space-y-5">
            {/* Sección de Descuento Manual / Promocional */}
            <div>
              <Label className="flex items-center justify-between">
                <span>Descuento Manual / Promocional</span>
                <span className="text-2xs font-normal text-slate-400 lowercase">
                  opcional
                </span>
              </Label>
              <div className="flex gap-2 mt-1.5">
                <div className="inline-flex rounded-xl border border-slate-200 p-1 bg-slate-50 shrink-0">
                  <button
                    type="button"
                    onClick={() => setDiscountType("percent")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      discountType === "percent"
                        ? "bg-[#00559D] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>%</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("fixed")}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      discountType === "fixed"
                        ? "bg-[#00559D] text-white shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Monto</span>
                  </button>
                </div>

                <Input
                  type="number"
                  min="0"
                  max={discountType === "percent" ? "100" : undefined}
                  placeholder={
                    discountType === "percent" ? "Ej: 10 (%)" : "Ej: 5000 ($)"
                  }
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            {/* Selector de Método de Pago */}
            <div className="pt-4 border-t border-slate-100">
              <Label>Método de Pago</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("efectivo")}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "efectivo"
                      ? "border-[#00559D] bg-blue-50/60 text-[#00559D] ring-2 ring-[#00559D]/15"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Banknote className="w-4 h-4 shrink-0" />
                  <span>Efectivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("tarjeta")}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "tarjeta"
                      ? "border-[#00559D] bg-blue-50/60 text-[#00559D] ring-2 ring-[#00559D]/15"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("transferencia")}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "transferencia"
                      ? "border-[#00559D] bg-blue-50/60 text-[#00559D] ring-2 ring-[#00559D]/15"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span className="truncate">Transf. / MP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("mixto")}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    paymentMethod === "mixto"
                      ? "border-[#F56C00] bg-orange-50/70 text-[#D65E00] ring-2 ring-[#F56C00]/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Split className="w-4 h-4 shrink-0" />
                  <span>Pago Mixto</span>
                </button>
              </div>
            </div>

            {/* Inputs dinámicos para Pago Mixto / Dividido */}
            {paymentMethod === "mixto" && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Distribución de Pago Mixto
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMixedPayments({
                        efectivo: String(Math.floor(total / 2)),
                        tarjeta: String(total - Math.floor(total / 2)),
                        transferencia: "0",
                      })
                    }
                    className="text-2xs font-semibold text-[#00559D] hover:underline cursor-pointer"
                  >
                    Dividir 50/50
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-28 shrink-0 flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-slate-400" />
                      Efectivo:
                    </span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="$ 0"
                      value={mixedPayments.efectivo}
                      onChange={(e) =>
                        setMixedPayments((prev) => ({
                          ...prev,
                          efectivo: e.target.value,
                        }))
                      }
                      className="py-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-28 shrink-0 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      Tarjeta:
                    </span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="$ 0"
                      value={mixedPayments.tarjeta}
                      onChange={(e) =>
                        setMixedPayments((prev) => ({
                          ...prev,
                          tarjeta: e.target.value,
                        }))
                      }
                      className="py-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-28 shrink-0 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      Transf. / MP:
                    </span>
                    <Input
                      type="number"
                      min="0"
                      placeholder="$ 0"
                      value={mixedPayments.transferencia}
                      onChange={(e) =>
                        setMixedPayments((prev) => ({
                          ...prev,
                          transferencia: e.target.value,
                        }))
                      }
                      className="py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between font-semibold ${
                    mixedRemaining === 0 && total > 0
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span>
                    {mixedRemaining === 0 && total > 0
                      ? "Total cubierto exactamente"
                      : mixedRemaining > 0
                        ? "Restante por cubrir:"
                        : "Excedente ingresado:"}
                  </span>
                  <span className="font-mono font-bold">
                    $ {Math.abs(mixedRemaining).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            )}

            {/* Resumen de Totales */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} ítems)</span>
                <span className="font-mono font-medium text-slate-700">
                  $ {subtotal.toLocaleString("es-AR")}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>
                    Descuento aplicado{" "}
                    {discountType === "percent" ? `(${numericDiscountInput}%)` : ""}
                  </span>
                  <span className="font-mono">
                    - $ {discountAmount.toLocaleString("es-AR")}
                  </span>
                </div>
              )}

              <div className="flex items-baseline justify-between pt-3 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Total a Cobrar
                </span>
                <span className="text-2xl font-extrabold text-[#00559D] font-mono">
                  $ {total.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            {/* Botones de Acción Principal y Reversión/Cancelación */}
            <div className="pt-2 space-y-2.5">
              <Button
                type="button"
                onClick={handleConfirmSale}
                icon={Check}
                className="w-full py-3 text-sm font-bold shadow-md"
              >
                Confirmar y Registrar Venta
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleRequestCancel}
                className="w-full py-2.5 text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
              >
                Cancelar Venta en Curso
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal previo de confirmación para cancelar la venta */}
      {showCancelConfirm && (
        <Modal
          title="Confirmar cancelación de venta"
          onClose={() => setShowCancelConfirm(false)}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm mb-1">
                  ¿Estás seguro de cancelar esta venta?
                </p>
                <p>
                  Se descartarán los{" "}
                  <strong>{cart.reduce((a, b) => a + b.quantity, 0)} productos</strong>{" "}
                  cargados y los descuentos configurados en la operación actual.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
              >
                Volver a la venta
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  resetForm()
                  addToast(
                    "warning",
                    "Venta cancelada",
                    "Se limpió el formulario y la operación en curso fue revertida.",
                  )
                  if (isModal) {
                    onCloseModal?.()
                  }
                }}
              >
                Sí, cancelar venta
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default function RegisterSaleModal({
  open,
  onClose,
  onSaleSuccess,
}: {
  open: boolean
  onClose: () => void
  onSaleSuccess?: (sale: CompletedSaleRecord) => void
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-sale-modal-title"
    >
      <div className="bg-slate-100 text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="px-6 py-4 bg-[#0B2B4C] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F56C00] text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="register-sale-modal-title"
                className="text-base sm:text-lg font-bold font-heading"
              >
                Registrar Nueva Venta
              </h2>
              <p className="text-2xs text-blue-200/80">
                Terminal Punto de Venta (POS) • Escaneo rápido de código de barras
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido scrollable del Modal */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <RegisterSaleForm
            isModal
            onCloseModal={onClose}
            onSaleSuccess={(sale) => {
              onSaleSuccess?.(sale)
            }}
          />
        </div>
      </div>
    </div>
  )
}
