import React, { useState } from "react"
import { Card, Button, Input, Label, Select } from "../components/ui"
import { ArrowLeft, Save, Printer } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function NewOrder() {
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => {
      navigate("/servicio-tecnico")
    }, 2000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/servicio-tecnico"
          className="text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Nueva Orden de Trabajo
        </h1>
      </div>

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <p className="text-sm text-green-700 font-medium">
            Orden guardada exitosamente. Redirigiendo...
          </p>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="space-y-6">
          {/* Client Data */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
              1. Datos del Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Nombre y Apellido *</Label>
                <Input required placeholder="Ej. Juan Pérez" className="mt-1" />
              </div>
              <div>
                <Label>DNI</Label>
                <Input placeholder="Sin puntos" className="mt-1" />
              </div>
              <div>
                <Label>Teléfono *</Label>
                <Input
                  required
                  type="tel"
                  placeholder="Código de área + número"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-3">
                <Label>Correo electrónico</Label>
                <Input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Device Data */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
              2. Datos del Equipo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Equipo *</Label>
                <Select required className="mt-1">
                  <option value="">Seleccionar...</option>
                  <option value="celular">Celular</option>
                  <option value="tablet">Tablet</option>
                  <option value="notebook">Notebook</option>
                  <option value="pc">PC de Escritorio</option>
                  <option value="consola">Consola</option>
                  <option value="otro">Otro</option>
                </Select>
              </div>
              <div>
                <Label>Marca *</Label>
                <Input
                  required
                  placeholder="Ej. Samsung, Apple, Motorola"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Modelo *</Label>
                <Input
                  required
                  placeholder="Ej. Galaxy S22, iPhone 11"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Número de Serie / IMEI</Label>
                <Input
                  placeholder="Opcional pero recomendado"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Issue & Reception */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
              3. Falla y Recepción
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Descripción de la Falla (Según el cliente) *</Label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Detalle los problemas que reporta el cliente..."
                ></textarea>
              </div>
              <div>
                <Label>
                  Observaciones Físicas (Estado del equipo al ingresar)
                </Label>
                <textarea
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                  placeholder="Ej. Pantalla astillada, raspones en bordes, sin funda..."
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label>Sucursal Receptora *</Label>
                  <Select required className="mt-1">
                    <option value="yofre">Yofre Norte</option>
                    <option value="alta">Alta Córdoba</option>
                  </Select>
                </div>
                <div>
                  <Label>Accesorios que ingresan</Label>
                  <Input
                    placeholder="Ej. Cargador, Funda, Chip"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/servicio-tecnico")}
            >
              Cancelar
            </Button>
            <Button type="button" variant="secondary" icon={Printer}>
              Imprimir Comprobante
            </Button>
            <Button type="submit" icon={Save}>
              Guardar Orden
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}


