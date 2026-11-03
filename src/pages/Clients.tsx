import React, { useState } from "react"
import { Card, Button, Input, Badge, Label } from "../components/ui"
import Modal from "../components/Modal"
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Wrench,
  ShoppingBag,
  User,
  Edit,
  FileText,
  CreditCard,
  CheckCircle2,
  X,
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
    ordersCount: 2,
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
    ordersCount: 1,
    purchasesCount: 1,
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
    address: "Sucre 1140, Centro",
    branch: "Yofre Norte",
    ordersCount: 1,
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
  {
    id: "5",
    name: "Diego Fernández",
    dni: "29.876.543",
    phone: "351-666-8899",
    email: "diego.fernandez@gmail.com",
    address: "Mariano Fragueiro 1520, Alta Córdoba",
    branch: "Alta Córdoba",
    ordersCount: 1,
    purchasesCount: 1,
    totalSpent: 114000,
    lastVisit: "22/10/2023",
    repairs: [
      {
        id: "OT-10448",
        date: "22/10/2023",
        device: "iPad Air 5",
        issue: "Reemplazo de batería agotada",
        status: "En Diagnóstico",
        cost: 92000,
      },
    ],
    purchases: [
      {
        id: "VTA-80955",
        date: "19/10/2023",
        items: "1x Cargador Rápido Apple 20W USB-C",
        paymentMethod: "Efectivo",
        total: 22000,
      },
    ],
  },
  {
    id: "6",
    name: "Sofía López",
    dni: "42.123.987",
    phone: "351-333-2211",
    email: "sofia.lopez@hotmail.com",
    address: "Av. Capdevila 980, Yofre",
    branch: "Yofre Norte",
    ordersCount: 1,
    purchasesCount: 1,
    totalSpent: 53000,
    lastVisit: "20/10/2023",
    repairs: [
      {
        id: "OT-10447",
        date: "20/10/2023",
        device: "iPhone 11",
        issue: "Reemplazo de flex botón de encendido",
        status: "Entregado",
        cost: 38000,
      },
    ],
    purchases: [
      {
        id: "VTA-80412",
        date: "20/10/2023",
        items: "1x Funda Silicona MagSafe",
        paymentMethod: "Transferencia",
        total: 15000,
      },
    ],
  },
  {
    id: "7",
    name: "Lucas Cabrera",
    dni: "38.912.340",
    phone: "351-811-4509",
    email: "lucas.cabrera@correo.com",
    address: "Bedoya 640, Cofico",
    branch: "Alta Córdoba",
    ordersCount: 1,
    purchasesCount: 0,
    totalSpent: 42000,
    lastVisit: "Hoy",
    repairs: [
      {
        id: "OT-10453",
        date: "Hoy",
        device: "Xiaomi Redmi Note 12",
        issue: "Cambio de módulo display",
        status: "Ingresado",
        cost: 42000,
      },
    ],
    purchases: [],
  },
  {
    id: "8",
    name: "Valeria Sosa",
    dni: "31.540.219",
    phone: "351-290-7761",
    email: "valeria.sosa@estudio.com",
    address: "Independencia 820, Nueva Córdoba",
    branch: "Alta Córdoba",
    ordersCount: 1,
    purchasesCount: 1,
    totalSpent: 175000,
    lastVisit: "Hoy",
    repairs: [
      {
        id: "OT-10452",
        date: "Hoy",
        device: "MacBook Air M2",
        issue: "Revisión de teclado y limpieza ultrasónica",
        status: "En Diagnóstico",
        cost: 120000,
      },
    ],
    purchases: [
      {
        id: "VTA-84710",
        date: "14/10/2023",
        items: "1x Hub USB-C Multipuerto HDMI",
        paymentMethod: "Tarjeta",
        total: 55000,
      },
    ],
  },
  {
    id: "9",
    name: "Nicolás Castro",
    dni: "36.701.882",
    phone: "351-602-3318",
    email: "nico.castro@email.com",
    address: "Rancagua 3100, Villa Corina",
    branch: "Yofre Norte",
    ordersCount: 1,
    purchasesCount: 1,
    totalSpent: 28500,
    lastVisit: "Hoy",
    repairs: [
      {
        id: "OT-10451",
        date: "Hoy",
        device: "Samsung Galaxy A54",
        issue: "Placa dañada por sobretensión",
        status: "Sin Solución",
        cost: 0,
      },
    ],
    purchases: [
      {
        id: "VTA-84650",
        date: "10/10/2023",
        items: "1x Cargador Samsung 25W + Cable",
        paymentMethod: "Efectivo",
        total: 28500,
      },
    ],
  },
]

export default function Clients() {
  const [clients, setClients] = useState<ClientProfile[]>(initialClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialClients[0].id,
  )
  const [historyTab, setHistoryTab] = useState<"repairs" | "purchases">(
    "repairs",
  )

  // Modal de Alta / Edición de Cliente
  const [clientModalMode, setClientModalMode] = useState<
    "create" | "edit" | null
  >(null)
  const [clientForm, setClientForm] = useState({
    name: "",
    dni: "",
    phone: "",
    email: "",
    address: "",
    branch: "Alta Córdoba",
  })
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3500)
  }

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    const cleanDni = c.dni.replace(/\./g, "")
    const cleanQ = q.replace(/\./g, "")
    return (
      c.name.toLowerCase().includes(q) ||
      c.dni.toLowerCase().includes(q) ||
      cleanDni.includes(cleanQ) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  })

  const selectedClient =
    clients.find((c) => c.id === selectedClientId) ||
    filteredClients[0] ||
    null

  const openCreateClientModal = () => {
    setClientForm({
      name: "",
      dni: "",
      phone: "",
      email: "",
      address: "",
      branch: "Alta Córdoba",
    })
    setClientModalMode("create")
  }

  const openEditClientModal = (client: ClientProfile) => {
    setClientForm({
      name: client.name,
      dni: client.dni,
      phone: client.phone,
      email: client.email === "-" ? "" : client.email,
      address: client.address,
      branch: client.branch,
    })
    setClientModalMode("edit")
  }

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientForm.name.trim()) return

    if (clientModalMode === "create") {
      const created: ClientProfile = {
        id: String(Date.now()),
        name: clientForm.name.trim(),
        dni: clientForm.dni.trim() || "Sin especificar",
        phone: clientForm.phone.trim() || "-",
        email: clientForm.email.trim() || "-",
        address: clientForm.address.trim() || "Córdoba Capital",
        branch: clientForm.branch,
        ordersCount: 0,
        purchasesCount: 0,
        totalSpent: 0,
        lastVisit: "Hoy",
        repairs: [],
        purchases: [],
      }

      setClients((prev) => [created, ...prev])
      setSelectedClientId(created.id)
      triggerToast(`Cliente "${created.name}" registrado con éxito.`)
    } else if (clientModalMode === "edit" && selectedClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === selectedClient.id
            ? {
                ...c,
                name: clientForm.name.trim(),
                dni: clientForm.dni.trim() || c.dni,
                phone: clientForm.phone.trim() || c.phone,
                email: clientForm.email.trim() || "-",
                address: clientForm.address.trim() || c.address,
                branch: clientForm.branch,
              }
            : c,
        ),
      )
      triggerToast(`Ficha de "${clientForm.name.trim()}" actualizada.`)
    }

    setClientModalMode(null)
  }

  return (
    <div className="space-y-6">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Clientes
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Seleccioná un cliente del listado izquierdo para consultar y editar
            su ficha e historial a la derecha
          </p>
        </div>
        <Button
          icon={Plus}
          onClick={openCreateClientModal}
          className="font-bold shadow-md py-2.5 px-4"
        >
          Nuevo Cliente
        </Button>
      </div>

      {/* Layout Master-Detail (Pantalla dividida en 2 columnas alineadas: 55% Izquierda / 45% Derecha) */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* COLUMNA IZQUIERDA (55% de ancho): Buscador arriba + Tabla "Listado de Clientes" con scroll interno */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <Card className="flex flex-col overflow-hidden h-[580px]">
            {/* Barra de búsqueda integrada en la parte superior */}
            <div className="p-4 border-b border-slate-100 bg-white shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                  Listado de Clientes
                </h2>
                <Badge variant="blue">
                  {filteredClients.length} registrados
                </Badge>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, DNI o teléfono..."
                  className="pl-10 pr-9"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabla compacta con altura fija y scroll interno (overflow-y-auto) */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/95 sticky top-0 z-10 backdrop-blur-xs">
                  <tr>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                      Teléfono
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredClients.map((client) => {
                    const isSelected = selectedClient?.id === client.id
                    return (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/90 hover:bg-blue-50"
                            : "hover:bg-slate-50/80"
                        }`}
                      >
                        <td className="px-4 sm:px-5 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected
                                  ? "bg-[#00559D] text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span
                                className={`block text-xs sm:text-sm truncate ${
                                  isSelected
                                    ? "font-bold text-[#00559D]"
                                    : "font-semibold text-slate-900"
                                }`}
                              >
                                {client.name}
                              </span>
                              <span className="block text-2xs text-slate-400">
                                Últ. visita: {client.lastVisit}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3 whitespace-nowrap text-xs font-mono text-slate-600">
                          {client.dni}
                        </td>
                        <td className="px-4 sm:px-5 py-3 whitespace-nowrap text-xs font-medium text-slate-700">
                          {client.phone}
                        </td>
                      </tr>
                    )
                  })}

                  {filteredClients.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        No se encontraron clientes para "{searchQuery}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* COLUMNA DERECHA (45% de ancho): Detalle / Ficha del Cliente nivelada horizontalmente */}
        <div className="w-full lg:w-[45%] flex flex-col">
          <Card className="flex flex-col overflow-hidden h-[580px]">
            {selectedClient ? (
              <>
                {/* Cabecera de la Ficha del Cliente con botón de acción rápida "Editar" */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-start justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#0B2B4C] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {selectedClient.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-3xs uppercase tracking-wider font-bold text-[#F56C00]">
                        Ficha del Cliente
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading truncate">
                        {selectedClient.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        DNI: {selectedClient.dni} • {selectedClient.branch}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    icon={Edit}
                    onClick={() => openEditClientModal(selectedClient)}
                    className="py-1.5 px-3 text-xs font-bold shrink-0"
                  >
                    Editar
                  </Button>
                </div>

                {/* Cuerpo scrollable de la Ficha del Cliente */}
                <div className="p-4 sm:p-5 flex-1 min-h-0 overflow-y-auto space-y-5">
                  {/* Bloque 1: Datos de Contacto */}
                  <div className="space-y-2.5">
                    <h3 className="text-2xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      Datos de Contacto
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <span className="block text-3xs uppercase font-bold text-slate-400">
                          Teléfono / WhatsApp
                        </span>
                        <span className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                          {selectedClient.phone}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <span className="block text-3xs uppercase font-bold text-slate-400">
                          Correo Electrónico
                        </span>
                        <span className="text-xs font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {selectedClient.email}
                          </span>
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 sm:col-span-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="block text-3xs uppercase font-bold text-slate-400">
                            Dirección
                          </span>
                          <span className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#F56C00] shrink-0" />
                            <span className="truncate">
                              {selectedClient.address}
                            </span>
                          </span>
                        </div>
                        <div className="text-right shrink-0 pl-2 border-l border-slate-200">
                          <span className="block text-3xs uppercase font-bold text-slate-400">
                            Total Facturado
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#00559D] font-mono">
                            $ {selectedClient.totalSpent.toLocaleString("es-AR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bloque 2: Historial de Órdenes de Servicio Técnico y Compras */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-2xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        Historial del Cliente
                      </h3>

                      <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200/70">
                        <button
                          type="button"
                          onClick={() => setHistoryTab("repairs")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                            historyTab === "repairs"
                              ? "bg-[#00559D] text-white shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Wrench className="w-3 h-3" />
                          <span>
                            Servicio Técnico ({selectedClient.repairs.length})
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHistoryTab("purchases")}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                            historyTab === "purchases"
                              ? "bg-[#00559D] text-white shadow-2xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>
                            Compras ({selectedClient.purchases.length})
                          </span>
                        </button>
                      </div>
                    </div>

                    {historyTab === "repairs" ? (
                      selectedClient.repairs.length === 0 ? (
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                          No registra órdenes de servicio técnico.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {selectedClient.repairs.map((rep) => (
                            <div
                              key={rep.id}
                              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
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
                              <p className="text-xs text-slate-600">
                                {rep.issue}
                              </p>
                              <div className="flex items-center justify-between pt-1 text-2xs text-slate-400">
                                <span>Fecha: {rep.date}</span>
                                <span className="font-mono font-bold text-slate-900">
                                  $ {rep.cost.toLocaleString("es-AR")}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : selectedClient.purchases.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                        No registra compras por mostrador.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {selectedClient.purchases.map((pur) => (
                          <div
                            key={pur.id}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
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
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <User className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-700">
                  Seleccioná un cliente del listado
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Hacé clic en cualquier fila de la izquierda para ver su ficha
                  completa.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal para Crear o Editar Cliente */}
      {clientModalMode && (
        <Modal
          title={
            clientModalMode === "create"
              ? "Registrar Nuevo Cliente"
              : "Editar Ficha del Cliente"
          }
          onClose={() => setClientModalMode(null)}
        >
          <form onSubmit={handleSaveClient} className="space-y-4">
            <div>
              <Label>Nombre y Apellido *</Label>
              <Input
                required
                autoFocus
                placeholder="Ej. Roberto Sánchez"
                value={clientForm.name}
                onChange={(e) =>
                  setClientForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>DNI / CUIT</Label>
                <Input
                  placeholder="Ej. 34.123.456"
                  value={clientForm.dni}
                  onChange={(e) =>
                    setClientForm((p) => ({ ...p, dni: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Teléfono / WhatsApp *</Label>
                <Input
                  required
                  placeholder="Ej. 351-600-1234"
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Correo Electrónico</Label>
              <Input
                type="email"
                placeholder="cliente@correo.com"
                value={clientForm.email}
                onChange={(e) =>
                  setClientForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Dirección</Label>
              <Input
                placeholder="Calle y número, Barrio"
                value={clientForm.address}
                onChange={(e) =>
                  setClientForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setClientModalMode(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="font-bold">
                {clientModalMode === "create"
                  ? "Guardar Cliente"
                  : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
