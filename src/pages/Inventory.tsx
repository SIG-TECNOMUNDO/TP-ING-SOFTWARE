import React, { useState } from "react"
import { Card, Button, Input, Select, Badge, Label } from "../components/ui"
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Percent,
  X,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

const mockInventory = [
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
  const [searchTerm, setSearchTerm] = useState("")
  const [showBulkUpdate, setShowBulkUpdate] = useState(false)
  const [bulkCategory, setBulkCategory] = useState("Todas las categorías")
  const [increasePercentage, setIncreasePercentage] = useState("")
  const [confirmBulkUpdate, setConfirmBulkUpdate] = useState(false)
  const [bulkUpdateSuccess, setBulkUpdateSuccess] = useState(false)

  const closeBulkUpdate = () => {
    setShowBulkUpdate(false)
    setConfirmBulkUpdate(false)
    setBulkUpdateSuccess(false)
  }

  const applyBulkUpdate = () => {
    setConfirmBulkUpdate(false)
    setBulkUpdateSuccess(true)
    window.setTimeout(closeBulkUpdate, 2200)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestioná los productos y repuestos de ambas sucursales.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            icon={Percent}
            onClick={() => setShowBulkUpdate(true)}
          >
            Actualización Masiva
          </Button>
          <Button icon={Plus}>Nuevo Producto</Button>
        </div>
      </div>

      {showBulkUpdate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-update-title"
        >
          <Card className="w-full max-w-lg shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 p-5">
              <div>
                <h2
                  id="bulk-update-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Actualización Masiva de Precios
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Aplicá un aumento porcentual a un grupo de productos.
                </p>
              </div>
              <Button
                variant="ghost"
                className="p-2"
                onClick={closeBulkUpdate}
                aria-label="Cerrar actualización masiva"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <Label htmlFor="bulk-category">Aplicar a</Label>
                <Select
                  id="bulk-category"
                  value={bulkCategory}
                  onChange={(event) => {
                    setBulkCategory(event.target.value)
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
              <div>
                <Label htmlFor="increase-percentage">
                  Porcentaje de Aumento (%)
                </Label>
                <Input
                  id="increase-percentage"
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  placeholder="Ej. 8"
                  value={increasePercentage}
                  onChange={(event) => {
                    setIncreasePercentage(event.target.value)
                    setConfirmBulkUpdate(false)
                  }}
                />
              </div>

              {confirmBulkUpdate && (
                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-700" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900">
                        Confirmá la actualización
                      </p>
                      <p className="mt-1 text-sm text-yellow-800">
                        Se aumentarán un {increasePercentage}% los precios de{" "}
                        {bulkCategory.toLowerCase()}. Esta acción afectará a
                        todos los productos incluidos.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {bulkUpdateSuccess && (
                <div
                  className="flex items-center rounded-md border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-800"
                  role="status"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Aumento aplicado correctamente.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 p-5">
              <Button variant="outline" onClick={closeBulkUpdate}>
                Cancelar
              </Button>
              {confirmBulkUpdate ? (
                <Button
                  onClick={applyBulkUpdate}
                  disabled={bulkUpdateSuccess}
                >
                  Confirmar Aumento
                </Button>
              ) : (
                <Button
                  onClick={() => setConfirmBulkUpdate(true)}
                  disabled={
                    !increasePercentage || Number(increasePercentage) <= 0
                  }
                >
                  Aplicar Aumento
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      <Card>
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
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
            <Select className="w-40">
              <option>Categoría</option>
              <option>Equipos</option>
              <option>Repuestos</option>
              <option>Accesorios</option>
              <option>Audio</option>
            </Select>
            <Select className="w-40">
              <option>Sucursal</option>
              <option>Yofre Norte</option>
              <option>Alta Córdoba</option>
            </Select>
            <Button variant="outline" icon={Filter} className="px-3 py-2">
              Filtros
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código / Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio de Venta
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Yofre
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Alta Cba
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockInventory.map((item) => {
                const totalStock = item.stockYofre + item.stockAlta
                const isLowStock = totalStock <= item.minStock

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">{item.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="gray">{item.category}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
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
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">Mostrando 6 de 142 productos</p>
          <div className="flex space-x-1">
            <Button variant="outline" className="px-2 py-1 text-xs">
              Anterior
            </Button>
            <Button variant="outline" className="px-2 py-1 text-xs bg-gray-100">
              1
            </Button>
            <Button variant="outline" className="px-2 py-1 text-xs">
              2
            </Button>
            <Button variant="outline" className="px-2 py-1 text-xs">
              3
            </Button>
            <Button variant="outline" className="px-2 py-1 text-xs">
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}


