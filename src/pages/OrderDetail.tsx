import React, { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, Button, Badge, Select } from "../components/ui"
import {
  ArrowLeft,
  Edit,
  MessageSquare,
  Clock,
  Check,
  Printer,
  FileText,
} from "lucide-react"

export default function OrderDetail() {
  const { id } = useParams()
  const [status, setStatus] = useState("En Reparación")

  const history = [
    {
      date: "24/10/2023 14:30",
      user: "Técnico Alta Cba",
      action: "Actualizó estado a En Reparación",
      note: "Se comenzó a reemplazar el módulo.",
    },
    {
      date: "24/10/2023 10:15",
      user: "Admin",
      action: "Presupuesto Aprobado",
      note: "El cliente aceptó el presupuesto por teléfono.",
    },
    {
      date: "23/10/2023 18:45",
      user: "Técnico Alta Cba",
      action: "Diagnóstico Completado",
      note: "Módulo dañado severamente, placa intacta. Requiere cambio de módulo.",
    },
    {
      date: "23/10/2023 16:20",
      user: "Ventas Alta Cba",
      action: "Orden Creada",
      note: "Ingresa equipo.",
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/servicio-tecnico"
            className="text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Orden OT-{id || "10452"}
          </h1>
          <Badge variant="orange" className="ml-2 px-3 py-1 text-sm">
            {status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Printer}>
            Imprimir
          </Button>
          <Button variant="outline" icon={FileText}>
            Generar Remito
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Status */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Información del Equipo
              </h2>
              <Button variant="ghost" className="text-sm p-1">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="font-medium">Martín Pérez</p>
                <p className="text-sm">32.456.789 | 351-555-4321</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Equipo</p>
                <p className="font-medium">Samsung S22 Ultra</p>
                <p className="text-sm">IMEI: 354123098765432</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Falla Reportada</p>
                <p className="text-sm mt-1 bg-gray-50 p-2 rounded">
                  Módulo astillado por caída, el táctil funciona a medias.
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">
                  Observaciones al Ingreso
                </p>
                <p className="text-sm mt-1">
                  Rayones en los marcos laterales, ingresa con funda de silicona
                  transparente.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-3 mb-4">
              Diagnóstico y Presupuesto
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Informe Técnico
                </p>
                <textarea
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-primary focus:border-primary border"
                  rows={3}
                  defaultValue="Se corroboró el daño en el módulo. No hay daños internos en la placa base."
                />
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-900">
                    Estado del Presupuesto
                  </span>
                  <Badge variant="green">Aprobado</Badge>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Costo de Repuestos:</span>
                  <span>$ 125.000</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Mano de Obra:</span>
                  <span>$ 35.000</span>
                </div>
                <div className="flex justify-between font-bold text-base mt-3 pt-2 border-t border-blue-200">
                  <span>Total a Cobrar:</span>
                  <span>$ 160.000</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-3 mb-4">
              Repuestos Utilizados
            </h2>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200">
              <div>
                <p className="font-medium text-sm">
                  Módulo Display Orig. Samsung S22 Ultra
                </p>
                <p className="text-xs text-gray-500">
                  Cód: PRD-002 • Cantidad: 1
                </p>
              </div>
              <div className="font-medium text-sm">$ 125.000</div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-3 text-sm"
              icon={Edit}
            >
              Agregar o Modificar Repuestos
            </Button>
          </Card>
        </div>

        {/* Right Column: Actions & History */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Actualizar Estado
            </h2>
            <div className="space-y-4">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full"
              >
                <option value="Ingresado">Ingresado</option>
                <option value="En Diagnóstico">En Diagnóstico</option>
                <option value="Esperando Aprobación">
                  Esperando Aprobación
                </option>
                <option value="En Reparación">En Reparación</option>
                <option value="Listo para Entrega">Listo para Entrega</option>
                <option value="Sin Solución">Sin Solución</option>
                <option value="Entregado">Entregado</option>
              </Select>

              <textarea
                placeholder="Agregar una nota interna (opcional)..."
                className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-primary focus:border-primary border"
                rows={2}
              ></textarea>

              <Button className="w-full">Guardar Cambios</Button>
            </div>

            {status === "Listo para Entrega" && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="secondary" className="w-full">
                  Registrar Entrega y Cobro
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              Historial
            </h2>
            <div className="relative border-l border-gray-200 ml-3 space-y-6">
              {history.map((item, index) => (
                <div key={index} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-[6.5px] top-1.5 border-2 border-white"></div>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.date} • {item.user}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {item.action}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" className="w-full text-sm">
                Ver historial completo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
