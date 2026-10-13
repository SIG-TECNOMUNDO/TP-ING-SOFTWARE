import { useState } from "react"
import { ArrowLeft, Printer, Save } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Card, Input, Label, Select } from "../components/ui"
import { useBranch } from "../context/BranchContext"
import { api } from "../services/api"

export default function NewOrder() {
  const navigate = useNavigate()
  const { branches, branchId } = useBranch()
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSaving(true)
    const data = new FormData(event.currentTarget)
    const payload = {
      branchId: String(data.get("branchId")),
      client: {
        name: String(data.get("clientName")),
        dni: String(data.get("dni")),
        phone: String(data.get("phone")),
        email: String(data.get("email")),
      },
      deviceType: String(data.get("deviceType")),
      brand: String(data.get("brand")),
      model: String(data.get("model")),
      serialImei: String(data.get("serialImei")),
      reportedIssue: String(data.get("reportedIssue")),
      physicalCondition: String(data.get("physicalCondition")),
      accessories: String(data.get("accessories")),
    }
    try {
      const order = await api<{ id: string }>("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      navigate(`/servicio-tecnico/${order.id}`, { replace: true })
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo guardar la orden",
      )
    } finally {
      setSaving(false)
    }
  }
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          to="/servicio-tecnico"
          aria-label="Volver"
          className="text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Nueva Orden de Trabajo</h1>
      </div>
      {error && <Alert>{error}</Alert>}
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4 border-b pb-2">
            1. Datos del cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="clientName">Nombre y apellido *</Label>
              <Input id="clientName" name="clientName" required />
            </div>
            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" name="dni" />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4 border-b pb-2">
            2. Datos del equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deviceType">Tipo de equipo *</Label>
              <Select id="deviceType" name="deviceType" required>
                <option value="">Seleccionar…</option>
                {[
                  "Celular",
                  "Tablet",
                  "Notebook",
                  "PC de Escritorio",
                  "Consola",
                  "Otro",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="brand">Marca *</Label>
              <Input id="brand" name="brand" required />
            </div>
            <div>
              <Label htmlFor="model">Modelo *</Label>
              <Input id="model" name="model" required />
            </div>
            <div>
              <Label htmlFor="serialImei">Número de serie / IMEI</Label>
              <Input id="serialImei" name="serialImei" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4 border-b pb-2">
            3. Falla y recepción
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportedIssue">Descripción de la falla *</Label>
              <textarea
                id="reportedIssue"
                name="reportedIssue"
                required
                rows={3}
                className="block w-full rounded-md border border-gray-300 p-3 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="physicalCondition">Observaciones físicas</Label>
              <textarea
                id="physicalCondition"
                name="physicalCondition"
                rows={2}
                className="block w-full rounded-md border border-gray-300 p-3 text-sm"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="branchId">Sucursal receptora *</Label>
                <Select
                  id="branchId"
                  name="branchId"
                  required
                  defaultValue={branchId}
                >
                  {!branchId && <option value="">Seleccionar…</option>}
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="accessories">Accesorios que ingresan</Label>
                <Input id="accessories" name="accessories" />
              </div>
            </div>
          </div>
        </Card>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/servicio-tecnico")}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={Printer}
            onClick={() => window.print()}
          >
            Imprimir comprobante
          </Button>
          <Button type="submit" icon={Save} disabled={saving}>
            {saving ? "Guardando…" : "Guardar orden"}
          </Button>
        </div>
      </form>
    </div>
  )
}
