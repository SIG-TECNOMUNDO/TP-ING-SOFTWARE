import React, { useState } from "react"
import { Card, Button, Input, Select, Badge, Label } from "../components/ui"
import Modal from "../components/Modal"
import {
  Search,
  Plus,
  Filter,
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

export default function Inventory() {
  // Estado de productos y filtros
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todas las categorías")

  // Estado para selección múltiple
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Estado para Modal de Actualización Masiva
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkCategory, setBulkCategory] = useState("Todas las categorías")
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">(
    "increase",
  )
  const [percentage, setPercentage] = useState("")
  const [confirmBulkUpdate, setConfirmBulkUpdate] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

  // Control de selección maestro (todos / deseleccionar todos)
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

  // Apertura y cierre de modal masivo
  const openBulkModal = () => {
    setPercentage("")
    setConfirmBulkUpdate(false)
    setShowBulkModal(true)
  }

  const closeBulkModal = () => {
    setShowBulkModal(false)
    setConfirmBulkUpdate(false)
  }

  // Aplicar actualización masiva de precios
  const applyBulkUpdate = () => {
    const percentVal = parseFloat(percentage)
    if (isNaN(percentVal) || percentVal <= 0) return

    const factor =
      adjustmentType === "increase"
        ? 1 + percentVal / 100
        : Math.max(0, 1 - percentVal / 100)

    let updatedCount = 0

    setInventory((prev) =>
      prev.map((item) => {
        const shouldUpdate =
          selectedIds.length > 0
            ? selectedIds.includes(item.id)
            : bulkCategory === "Todas las categorías" ||
              item.category === bulkCategory

        if (!shouldUpdate) return item

        updatedCount++
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

    setToastMessage(
      `¡Actualización exitosa! Se aplicó un ${actionText} del ${percentVal}% a ${targetText}.`,
    )
    setSelectedIds([])
    closeBulkModal()
    window.setTimeout(() => setToastMessage(null), 4500)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado y acciones principales */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestioná los productos, precios y repuestos de ambas sucursales.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            icon={Percent}
            onClick={openBulkModal}
            className={`transition-all ${
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

          <Button icon={Plus}>Nuevo Producto</Button>
        </div>
      </div>

      {/* Toast de confirmación de actualización masiva */}
      {toastMessage && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center justify-between shadow-sm animate-fade-in">
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

      {/* Barra de estado cuando hay productos seleccionados */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span className="text-sm text-blue-900 font-medium">
              <strong>{selectedIds.length}</strong> de {visibleItems.length}{" "}
              productos seleccionados
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              className="py-1 px-3 text-xs"
              icon={Sparkles}
              onClick={openBulkModal}
            >
              Ajustar precios a la selección
            </Button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-gray-500 hover:text-gray-700 underline px-2 py-1"
            >
              Deseleccionar todos
            </button>
          </div>
        </div>
      )}

      {/* Card principal con filtros y tabla */}
      <Card>
        {/* Filtros y buscador */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 bg-white">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por nombre, código o categoría..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select
              className="w-44"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>Todas las categorías</option>
              <option>Equipos</option>
              <option>Repuestos</option>
              <option>Accesorios</option>
              <option>Audio</option>
            </Select>

            <Select className="w-40">
              <option>Todas las sucursales</option>
              <option>Yofre Norte</option>
              <option>Alta Córdoba</option>
            </Select>

            <Button variant="outline" icon={Filter} className="px-3 py-2">
              Filtros
            </Button>
          </div>
        </div>

        {/* Tabla con selección múltiple */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer align-middle"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate
                    }}
                    onChange={handleSelectAll}
                    aria-label="Seleccionar o deseleccionar todos los productos visibles"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Código / Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Precio de Venta
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock Yofre
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stock Alta Cba
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {visibleItems.map((item) => {
                const isSelected = selectedIds.includes(item.id)

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-blue-50/50 hover:bg-blue-50/80"
                        : "hover:bg-gray-50/80"
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer align-middle"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        aria-label={`Seleccionar ${item.name}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {item.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="gray">{item.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold font-mono">
                      $ {item.price.toLocaleString("es-AR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          item.stockYofre === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.stockYofre}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                          item.stockAlta === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.stockAlta}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-gray-400 hover:text-primary transition-colors p-1 rounded hover:bg-gray-100"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                          title="Eliminar"
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
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No se encontraron productos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <p className="text-sm text-gray-500">
            Mostrando {visibleItems.length} de {inventory.length} productos
          </p>
          <div className="flex space-x-1">
            <Button variant="outline" className="px-2.5 py-1 text-xs">
              Anterior
            </Button>
            <Button
              variant="outline"
              className="px-2.5 py-1 text-xs bg-gray-100 font-semibold"
            >
              1
            </Button>
            <Button variant="outline" className="px-2.5 py-1 text-xs">
              2
            </Button>
            <Button variant="outline" className="px-2.5 py-1 text-xs">
              3
            </Button>
            <Button variant="outline" className="px-2.5 py-1 text-xs">
              Siguiente
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de Actualización Masiva de Precios */}
      {showBulkModal && (
        <Modal title="Actualización Masiva de Precios" onClose={closeBulkModal}>
          <div className="space-y-5">
            {/* Indicador dinámico de alcance */}
            {selectedIds.length > 0 ? (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-blue-900">
                  <CheckSquare className="h-5 w-5 text-primary flex-shrink-0" />
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
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Limpiar selección
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center space-x-2 text-sm text-gray-700">
                  <Layers className="h-5 w-5 text-gray-500 flex-shrink-0" />
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
                    <option>Todas las categorías</option>
                    <option>Equipos</option>
                    <option>Accesorios</option>
                    <option>Repuestos</option>
                    <option>Audio</option>
                  </Select>
                </div>
              </div>
            )}

            {/* Selector de Tipo de Ajuste (Incremento / Decremento) */}
            <div>
              <Label>Tipo de Ajuste</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAdjustmentType("increase")
                    setConfirmBulkUpdate(false)
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                    adjustmentType === "increase"
                      ? "border-primary bg-primary/10 text-primary shadow-xs font-semibold ring-1 ring-primary"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
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
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                    adjustmentType === "decrease"
                      ? "border-secondary bg-secondary/10 text-secondary shadow-xs font-semibold ring-1 ring-secondary"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-secondary" />
                  Decrementar precio (-)
                </button>
              </div>
            </div>

            {/* Input de porcentaje */}
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

            {/* Confirmación previa si aplica */}
            {confirmBulkUpdate && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 animate-fade-in">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">
                      Confirmar actualización
                    </p>
                    <p className="mt-1 text-xs text-yellow-800 leading-relaxed">
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

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
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
