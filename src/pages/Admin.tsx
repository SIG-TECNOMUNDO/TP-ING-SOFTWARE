import React from "react"
import { Card, Button, Badge } from "../components/ui"
import { UserPlus, Shield, Edit, Trash2 } from "lucide-react"

const mockUsers = [
  {
    id: "1",
    name: "Administrador Principal",
    email: "admin@tecnomundo.com",
    role: "Administrador",
    branch: "Todas",
  },
  {
    id: "2",
    name: "Ventas Yofre",
    email: "ventas.yofre@tecnomundo.com",
    role: "Ventas",
    branch: "Yofre Norte",
  },
  {
    id: "3",
    name: "Técnico Alta Cba",
    email: "tec.altacba@tecnomundo.com",
    role: "Técnico",
    branch: "Alta Córdoba",
  },
  {
    id: "4",
    name: "Ventas Alta Cba",
    email: "ventas.altacba@tecnomundo.com",
    role: "Ventas",
    branch: "Alta Córdoba",
  },
]

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión de usuarios, permisos y configuración general.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-gray-500" />
                Usuarios del Sistema
              </h2>
              <Button icon={UserPlus} className="text-sm py-1.5">
                Nuevo Usuario
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sucursal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            user.role === "Administrador"
                              ? "orange"
                              : user.role === "Técnico"
                                ? "blue"
                                : "green"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
              Reportes
            </h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                Cierre de Caja Diario
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                Rendimiento de Técnicos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                Productos más vendidos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                Exportar Base de Datos
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-gray-50 border-gray-200">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">
              Información del Sistema
            </h2>
            <p className="text-xs text-gray-500 mb-1">Versión: v1.0.0-beta</p>
            <p className="text-xs text-gray-500 mb-1">
              Última actualización: 24 Oct 2023
            </p>
            <p className="text-xs text-gray-500">
              Soporte: soporte@tecnomundo.com
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
