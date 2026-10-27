import React from "react"
import { Card, Button, Input, Select, Badge } from "../components/ui"
import { Search, Plus, Filter, Eye } from "lucide-react"
import { Link } from "react-router-dom"

const mockOrders = [
  {
    id: "10452",
    client: "Martín Pérez",
    dni: "32.456.789",
    device: "Samsung S22 Ultra",
    issue: "Módulo astillado",
    status: "En Reparación",
    date: "24/10/2023",
    branch: "Alta Córdoba",
  },
  {
    id: "10451",
    client: "Laura Gómez",
    dni: "28.123.456",
    device: "iPhone 13 Pro",
    issue: "No carga",
    status: "Listo para Entrega",
    date: "23/10/2023",
    branch: "Yofre Norte",
  },
  {
    id: "10450",
    client: "Carlos Ruiz",
    dni: "40.987.654",
    device: "Notebook HP Pavilion",
    issue: "Lenta, limpiar",
    status: "Ingresado",
    date: "23/10/2023",
    branch: "Alta Córdoba",
  },
  {
    id: "10449",
    client: "Ana Martínez",
    dni: "35.654.321",
    device: "Motorola Edge 30",
    issue: "Se apaga solo",
    status: "Sin Solución",
    date: "22/10/2023",
    branch: "Yofre Norte",
  },
  {
    id: "10448",
    client: "Diego Fernández",
    dni: "29.876.543",
    device: "iPad Air 5",
    issue: "Cambio de batería",
    status: "En Diagnóstico",
    date: "22/10/2023",
    branch: "Alta Córdoba",
  },
  {
    id: "10447",
    client: "Sofía López",
    dni: "42.123.987",
    device: "iPhone 11",
    issue: "Botón de encendido no funciona",
    status: "Entregado",
    date: "20/10/2023",
    branch: "Yofre Norte",
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
    case "Entregado":
      return (
        <Badge variant="gray" className="bg-gray-200 text-gray-600">
          {status}
        </Badge>
      )
    default:
      return <Badge variant="gray">{status}</Badge>
  }
}

export default function ServiceList() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicio Técnico</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de órdenes de trabajo (SAT).
          </p>
        </div>
        <Link to="/servicio-tecnico/nueva">
          <Button icon={Plus} className="shadow-md">
            Nueva Orden
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por cliente, equipo o nro de orden..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select className="w-40">
              <option>Estado</option>
              <option>Ingresado</option>
              <option>En Diagnóstico</option>
              <option>En Reparación</option>
              <option>Listo para Entrega</option>
              <option>Sin Solución</option>
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
                  Orden / Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipo / Falla
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">
                        OT-{order.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {order.client}
                      </span>
                      <span className="text-xs text-gray-500">
                        DNI: {order.dni}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {order.device}
                      </span>
                      <span className="text-xs text-gray-500 truncate max-w-[200px]">
                        {order.issue}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/servicio-tecnico/${order.id}`}>
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-primary hover:text-primary-dark"
                      >
                        <Eye className="w-4 h-4 mr-1 inline" /> Ver
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}


