import React, { useState, useEffect, useRef } from "react"
import {
  Barcode,
  Plus,
  Minus,
  Trash2,
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
  Search,
} from "lucide-react"
import { Card, Button, Input, Badge, Label } from "./ui"
import Modal from "./Modal"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"

export interface SaleCatalogProduct {
  id: string
  code?: string
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

export interface SaleRecord {
  id: string
  date: string
  time: string
  seller: string
  branch?: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  total: number
  paymentSummary: string
}

export const CATALOG_PRODUCTS: SaleCatalogProduct[] = [
  {
    id: "PRD-001",
    code: "PRD-001",
    barcode: "7790001",
    name: "Módulo Display iPhone 13 Pro OLED",
    category: "Repuestos",
    price: 125000,
    stock: 4,
    minStock: 2,
  },
  {
    id: "PRD-002",
    code: "PRD-002",
    barcode: "7790002",
    name: "Funda Silicona MagSafe iPhone 14",
    category: "Accesorios",
    price: 15000,
    stock: 14,
    minStock: 5,
  },
  {
    id: "PRD-003",
    code: "PRD-003",
    barcode: "7790003",
    name: "Auriculares Bluetooth JBL Tune 510BT",
    category: "Audio",
    price: 52000,
    stock: 8,
    minStock: 4,
  },
  {
    id: "PRD-004",
    code: "PRD-004",
    barcode: "7790004",
    name: "Batería Original Motorola G22",
    category: "Repuestos",
    price: 35000,
    stock: 0,
    minStock: 3,
  },
  {
    id: "PRD-005",
    code: "PRD-005",
    barcode: "7790005",
    name: "Vidrio Templado 9D Full Glue",
    category: "Accesorios",
    price: 6500,
    stock: 25,
    minStock: 10,
  },
  {
    id: "PRD-006",
    code: "PRD-006",
    barcode: "7790006",
    name: "Pin de Carga Tipo C Samsung A52",
    category: "Repuestos",
    price: 12000,
    stock: 6,
    minStock: 3,
  },
  {
    id: "PRD-007",
    code: "PRD-007",
    barcode: "7790007",
    name: "Cargador Rápido Samsung 25W USB-C",
    category: "Accesorios",
    price: 22000,
    stock: 12,
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
  onSaleRegistered,
  onCloseModal,
  isModal = false,
}: {
  onSaleRegistered?: (sale: SaleRecord) => void
  onCloseModal?: () => void
  isModal?: boolean
}) {
  const { user } = useAuth()
  const { branches, branchId } = useBranch()
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [barcodeQuery, setBarcodeQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  // Descuento
  const [discountType, setDiscountType] = useState<"percent" | "fixed">(
    "percent",
  )
  const [discountValue, setDiscountValue] = useState<string>("")

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState<
    "efectivo" | "tarjeta" | "transferencia" | "mixto"
  >("efectivo")
  const [mixedSecondaryMethod, setMixedSecondaryMethod] = useState<
    "Transferencia" | "Tarjeta"
  >("Transferencia")
  const [mixedPayments, setMixedPayments] = useState({
    efectivo: "",
    otroMedio: "",
  })

  // Confirmación de cancelación
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  // Toasts
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
    }, 4000)
  }

  useEffect(() => {
    barcodeInputRef.current?.focus()
    const timer = setInterval(() => setCurrentDateTime(new Date()), 15000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Coincidencias limpias al escribir
  const matchingProducts = barcodeQuery.trim()
    ? CATALOG_PRODUCTS.filter((p) => {
        const q = barcodeQuery.trim().toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
        )
      })
    : []

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
  const mixedOtro = Math.max(0, Number(mixedPayments.otroMedio) || 0)
  const mixedTotalCovered = mixedEfectivo + mixedOtro
  const mixedRemaining = total - mixedTotalCovered

  const handleMixedEfectivoChange = (val: string) => {
    const numEfectivo = Math.max(0, Number(val) || 0)
    const autoRest = Math.max(0, total - numEfectivo)
    setMixedPayments({
      efectivo: val,
      otroMedio: val === "" ? "" : String(autoRest),
    })
  }

  const handleAddProduct = (product: SaleCatalogProduct) => {
    if (product.stock <= 0) {
      addToast(
        "error",
        "Producto sin stock disponible",
        `${product.name} no cuenta con unidades disponibles en stock.`,
      )
      setBarcodeQuery("")
      setShowSuggestions(false)
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
      setBarcodeQuery("")
      setShowSuggestions(false)
      barcodeInputRef.current?.focus()
      return
    }

    setCart((prev) =>
      existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantity: nextQty } : item,
          )
        : [...prev, { ...product, quantity: 1 }],
    )
    setBarcodeQuery("")
    setShowSuggestions(false)
    barcodeInputRef.current?.focus()
  }

  const handleBarcodeSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const query = barcodeQuery.trim().toLowerCase()
    if (!query) return

    const exactOrFirst =
      CATALOG_PRODUCTS.find(
        (p) =>
          p.barcode.toLowerCase() === query || p.id.toLowerCase() === query,
      ) || matchingProducts[0]

    if (!exactOrFirst) {
      addToast(
        "error",
        "Producto no encontrado",
        `No se encontró ningún producto para "${barcodeQuery}".`,
      )
      return
    }

    handleAddProduct(exactOrFirst)
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
    setShowSuggestions(false)
    setDiscountValue("")
    setPaymentMethod("efectivo")
    setMixedPayments({ efectivo: "", otroMedio: "" })
    setShowCancelConfirm(false)
    setTimeout(() => barcodeInputRef.current?.focus(), 50)
  }

  const handleConfirmSale = () => {
    if (cart.length === 0) {
      addToast(
        "error",
        "Venta vacía",
        "Escaneá o buscá al menos un producto antes de confirmar la venta.",
      )
      barcodeInputRef.current?.focus()
      return
    }

    if (paymentMethod === "mixto" && mixedTotalCovered !== total) {
      addToast(
        "error",
        "Pago mixto incompleto",
        mixedRemaining > 0
          ? `Faltan cubrir $ ${mixedRemaining.toLocaleString("es-AR")} para completar el total.`
          : `El monto ingresado supera el total por $ ${Math.abs(mixedRemaining).toLocaleString("es-AR")}.`,
      )
      return
    }

    const activeBranchName =
      branches.find((b) => b.id === branchId)?.name ||
      user?.branchName ||
      "Casa Central"

    const paymentLabels: Record<string, string> = {
      efectivo: "Efectivo",
      tarjeta: "Tarjeta",
      transferencia: "Transferencia",
      mixto: `Mixto (Efectivo: $${mixedEfectivo.toLocaleString("es-AR")} + ${mixedSecondaryMethod}: $${mixedOtro.toLocaleString("es-AR")})`,
    }

    const record: SaleRecord = {
      id: `VTA-${Math.floor(10000 + Math.random() * 90000)}`,
      date: currentDateTime.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: currentDateTime.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      seller: user?.name || "Administrador",
      branch: activeBranchName,
      items: [...cart],
      subtotal,
      discountAmount,
      total,
      paymentSummary: paymentLabels[paymentMethod],
    }

    addToast(
      "success",
      "¡Venta confirmada con éxito!",
      `Comprobante ${record.id} por $ ${total.toLocaleString("es-AR")} registrado correctamente.`,
    )

    onSaleRegistered?.(record)
    resetForm()
  }

  const formattedDate = currentDateTime.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  const formattedTime = currentDateTime.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="space-y-4 relative">
      {/* Toasts flotantes */}
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

      {/* Línea única sutil con metadatos de operación */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span>
          Operador:{" "}
          <strong className="font-semibold text-slate-700">
            {user?.name || "Administrador Principal"}
          </strong>{" "}
          • {formattedDate} • {formattedTime} hs
        </span>
      </div>

      {/* Layout simétrico y alineado: Grilla de Venta (Izquierda) y Panel de Cobro (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Columna Izquierda: Buscador/Escáner Único + Grilla de Venta Actual */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-visible">
            {/* Buscador / Escáner Único con Autocompletado Limpio */}
            <div
              ref={searchContainerRef}
              className="p-4 sm:p-5 border-b border-slate-100 relative"
            >
              <form onSubmit={handleBarcodeSubmit} className="flex gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    ref={barcodeInputRef}
                    id="barcode-scanner"
                    type="text"
                    autoFocus
                    value={barcodeQuery}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setBarcodeQuery(e.target.value)
                      setShowSuggestions(true)
                    }}
                    placeholder="Escanear código de barras o buscar producto por nombre / código..."
                    className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <Button
                  type="submit"
                  icon={Plus}
                  className="shrink-0 px-4 py-2.5 font-semibold"
                >
                  Agregar
                </Button>
              </form>

              {/* Lista desplegable limpia de coincidencias al escribir */}
              {showSuggestions && barcodeQuery.trim().length > 0 && (
                <div className="absolute left-4 right-4 sm:left-5 sm:right-5 top-full -mt-1 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  {matchingProducts.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-500">
                      No se encontraron coincidencias para "{barcodeQuery}"
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                      {matchingProducts.map((prod) => (
                        <li key={prod.id}>
                          <button
                            type="button"
                            onClick={() => handleAddProduct(prod)}
                            className="w-full px-4 py-2.5 text-left hover:bg-blue-50/60 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                {prod.name}
                              </p>
                              <p className="text-2xs font-mono text-slate-400">
                                {prod.id} • Cód: {prod.barcode}
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-[#00559D] font-mono shrink-0">
                              $ {prod.price.toLocaleString("es-AR")}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Cabecera de la Grilla de Venta Actual */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#00559D]" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Grilla de Venta Actual
                </h3>
              </div>
              <Badge variant="blue">
                {cart.reduce((acc, i) => acc + i.quantity, 0)} unidades
              </Badge>
            </div>

            {/* Contenido de la Grilla de Venta nivelado a toda la altura de la tarjeta */}
            <div className="flex-1 flex flex-col justify-between min-h-[320px]">
              {cart.length === 0 ? (
                <div className="flex-1 py-12 px-4 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Barcode className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    La grilla de venta está vacía
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Escaneá un código de barras o escribí el nombre del producto
                    arriba para sumarlo a la venta.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto flex-1">
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
                          Precio Unitario
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
                      {cart.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="px-4 py-3.5">
                            <span className="block text-xs sm:text-sm font-semibold text-slate-900">
                              {item.name}
                            </span>
                            <span className="block text-2xs font-mono text-slate-400 mt-0.5">
                              {item.id} • Cód: {item.barcode}
                            </span>
                          </td>

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
                            ${" "}
                            {(item.price * item.quantity).toLocaleString(
                              "es-AR",
                            )}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Panel de Cobro nivelado en altura con la Grilla */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          <Card className="p-5 flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-5">
              {/* Descuentos */}
              <div>
                <Label className="flex items-center justify-between">
                  <span>Aplicar Descuento</span>
                  <span className="text-2xs font-normal text-slate-400">
                    Monto fijo ($) o Porcentaje (%)
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
                      <span>Fijo</span>
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

              {/* Método de Pago */}
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
                    <span className="truncate">Transferencia</span>
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

              {/* Inputs dinámicos para Pago Mixto */}
              {paymentMethod === "mixto" && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Desglose de Pago Mixto
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setMixedPayments({
                          efectivo: String(Math.floor(total / 2)),
                          otroMedio: String(total - Math.floor(total / 2)),
                        })
                      }
                      className="text-2xs font-semibold text-[#00559D] hover:underline cursor-pointer"
                    >
                      Mitad y Mitad
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-2xs text-slate-600 mb-1">
                        Monto en Efectivo ($)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Ej: 15000"
                        value={mixedPayments.efectivo}
                        onChange={(e) =>
                          handleMixedEfectivoChange(e.target.value)
                        }
                        className="py-2 text-xs font-mono bg-white"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-2xs text-slate-600 mb-0">
                          Monto con otro medio ($)
                        </Label>
                        <select
                          value={mixedSecondaryMethod}
                          onChange={(e) =>
                            setMixedSecondaryMethod(
                              e.target.value as "Transferencia" | "Tarjeta",
                            )
                          }
                          className="text-2xs font-bold text-[#00559D] bg-transparent border-none focus:outline-none cursor-pointer"
                        >
                          <option value="Transferencia">
                            Con Transferencia
                          </option>
                          <option value="Tarjeta">Con Tarjeta</option>
                        </select>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Resto a cubrir..."
                        value={mixedPayments.otroMedio}
                        onChange={(e) =>
                          setMixedPayments((prev) => ({
                            ...prev,
                            otroMedio: e.target.value,
                          }))
                        }
                        className="py-2 text-xs font-mono bg-white"
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
            </div>

            {/* Bloque inferior del Panel de Cobro: Totales y Botones */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} ítems)
                  </span>
                  <span className="font-mono font-medium text-slate-700">
                    $ {subtotal.toLocaleString("es-AR")}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>
                      Descuento aplicado{" "}
                      {discountType === "percent"
                        ? `(${numericDiscountInput}%)`
                        : ""}
                    </span>
                    <span className="font-mono">
                      - $ {discountAmount.toLocaleString("es-AR")}
                    </span>
                  </div>
                )}

                <div className="flex items-baseline justify-between pt-2.5 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Total a Cobrar
                  </span>
                  <span className="text-2xl font-extrabold text-[#00559D] font-mono">
                    $ {total.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Button
                  type="button"
                  onClick={handleConfirmSale}
                  icon={Check}
                  className="w-full py-3 text-sm font-bold shadow-md"
                >
                  Confirmar Venta
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-2.5 text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                >
                  Cancelar Venta
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de confirmación para Cancelar Venta */}
      {showCancelConfirm && (
        <Modal
          title="Cancelar Operación"
          onClose={() => setShowCancelConfirm(false)}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-sm mb-1">
                  ¿Estás seguro de cancelar esta operación?
                </p>
                <p>
                  Se descartarán todos los productos cargados y los pagos o
                  descuentos configurados en la venta actual.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
              >
                Continuar con la venta
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  resetForm()
                  addToast(
                    "warning",
                    "Operación cancelada",
                    "Se limpió el formulario y la venta en curso fue descartada.",
                  )
                  if (isModal) {
                    onCloseModal?.()
                  }
                }}
              >
                Sí, cancelar operación
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default function RegisterSaleModal({
  isOpen,
  open,
  onClose,
  onSaleRegistered,
}: {
  isOpen?: boolean
  open?: boolean
  onClose: () => void
  onSaleRegistered?: (sale: SaleRecord) => void
}) {
  const visible = isOpen ?? open ?? false
  if (!visible) return null

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
                Registrar Venta
              </h2>
              <p className="text-2xs text-blue-200/80">
                Terminal de facturación rápida
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
            onSaleRegistered={(sale) => {
              onSaleRegistered?.(sale)
            }}
          />
        </div>
      </div>
    </div>
  )
}
