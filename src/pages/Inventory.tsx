import React, { useState } from "react"
import { Card, Button, Input, Select, Badge, Label } from "../components/ui"
import Modal from "../components/Modal"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Percent,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  price: number
  stockYofre: number
  stockAlta: number
  minStock: number
}

const initialInventory: InventoryItem[] = [
  {
    id: "PRD-001",
    name: "Módulo Display iPhone 13 Pro",
    category: "Repuestos",
    price: 125000,
    stockYofre: 3,
    stockAlta: 2,
    minStock: 3,
  },
  {
    id: "PRD-002",
    name: "Samsung Galaxy S23 Ultra 256GB",
    category: "Equipos",
    price: 1450000,
    stockYofre: 1,
    stockAlta: 1,
    minStock: 1,
  },
  {
    id: "PRD-003",
    name: "Funda Silicona MagSafe iPhone 14",
    category: "Accesorios",
    price: 15000,
    stockYofre: 12,
    stockAlta: 8,
    minStock: 5,
  },
  {
    id: "PRD-004",
    name: "Batería Original Motorola G22",
    category: "Repuestos",
    price: 35000,
    stockYofre: 0,
    stockAlta: 2,
    minStock: 3,
  },
  {
    id: "PRD-005",
    name: "Auriculares JBL Tune 510BT",
    category: "Audio",
    price: 45000,
    stockYofre: 5,
    stockAlta: 6,
    minStock: 4,
  },
  {
    id: "PRD-006",
    name: "Cargador Samsung 25W Tipo C",
    category: "Accesorios",
    price: 22000,
    stockYofre: 15,
    stockAlta: 10,
    minStock: 10,
  },
]

const CATEGORIES = [
  "Todas las categorías",
  "Equipos",
  "Repuestos",
  "Accesorios",
  "Audio",
]

const PRODUCT_CATEGORIES = ["Equipos", "Repuestos", "Accesorios", "Audio"]

interface ProductFormState {
  id: string
  name: string
  category: string
  price: string
  stockYofre: string
  stockAlta: string
  minStock: string
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todas las categorías")

  // Selección múltiple
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal ABM de Producto (Crear / Editar)
  const [productModalMode, setProductModalMode] = useState<
    "create" | "edit" | null
  >(null)
  const [editingOriginalId, setEditingOriginalId] = useState<string | null>(
    null,
  )
  const [productForm, setProductForm] = useState<ProductFormState>({
    id: "",
    name: "",
    category: "Repuestos",
    price: "",
    stockYofre: "0",
    stockAlta: "0",
    minStock: "3",
  })
  const [productFormError, setProductFormError] = useState<string | null>(null)

  // Modal de Actualización Masiva
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkCategory, setBulkCategory] = useState("Todas las categorías")
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">(
    "increase",
  )
  const [percentage, setPercentage] = useState("")
  const [confirmBulkUpdate, setConfirmBulkUpdate] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 4000)
  }

  // Abrir Modal "+ Nuevo Producto"
  const openCreateModal = () => {
    const nextNum = inventory.length + 1
    const suggestedSku = `PRD-${String(nextNum).padStart(3, "0")}`
    setProductForm({
      id: suggestedSku,
      name: "",
      category: "Repuestos",
      price: "",
      stockYofre: "0",
      stockAlta: "0",
      minStock: "3",
    })
    setEditingOriginalId(null)
    setProductFormError(null)
    setProductModalMode("create")
  }

  // Abrir Modal "Editar Producto"
  const openEditModal = (item: InventoryItem) => {
    setProductForm({
      id: item.id,
      name: item.name,
      category: item.category,
      price: String(item.price),
      stockYofre: String(item.stockYofre),
      stockAlta: String(item.stockAlta),
      minStock: String(item.minStock),
    })
    setEditingOriginalId(item.id)
    setProductFormError(null)
    setProductModalMode("edit")
  }

  const closeProductModal = () => {
    setProductModalMode(null)
    setEditingOriginalId(null)
    setProductFormError(null)
  }

  // Guardar Producto (Alta o Edición completa)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    setProductFormError(null)

    const cleanId = productForm.id.trim().toUpperCase()
    const cleanName = productForm.name.trim()
    const numPrice = Number(productForm.price)
    const numYofre = Math.max(0, Math.round(Number(productForm.stockYofre) || 0))
    const numAlta = Math.max(0, Math.round(Number(productForm.stockAlta) || 0))
    const numMin = Math.max(0, Math.round(Number(productForm.minStock) || 0))

    if (!cleanId) {
      setProductFormError("El código o SKU del producto es obligatorio.")
      return
    }
    if (!cleanName) {
      setProductFormError("El nombre del producto es obligatorio.")
      return
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setProductFormError("Ingresá un precio de venta válido mayor a 0.")
      return
    }

    const duplicateSku = inventory.some(
      (item) =>
        item.id.toUpperCase() === cleanId &&
        item.id !== editingOriginalId,
    )
    if (duplicateSku) {
      setProductFormError(`Ya existe otro producto con el código ${cleanId}.`)
      return
    }

    const updatedItem: InventoryItem = {
      id: cleanId,
      name: cleanName,
      category: productForm.category,
      price: Math.round(numPrice),
      stockYofre: numYofre,
      stockAlta: numAlta,
      minStock: numMin,
    }

    if (productModalMode === "create") {
      setInventory((prev) => [updatedItem, ...prev])
      triggerToast(`Producto "${updatedItem.name}" (${updatedItem.id}) agregado al inventario.`)
    } else {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === editingOriginalId ? updatedItem : item,
        ),
      )
      triggerToast(`Producto "${updatedItem.name}" actualizado correctamente.`)
    }

    closeProductModal()
  }

  // Productos visibles según búsqueda y categoría
  const visibleItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "Todas las categorías" ||
      item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const allVisibleSelected =
    visibleItems.length > 0 &&
    visibleItems.every((item) => selectedIds.includes(item.id))
  const isIndeterminate =
    visibleItems.some((item) => selectedIds.includes(item.id)) &&
    !allVisibleSelected

  const handleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIdSet = new Set(visibleItems.map((i) => i.id))
      setSelectedIds((prev) => prev.filter((id) => !visibleIdSet.has(id)))
    } else {
      const visibleIds = visibleItems.map((i) => i.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const openBulkModal = () => {
    setPercentage("")
    setConfirmBulkUpdate(false)
    setShowBulkModal(true)
  }

  const closeBulkModal = () => {
    setShowBulkModal(false)
    setConfirmBulkUpdate(false)
  }

  const applyBulkUpdate = () => {
    const percentVal = parseFloat(percentage)
    if (isNaN(percentVal) || percentVal <= 0) return

    const factor =
      adjustmentType === "increase"
        ? 1 + percentVal / 100
        : Math.max(0, 1 - percentVal / 100)

    setInventory((prev) =>
      prev.map((item) => {
        const shouldUpdate =
          selectedIds.length > 0
            ? selectedIds.includes(item.id)
            : bulkCategory === "Todas las categorías" ||
              item.category === bulkCategory

        if (!shouldUpdate) return item
        const newPrice = Math.max(0, Math.round(item.price * factor))
        return { ...item, price: newPrice }
      }),
    )

    const actionText = adjustmentType === "increase" ? "aumento" : "descuento"
    const targetText =
      selectedIds.length > 0
        ? `${selectedIds.length} producto(s) seleccionado(s)`
        : bulkCategory === "Todas las categorías"
          ? "todos los productos"
          : `los productos de ${bulkCategory}`

    triggerToast(
      `¡Actualización exitosa! Se aplicó un ${actionText} del ${percentVal}% a ${targetText}.`,
    )
    setSelectedIds([])
    closeBulkModal()
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Inventario
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Gestión centralizada de productos, precios, categorías y stock por
            sucursal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            icon={Percent}
            onClick={openBulkModal}
            className={`bg-white transition-all ${
              selectedIds.length > 0
                ? "border-primary text-primary bg-primary/5 hover:bg-primary/10 font-semibold"
                : ""
            }`}
          >
            Actualización Masiva
            {selectedIds.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full font-bold">
                {selectedIds.length}
              </span>
            )}
          </Button>

          <Button
            icon={Plus}
            onClick={openCreateModal}
            className="font-bold shadow-md"
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Toast de confirmación */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
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

      {/* Barra de estado cuando hay productos seleccionados */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span className="text-xs sm:text-sm text-blue-900 font-medium">
              <strong>{selectedIds.length}</strong> de {visibleItems.length}{" "}
              productos seleccionados
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              className="py-1.5 px-3.5 text-xs"
              icon={Sparkles}
              onClick={openBulkModal}
            >
              Ajustar precios a la selección
            </Button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1 cursor-pointer"
            >
              Deseleccionar todos
            </button>
          </div>
        </div>
      )}

      {/* Tarjeta de Filtros Rápidos por Categoría y Buscador */}
      <Card className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por nombre, código SKU o categoría..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select
              className="w-48"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Píldoras de Filtros Rápidos por Categoría */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            Categorías:
          </span>
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat
            const count =
              cat === "Todas las categorías"
                ? inventory.length
                : inventory.filter((i) => i.category === cat).length
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-[#00559D] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                <span>{cat === "Todas las categorías" ? "Todas" : cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-3xs font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Tabla Principal de Inventario */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/90">
              <tr>
                <th className="px-4 py-3.5 text-center w-12">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer align-middle"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate
                    }}
                    onChange={handleSelectAll}
                    aria-label="Seleccionar o deseleccionar todos los productos visibles"
                  />
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Código / Producto
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-5 py-3.5 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Precio de Venta
                </th>
                <th className="px-5 py-3.5 text-center text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Stock Yofre
                </th>
                <th className="px-5 py-3.5 text-center text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Stock Alta Cba
                </th>
                <th className="px-5 py-3.5 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {visibleItems.map((item) => {
                const isSelected = selectedIds.includes(item.id)

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-blue-50/50 hover:bg-blue-50/80"
                        : "hover:bg-slate-50/70"
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer align-middle"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        aria-label={`Seleccionar ${item.name}`}
                      />
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="text-left group cursor-pointer"
                      >
                        <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#00559D] transition-colors">
                          {item.name}
                        </span>
                        <span className="block text-2xs text-slate-400 font-mono">
                          {item.id} • Mínimo alerta: {item.minStock} un.
                        </span>
                      </button>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          item.category === "Equipos"
                            ? "blue"
                            : item.category === "Repuestos"
                              ? "orange"
                              : item.category === "Audio"
                                ? "purple"
                                : "gray"
                        }
                      >
                        {item.category}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs sm:text-sm font-bold font-mono text-slate-900">
                      $ {item.price.toLocaleString("es-AR")}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-8 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          item.stockYofre === 0
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : item.stockYofre <= item.minStock
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.stockYofre} un.
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center justify-center min-w-8 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          item.stockAlta === 0
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : item.stockAlta <= item.minStock
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {item.stockAlta} un.
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="text-slate-500 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-blue-50 cursor-pointer"
                          title="Editar Producto"
                          aria-label={`Editar ${item.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInventory((prev) =>
                              prev.filter((p) => p.id !== item.id),
                            )
                            triggerToast(`Producto "${item.name}" eliminado.`)
                          }}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Eliminar"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {visibleItems.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla / Paginación */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Mostrando <strong>{visibleItems.length}</strong> de{" "}
            <strong>{inventory.length}</strong> productos
          </p>
          <div className="flex space-x-1">
            <Button variant="outline" className="px-2.5 py-1 text-xs bg-white">
              Anterior
            </Button>
            <Button
              variant="outline"
              className="px-2.5 py-1 text-xs bg-blue-50 text-primary border-primary/30 font-bold"
            >
              1
            </Button>
            <Button variant="outline" className="px-2.5 py-1 text-xs bg-white">
              Siguiente
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de Alta / Edición Completa de Producto */}
      {productModalMode && (
        <Modal
          title={
            productModalMode === "create"
              ? "Nuevo Producto"
              : "Editar Producto"
          }
          onClose={closeProductModal}
        >
          <form onSubmit={handleSaveProduct} className="space-y-4">
            {productFormError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-700 font-medium">
                  {productFormError}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <Label htmlFor="prod-sku">Código / SKU *</Label>
                <Input
                  id="prod-sku"
                  type="text"
                  required
                  value={productForm.id}
                  onChange={(e) =>
                    setProductForm((prev) => ({ ...prev, id: e.target.value }))
                  }
                  placeholder="Ej. PRD-007"
                  className="font-mono uppercase"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="prod-category">Categoría *</Label>
                <Select
                  id="prod-category"
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="prod-name">Nombre del Producto *</Label>
              <Input
                id="prod-name"
                type="text"
                required
                autoFocus
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ej. Módulo Display Samsung S23 Original"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
              <div>
                <Label htmlFor="prod-price" className="whitespace-nowrap">
                  Precio de Venta ($) *
                </Label>
                <Input
                  id="prod-price"
                  type="number"
                  min="1"
                  required
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  placeholder="Ej. 85000"
                  className="font-mono font-bold"
                />
              </div>

              <div>
                <Label htmlFor="prod-min-stock" className="whitespace-nowrap">
                  Stock Mínimo para Alertas
                </Label>
                <Input
                  id="prod-min-stock"
                  type="number"
                  min="0"
                  required
                  value={productForm.minStock}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      minStock: e.target.value,
                    }))
                  }
                  className="font-mono"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="block text-2xs uppercase tracking-wider font-bold text-slate-500">
                Disponibilidad por Sucursal
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                <div>
                  <Label
                    htmlFor="prod-stock-yofre"
                    className="whitespace-nowrap truncate"
                  >
                    Stock Yofre (un.)
                  </Label>
                  <Input
                    id="prod-stock-yofre"
                    type="number"
                    min="0"
                    required
                    value={productForm.stockYofre}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        stockYofre: e.target.value,
                      }))
                    }
                    className="font-mono bg-white"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="prod-stock-alta"
                    className="whitespace-nowrap truncate"
                  >
                    Stock Alta Cba (un.)
                  </Label>
                  <Input
                    id="prod-stock-alta"
                    type="number"
                    min="0"
                    required
                    value={productForm.stockAlta}
                    onChange={(e) =>
                      setProductForm((prev) => ({
                        ...prev,
                        stockAlta: e.target.value,
                      }))
                    }
                    className="font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={closeProductModal}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="font-bold">
                {productModalMode === "create"
                  ? "Guardar Producto"
                  : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de Actualización Masiva de Precios */}
      {showBulkModal && (
        <Modal title="Actualización Masiva de Precios" onClose={closeBulkModal}>
          <div className="space-y-5">
            {selectedIds.length > 0 ? (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-blue-900">
                  <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                  <span>
                    Aplicar a:{" "}
                    <strong className="font-semibold text-primary">
                      {selectedIds.length} producto(s) seleccionado(s)
                    </strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  Limpiar selección
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-sm text-slate-700">
                  <Layers className="h-5 w-5 text-slate-500 shrink-0" />
                  <span>
                    Aplicar a:{" "}
                    <strong className="font-semibold">
                      Todos los productos
                    </strong>{" "}
                    (filtrable por categoría)
                  </span>
                </div>

                <div>
                  <Label htmlFor="bulk-category">Filtrar por Categoría</Label>
                  <Select
                    id="bulk-category"
                    value={bulkCategory}
                    onChange={(e) => {
                      setBulkCategory(e.target.value)
                      setConfirmBulkUpdate(false)
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label>Tipo de Ajuste</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAdjustmentType("increase")
                    setConfirmBulkUpdate(false)
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    adjustmentType === "increase"
                      ? "border-primary bg-primary/10 text-primary shadow-2xs font-semibold ring-1 ring-primary"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Incrementar precio (+)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAdjustmentType("decrease")
                    setConfirmBulkUpdate(false)
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    adjustmentType === "decrease"
                      ? "border-secondary bg-secondary/10 text-secondary shadow-2xs font-semibold ring-1 ring-secondary"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-secondary" />
                  Decrementar precio (-)
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="percentage-input">
                Porcentaje de{" "}
                {adjustmentType === "increase" ? "Aumento" : "Descuento"} (%)
              </Label>
              <div className="relative mt-1">
                <Input
                  id="percentage-input"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  placeholder="Ej. 10"
                  value={percentage}
                  onChange={(e) => {
                    setPercentage(e.target.value)
                    setConfirmBulkUpdate(false)
                  }}
                />
              </div>
            </div>

            {confirmBulkUpdate && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Confirmar actualización
                    </p>
                    <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                      Se aplicará un{" "}
                      <strong>
                        {adjustmentType === "increase"
                          ? "aumento"
                          : "descuento"}{" "}
                        del {percentage}%
                      </strong>{" "}
                      sobre{" "}
                      <strong>
                        {selectedIds.length > 0
                          ? `${selectedIds.length} producto(s) seleccionado(s)`
                          : bulkCategory === "Todas las categorías"
                            ? "todos los productos"
                            : `los productos de la categoría "${bulkCategory}"`}
                      </strong>
                      . ¿Deseas continuar?
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={closeBulkModal}>
                Cancelar
              </Button>

              {confirmBulkUpdate ? (
                <Button
                  onClick={applyBulkUpdate}
                  variant={
                    adjustmentType === "increase" ? "primary" : "secondary"
                  }
                >
                  Confirmar{" "}
                  {adjustmentType === "increase" ? "Aumento" : "Descuento"}
                </Button>
              ) : (
                <Button
                  onClick={() => setConfirmBulkUpdate(true)}
                  disabled={!percentage || Number(percentage) <= 0}
                  variant="primary"
                >
                  Aplicar{" "}
                  {adjustmentType === "increase" ? "Aumento" : "Descuento"}
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
