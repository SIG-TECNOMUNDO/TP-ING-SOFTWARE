import React, { useState } from "react"
import { Card, Button, Input, Select, Badge } from "../components/ui"
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestioná los productos y repuestos de ambas sucursales.
          </p>
        </div>
        <Button icon={Plus}>Nuevo Producto</Button>
      </div>

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
