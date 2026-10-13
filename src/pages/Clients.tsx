import React from "react"
import { Card, Button, Input, Badge } from "../components/ui"
import { Search, Plus, ExternalLink } from "lucide-react"

const mockClients = [
  {
    id: "1",
    name: "Martín Pérez",
    dni: "32.456.789",
    phone: "351-555-4321",
    email: "martin.p@email.com",
    orders: 3,
    totalSpent: 245000,
    lastVisit: "24/10/2023",
  },
  {
    id: "2",
    name: "Laura Gómez",
    dni: "28.123.456",
    phone: "351-444-9876",
    email: "laurag@email.com",
    orders: 1,
    totalSpent: 15000,
    lastVisit: "23/10/2023",
  },
  {
    id: "3",
    name: "Carlos Ruiz",
    dni: "40.987.654",
    phone: "351-777-1122",
    email: "-",
    orders: 5,
    totalSpent: 850000,
    lastVisit: "23/10/2023",
  },
  {
    id: "4",
    name: "Ana Martínez",
    dni: "35.654.321",
    phone: "351-222-3344",
    email: "ana.m@email.com",
    orders: 2,
    totalSpent: 45000,
    lastVisit: "22/10/2023",
  },
]

export default function Clients() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Base de datos de clientes e historial.
          </p>
        </div>
        <Button icon={Plus}>Nuevo Cliente</Button>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Buscar por nombre, DNI o teléfono..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Historial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Visita
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {client.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        DNI: {client.dni}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">
                        {client.phone}
                      </span>
                      <span className="text-xs text-gray-500">
                        {client.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <Badge variant="blue">{client.orders} órdenes</Badge>
                      <span className="text-xs text-gray-500 mt-1">
                        $ {client.totalSpent.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-primary hover:text-primary-dark"
                    >
                      Ver Ficha <ExternalLink className="w-4 h-4 ml-1 inline" />
                    </Button>
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
