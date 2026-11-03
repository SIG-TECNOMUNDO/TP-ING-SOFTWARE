import React, { useState } from "react"
import { Card, Button, Input, Badge, Label } from "../components/ui"
import Modal from "../components/Modal"
import {
  Search,
  Plus,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Wrench,
  ShoppingBag,
  User,
  Calendar,
  X,
  FileText,
  CreditCard,
} from "lucide-react"

interface ClientRepairRecord {
  id: string
  date: string
  device: string
  issue: string
  status: string
  cost: number
}

interface ClientPurchaseRecord {
  id: string
  date: string
  items: string
  paymentMethod: string
  total: number
}

interface ClientProfile {
  id: string
  name: string
  dni: string
  phone: string
  email: string
  address: string
  branch: string
  ordersCount: number
  purchasesCount: number
  totalSpent: number
  lastVisit: string
  repairs: ClientRepairRecord[]
  purchases: ClientPurchaseRecord[]
}

const initialClients: ClientProfile[] = [
  {
    id: "1",
    name: "Martín Pérez",
    dni: "32.456.789",
    phone: "351-555-4321",
    email: "martin.p@email.com",
    address: "Av. Juan B. Justo 2450, Alta Córdoba",
    branch: "Alta Córdoba",
    ordersCount: 3,
    purchasesCount: 2,
    totalSpent: 245000,
    lastVisit: "24/10/2023",
    repairs: [
      {
        id: "OT-10452",
        date: "24/10/2023",
        device: "Samsung S22 Ultra",
        issue: "Cambio de módulo OLED original",
        status: "En Reparación",
        cost: 160000,
      },
      {
        id: "OT-10190",
        date: "12/08/2023",
        device: "Samsung A52",
        issue: "Reemplazo de pin de carga Tipo C",
        status: "Entregado",
        cost: 28000,
      },
    ],
    purchases: [
      {
        id: "VTA-84102",
        date: "24/10/2023",
        items: "1x Cargador Samsung 25W + 1x Funda Silicona",
        paymentMethod: "Transferencia",
        total: 37000,
      },
      {
        id: "VTA-79310",
        date: "12/08/2023",
        items: "2x Vidrio Templado 9D Full Glue",
        paymentMethod: "Efectivo",
        total: 20000,
      },
    ],
  },
  {
    id: "2",
    name: "Laura Gómez",
    dni: "28.123.456",
    phone: "351-444-9876",
    email: "laurag@email.com",
    address: "Altolaguirre 1890, Yofre Norte",
    branch: "Yofre Norte",
    ordersCount: 1,
    purchasesCount: 1,
    totalSpent: 63000,
    lastVisit: "23/10/2023",
    repairs: [
      {
        id: "OT-10451",
        date: "23/10/2023",
        device: "iPhone 13 Pro",
        issue: "Limpieza y reparación de puerto Lightning",
        status: "Listo para Entrega",
        cost: 48000,
      },
    ],
    purchases: [
      {
        id: "VTA-83900",
        date: "23/10/2023",
        items: "1x Funda Silicona MagSafe iPhone 13 Pro",
        paymentMethod: "Efectivo",
        total: 15000,
      },
    ],
  },
  {
    id: "3",
    name: "Carlos Ruiz",
    dni: "40.987.654",
    phone: "351-777-1122",
    email: "carlos.ruiz@empresa.com.ar",
    address: "Bv. Los Granaderos 3100, Córdoba",
    branch: "Alta Córdoba",
    ordersCount: 2,
    purchasesCount: 3,
    totalSpent: 850000,
    lastVisit: "23/10/2023",
    repairs: [
      {
        id: "OT-10450",
        date: "23/10/2023",
        device: "Notebook HP Pavilion 15",
        issue: "Mantenimiento térmico y ampliación SSD 1TB",
        status: "Ingresado",
        cost: 95000,
      },
    ],
    purchases: [
      {
        id: "VTA-83211",
        date: "15/09/2023",
        items: "1x Motorola Edge 40 Pro + Auriculares JBL",
        paymentMethod: "Pago Mixto",
        total: 755000,
      },
    ],
  },
  {
    id: "4",
    name: "Ana Martínez",
    dni: "35.654.321",
    phone: "351-222-3344",
    email: "ana.m@email.com",
    address: " Sucre 1140, Centro",
    branch: "Yofre Norte",
    ordersCount: 2,
    purchasesCount: 1,
    totalSpent: 45000,
    lastVisit: "22/10/2023",
    repairs: [
      {
        id: "OT-10449",
        date: "22/10/2023",
        device: "Motorola Edge 30",
        issue: "Equipo mojado con corto en PMIC",
        status: "Sin Solución",
        cost: 0,
      },
    ],
    purchases: [
      {
        id: "VTA-81004",
        date: "02/10/2023",
        items: "1x Auriculares JBL Tune 510BT",
        paymentMethod: "Tarjeta",
        total: 45000,
      },
    ],
  },
]

export default function Clients() {
  const [clients, setClients] = useState<ClientProfile[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(
    null,
  )
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    dni: "",
    phone: "",
    email: "",
    address: "",
  })

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.dni.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  })

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientForm.name.trim()) return

    const created: ClientProfile = {
      id: String(Date.now()),
      name: newClientForm.name.trim(),
      dni: newClientForm.dni.trim() || "Sin especificar",
      phone: newClientForm.phone.trim() || "-",
      email: newClientForm.email.trim() || "-",
      address: newClientForm.address.trim() || "Córdoba Capital",
      branch: "Casa Central",
      ordersCount: 0,
      purchasesCount: 0,
      totalSpent: 0,
      lastVisit: "Hoy",
      repairs: [],
      purchases: [],
    }

    setClients((prev) => [created, ...prev])
    setNewClientForm({ name: "", dni: "", phone: "", email: "", address: "" })
    setShowNewClientModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Clientes
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Directorio organizado en tarjetas con acceso a ficha de contacto e
            historial de reparaciones y compras
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={() => setShowNewClientModal(true)}
          className="font-bold shadow-md py-2.5 px-4"
        >
          Nuevo Cliente
        </Button>
      </div>

      {/* Buscador en Tarjeta Blanca */}
      <Card className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cliente por nombre, DNI, teléfono o correo..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Badge variant="blue">{filteredClients.length} clientes</Badge>
        </div>
      </Card>

      {/* Listado de Clientes organizado en Tarjetas (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const initials = client.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          return (
            <Card
              key={client.id}
              className="p-5 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                {/* Cabecera de la tarjeta del cliente */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#0B2B4C] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 font-heading truncate">
                        {client.name}
                      </h2>
                      <p className="text-xs font-mono text-slate-500">
                        DNI: {client.dni}
                      </p>
                    </div>
                  </div>
                  <Badge variant="blue" className="shrink-0">
                    {client.ordersCount} órdenes
                  </Badge>
                </div>

                {/* Datos rápidos de contacto */}
                <div className="py-4 space-y-2 text-xs text-slate-600 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#00559D] shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {client.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F56C00] shrink-0" />
                    <span className="truncate">{client.address}</span>
                  </div>
                </div>

                {/* Resumen de actividad */}
                <div className="py-3.5 grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      Total Facturado
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">
                      $ {client.totalSpent.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      Última Visita
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {client.lastVisit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(client)}
                  className="w-full py-2 text-xs font-bold text-primary border-primary/25 hover:bg-blue-50"
                >
                  Ver Perfil e Historial
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Modal de Perfil del Cliente con Separadores Visuales Claros entre "Datos de Contacto" e "Historial" */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="client-profile-title"
        >
          <div className="bg-slate-100 text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Cabecera Oscura Corporativa del Perfil */}
            <div className="px-6 py-4 bg-[#0B2B4C] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#F56C00] text-white font-bold text-sm flex items-center justify-center">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2
                    id="client-profile-title"
                    className="text-base sm:text-lg font-bold font-heading"
                  >
                    Perfil de Cliente: {selectedClient.name}
                  </h2>
                  <p className="text-2xs text-blue-200/80">
                    DNI {selectedClient.dni} • Cliente activo en{" "}
                    {selectedClient.branch}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Cerrar ficha de cliente"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Perfil con Separadores Visuales Claros */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* SECCIÓN 1: DATOS DE CONTACTO */}
              <Card className="p-5">
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-50 text-[#00559D] border border-blue-200/50">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                        Datos de Contacto y Facturación
                      </h3>
                      <p className="text-2xs text-slate-400">
                        Información personal registrada en la ficha del cliente
                      </p>
                    </div>
                  </div>
                  <Badge variant="blue">Ficha Verificada</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      Teléfono / WhatsApp
                    </span>
                    <span className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      {selectedClient.phone}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      DNI / CUIT
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {selectedClient.dni}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      Correo Electrónico
                    </span>
                    <span className="text-xs font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedClient.email}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-3xs uppercase font-bold text-slate-400">
                      Dirección / Domicilio
                    </span>
                    <span className="text-xs font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#F56C00] shrink-0" />
                      <span className="truncate">{selectedClient.address}</span>
                    </span>
                  </div>
                </div>
              </Card>

              {/* SEPARADOR VISUAL CLARO */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-300" />
                <span className="shrink-0 mx-4 px-3 py-1 rounded-full bg-white border border-slate-200 text-2xs font-extrabold uppercase tracking-wider text-slate-500 shadow-2xs">
                  Historial del Cliente (Reparaciones y Compras)
                </span>
                <div className="flex-grow border-t border-slate-300" />
              </div>

              {/* SECCIÓN 2: HISTORIAL DIVIDIDO EN REPARACIONES Y COMPRAS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Sub-apartado A: Historial de Reparaciones (Servicio Técnico) */}
                <Card className="p-5 flex flex-col">
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-orange-50 text-[#F56C00] border border-orange-200/50">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        Historial de Reparaciones
                      </h4>
                    </div>
                    <Badge variant="orange">
                      {selectedClient.repairs.length} registros
                    </Badge>
                  </div>

                  {selectedClient.repairs.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">
                      No registra órdenes de servicio técnico.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedClient.repairs.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">
                              {rep.id} • {rep.device}
                            </span>
                            <Badge
                              variant={
                                rep.status === "Listo para Entrega" ||
                                rep.status === "Entregado"
                                  ? "green"
                                  : rep.status === "Sin Solución"
                                    ? "red"
                                    : "orange"
                              }
                            >
                              {rep.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">{rep.issue}</p>
                          <div className="flex items-center justify-between pt-1 text-2xs text-slate-400">
                            <span>Fecha: {rep.date}</span>
                            <span className="font-mono font-bold text-slate-900">
                              $ {rep.cost.toLocaleString("es-AR")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Sub-apartado B: Historial de Compras (Ventas) */}
                <Card className="p-5 flex flex-col">
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        Historial de Compras
                      </h4>
                    </div>
                    <Badge variant="green">
                      {selectedClient.purchases.length} compras
                    </Badge>
                  </div>

                  {selectedClient.purchases.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">
                      No registra compras de productos por mostrador.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedClient.purchases.map((pur) => (
                        <div
                          key={pur.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">
                              {pur.id}
                            </span>
                            <span className="inline-flex items-center gap-1 text-2xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                              <CreditCard className="w-3 h-3 text-primary" />
                              {pur.paymentMethod}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">
                            {pur.items}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-2xs text-slate-400">
                            <span>Fecha: {pur.date}</span>
                            <span className="font-mono font-bold text-emerald-700">
                              $ {pur.total.toLocaleString("es-AR")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500">
                Total histórico acumulado:{" "}
                <strong className="text-slate-900 font-mono">
                  $ {selectedClient.totalSpent.toLocaleString("es-AR")}
                </strong>
              </div>
              <Button
                variant="primary"
                onClick={() => setSelectedClient(null)}
              >
                Cerrar Ficha
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Nuevo Cliente */}
      {showNewClientModal && (
        <Modal
          title="Registrar Nuevo Cliente"
          onClose={() => setShowNewClientModal(false)}
        >
          <form onSubmit={handleCreateClient} className="space-y-4">
            <div>
              <Label>Nombre y Apellido *</Label>
              <Input
                required
                autoFocus
                placeholder="Ej. Roberto Sánchez"
                value={newClientForm.name}
                onChange={(e) =>
                  setNewClientForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>DNI / CUIT</Label>
                <Input
                  placeholder="Ej. 34.123.456"
                  value={newClientForm.dni}
                  onChange={(e) =>
                    setNewClientForm((p) => ({ ...p, dni: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Teléfono / WhatsApp *</Label>
                <Input
                  required
                  placeholder="Ej. 351-600-1234"
                  value={newClientForm.phone}
                  onChange={(e) =>
                    setNewClientForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Correo Electrónico</Label>
              <Input
                type="email"
                placeholder="cliente@correo.com"
                value={newClientForm.email}
                onChange={(e) =>
                  setNewClientForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input
                placeholder="Calle y número, Barrio"
                value={newClientForm.address}
                onChange={(e) =>
                  setNewClientForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewClientModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Cliente</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
