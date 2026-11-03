import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Card, Button, Badge, Input, Label, Select } from "../components/ui"
import Modal from "../components/Modal"
import {
  UserPlus,
  Trash2,
  CreditCard,
  CheckCircle2,
  CalendarDays,
  Wallet,
  AlertCircle,
  Users,
  Building2,
  Settings,
  Plus,
  MapPin,
  Phone,
  ArrowRight,
  Calculator,
  ShieldCheck,
} from "lucide-react"

type UserRole = "Administrador" | "Ventas" | "Técnico"

interface SystemUser {
  id: string
  name: string
  email: string
  role: UserRole
  branch: string
}

interface BranchConfig {
  id: string
  name: string
  address: string
  phone: string
  manager: string
  status: "Activa" | "Mantenimiento"
}

const initialUsers: SystemUser[] = [
  {
    id: "1",
    name: "Administrador Principal",
    email: "admin@tecnomundo.com",
    role: "Administrador",
    branch: "Todas las sucursales",
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

const initialBranches: BranchConfig[] = [
  {
    id: "SUC-01",
    name: "Yofre Norte",
    address: "Altolaguirre 2145, B° Yofre Norte",
    phone: "351-455-8899",
    manager: "Ventas Yofre",
    status: "Activa",
  },
  {
    id: "SUC-02",
    name: "Alta Córdoba",
    address: "Mariano Fragueiro 1980, B° Alta Córdoba",
    phone: "351-471-2233",
    manager: "Ventas Alta Cba",
    status: "Activa",
  },
]

export default function Admin() {
  // 1. Estado para Usuarios
  const [users, setUsers] = useState<SystemUser[]>(initialUsers)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Ventas" as UserRole,
    branch: "Yofre Norte",
  })
  const [formError, setFormError] = useState<string | null>(null)

  // 2. Estado para Sucursales
  const [branches, setBranches] = useState<BranchConfig[]>(initialBranches)
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false)
  const [branchForm, setBranchForm] = useState({
    name: "",
    address: "",
    phone: "",
    manager: "",
  })

  // 3. Estado para Configuración del Sistema y Pagos
  const [systemConfig, setSystemConfig] = useState({
    companyName: "TecnoMundo - Ventas & Servicio Técnico",
    cuit: "30-71548921-9",
    warrantyDays: "90",
    defaultInitialCash: "50000",
  })
  const [paymentSettings, setPaymentSettings] = useState({
    cashDiscount: "10",
    debitSurcharge: "0",
    cardBrand: "Todas las tarjetas",
    cardType: "Crédito",
    creditThree: "12",
    creditSix: "24",
    creditTwelve: "42",
    promotionDay: "Martes",
    promotionCard: "Visa",
    promotionInstallments: "3 cuotas",
    promotionDiscount: "15",
    virtualWallet: "Mercado Pago",
    walletAdjustmentType: "Sin ajuste",
    walletAdjustment: "0",
  })

  const showToast = (msg: string) => {
    setToastMsg(msg)
    window.setTimeout(() => setToastMsg(null), 4000)
  }

  // Handlers de Usuarios
  const handleOpenUserModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Ventas",
      branch: "Yofre Norte",
    })
    setFormError(null)
    setIsUserModalOpen(true)
  }

  const handleCreateUser = (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)

    if (!formData.name.trim()) {
      setFormError("Por favor ingresá el nombre y apellido.")
      return
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("Por favor ingresá un correo electrónico válido.")
      return
    }
    if (formData.password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden.")
      return
    }
    if (
      users.some(
        (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase(),
      )
    ) {
      setFormError("Ya existe un usuario con este correo electrónico.")
      return
    }

    const newUser: SystemUser = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      branch:
        formData.role === "Administrador"
          ? "Todas las sucursales"
          : formData.branch,
    }

    setUsers((prev) => [newUser, ...prev])
    setIsUserModalOpen(false)
    showToast(`Usuario "${newUser.name}" creado con éxito.`)
  }

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    showToast(`Usuario "${name}" eliminado.`)
  }

  // Handlers de Sucursales
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!branchForm.name.trim()) return

    const created: BranchConfig = {
      id: `SUC-0${branches.length + 1}`,
      name: branchForm.name.trim(),
      address: branchForm.address.trim() || "Córdoba Capital",
      phone: branchForm.phone.trim() || "351-000-0000",
      manager: branchForm.manager.trim() || "Administrador",
      status: "Activa",
    }

    setBranches((prev) => [...prev, created])
    setBranchForm({ name: "", address: "", phone: "", manager: "" })
    setIsBranchModalOpen(false)
    showToast(`Sucursal "${created.name}" incorporada correctamente.`)
  }

  // Handlers de Configuración del Sistema y Pagos
  const updatePaymentSetting = (
    field: keyof typeof paymentSettings,
    value: string,
  ) => {
    setPaymentSettings((current) => ({ ...current, [field]: value }))
  }

  const saveAllSettings = (event: React.FormEvent) => {
    event.preventDefault()
    showToast("Configuración del sistema y medios de pago guardada con éxito.")
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "Administrador":
        return "orange"
      case "Técnico":
        return "blue"
      case "Ventas":
        return "green"
      default:
        return "gray"
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
            Administración
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Panel de control organizado en tarjetas para Usuarios, Sucursales y
            Configuración del Sistema
          </p>
        </div>

        {/* Acceso rápido al Cierre de Caja descentralizado en Caja */}
        <Link to="/caja?action=cierre">
          <Button
            variant="outline"
            icon={Calculator}
            className="bg-white border-primary/30 text-primary hover:bg-blue-50 font-semibold text-xs sm:text-sm"
          >
            Ir a Cierre de Caja Diario
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* Toast Global */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{toastMsg}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Grid Superior de Tarjetas: 1. Usuarios y Roles + 2. Sucursales */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* TARJETA 1: USUARIOS Y PERMISOS (7 columnas) */}
        <Card className="xl:col-span-7 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-[#00559D] rounded-2xl border border-blue-200/50">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                  1. Usuarios y Permisos
                </h2>
                <p className="text-2xs sm:text-xs text-slate-400">
                  {users.length} cuentas activas con acceso a la plataforma
                </p>
              </div>
            </div>

            <Button
              icon={UserPlus}
              onClick={handleOpenUserModal}
              className="py-2 px-4 text-xs font-bold shadow-xs"
            >
              Nuevo Usuario
            </Button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/90">
                <tr>
                  <th className="px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Nombre / Sucursal
                  </th>
                  <th className="px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-5 py-3 text-right text-2xs font-bold text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-[#0B2B4C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">
                            {u.name}
                          </div>
                          <div className="text-2xs text-slate-400">
                            {u.branch}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-600">
                      {u.email}
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(u.role)}>
                        {u.role}
                      </Badge>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 text-2xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Nota de permisos: Todos los empleados en turno tienen habilitado el{" "}
              <strong>Cierre de Caja y Reporte Diario</strong> desde el módulo
              Caja.
            </span>
          </div>
        </Card>

        {/* TARJETA 2: SUCURSALES (5 columnas) */}
        <Card className="xl:col-span-5 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 text-[#F56C00] rounded-2xl border border-orange-200/50">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    2. Sucursales
                  </h2>
                  <p className="text-2xs sm:text-xs text-slate-400">
                    Puntos de venta y laboratorios técnicos
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                icon={Plus}
                onClick={() => setIsBranchModalOpen(true)}
                className="py-2 px-3 text-xs font-bold"
              >
                Nueva Sucursal
              </Button>
            </div>

            <div className="p-5 space-y-3.5">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">
                        {b.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 font-heading">
                        {b.name}
                      </h3>
                    </div>
                    <Badge variant="green">{b.status}</Badge>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F56C00] shrink-0" />
                      <span>{b.address}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>
                        {b.phone} • Encargado:{" "}
                        <strong className="text-slate-800">{b.manager}</strong>
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* TARJETA 3: CONFIGURACIÓN DEL SISTEMA Y MEDIOS DE PAGO */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl border border-purple-200/50">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                3. Configuración del Sistema y Medios de Pago
              </h2>
              <p className="text-2xs sm:text-xs text-slate-400">
                Parámetros operativos globales, descuentos en efectivo, planes
                de cuotas y billeteras virtuales
              </p>
            </div>
          </div>
          <Badge variant="purple">Parámetros Globales</Badge>
        </div>

        <form onSubmit={saveAllSettings} className="p-5 sm:p-6 space-y-6">
          {/* Sub-tarjetas internas en Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Bloque A: Parámetros Generales del Sistema */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                <Settings className="w-4 h-4 text-[#00559D]" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Parámetros Generales
                </h3>
              </div>

              <div>
                <Label>Razón Social / Nombre Comercial</Label>
                <Input
                  value={systemConfig.companyName}
                  onChange={(e) =>
                    setSystemConfig((p) => ({
                      ...p,
                      companyName: e.target.value,
                    }))
                  }
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>CUIT</Label>
                  <Input
                    value={systemConfig.cuit}
                    onChange={(e) =>
                      setSystemConfig((p) => ({ ...p, cuit: e.target.value }))
                    }
                    className="bg-white font-mono"
                  />
                </div>
                <div>
                  <Label>Garantía SAT (Días)</Label>
                  <Input
                    type="number"
                    value={systemConfig.warrantyDays}
                    onChange={(e) =>
                      setSystemConfig((p) => ({
                        ...p,
                        warrantyDays: e.target.value,
                      }))
                    }
                    className="bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <Label>Fondo Inicial de Caja por Defecto ($)</Label>
                <Input
                  type="number"
                  value={systemConfig.defaultInitialCash}
                  onChange={(e) =>
                    setSystemConfig((p) => ({
                      ...p,
                      defaultInitialCash: e.target.value,
                    }))
                  }
                  className="bg-white font-mono"
                />
              </div>
            </div>

            {/* Bloque B: Efectivo y Tarjetas */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                <CreditCard className="w-4 h-4 text-[#F56C00]" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Efectivo y Financiación con Tarjetas
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cash-discount">Descuento Efectivo (%)</Label>
                  <Input
                    id="cash-discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={paymentSettings.cashDiscount}
                    onChange={(e) =>
                      updatePaymentSetting("cashDiscount", e.target.value)
                    }
                    className="bg-white font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="debit-surcharge">Recargo Débito (%)</Label>
                  <Input
                    id="debit-surcharge"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={paymentSettings.debitSurcharge}
                    onChange={(e) =>
                      updatePaymentSetting("debitSurcharge", e.target.value)
                    }
                    className="bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="card-brand">Tarjeta</Label>
                  <Select
                    id="card-brand"
                    value={paymentSettings.cardBrand}
                    onChange={(e) =>
                      updatePaymentSetting("cardBrand", e.target.value)
                    }
                    className="bg-white"
                  >
                    <option>Todas las tarjetas</option>
                    <option>Visa</option>
                    <option>Mastercard</option>
                    <option>American Express</option>
                    <option>Naranja X</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="card-type">Tipo</Label>
                  <Select
                    id="card-type"
                    value={paymentSettings.cardType}
                    onChange={(e) =>
                      updatePaymentSetting("cardType", e.target.value)
                    }
                    className="bg-white"
                  >
                    <option>Crédito</option>
                    <option>Débito</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="credit-three">3 Cuotas (%)</Label>
                  <Input
                    id="credit-three"
                    type="number"
                    value={paymentSettings.creditThree}
                    onChange={(e) =>
                      updatePaymentSetting("creditThree", e.target.value)
                    }
                    className="bg-white font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="credit-six">6 Cuotas (%)</Label>
                  <Input
                    id="credit-six"
                    type="number"
                    value={paymentSettings.creditSix}
                    onChange={(e) =>
                      updatePaymentSetting("creditSix", e.target.value)
                    }
                    className="bg-white font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="credit-twelve">12 Cuotas (%)</Label>
                  <Input
                    id="credit-twelve"
                    type="number"
                    value={paymentSettings.creditTwelve}
                    onChange={(e) =>
                      updatePaymentSetting("creditTwelve", e.target.value)
                    }
                    className="bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bloque C: Promociones por Día y Billeteras Virtuales */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  Promociones y Billeteras
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="promotion-day">Día Promoción</Label>
                  <Select
                    id="promotion-day"
                    value={paymentSettings.promotionDay}
                    onChange={(e) =>
                      updatePaymentSetting("promotionDay", e.target.value)
                    }
                    className="bg-white"
                  >
                    <option>Lunes</option>
                    <option>Martes</option>
                    <option>Miércoles</option>
                    <option>Jueves</option>
                    <option>Viernes</option>
                    <option>Sábado</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="promotion-discount">Dto. Promo (%)</Label>
                  <Input
                    id="promotion-discount"
                    type="number"
                    value={paymentSettings.promotionDiscount}
                    onChange={(e) =>
                      updatePaymentSetting("promotionDiscount", e.target.value)
                    }
                    className="bg-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/70 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span>Billeteras Virtuales</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="virtual-wallet">Billetera</Label>
                    <Select
                      id="virtual-wallet"
                      value={paymentSettings.virtualWallet}
                      onChange={(e) =>
                        updatePaymentSetting("virtualWallet", e.target.value)
                      }
                      className="bg-white"
                    >
                      <option>Mercado Pago</option>
                      <option>MODO</option>
                      <option>Ualá</option>
                      <option>Naranja X</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="wallet-adjustment-type">Ajuste</Label>
                    <Select
                      id="wallet-adjustment-type"
                      value={paymentSettings.walletAdjustmentType}
                      onChange={(e) =>
                        updatePaymentSetting(
                          "walletAdjustmentType",
                          e.target.value,
                        )
                      }
                      className="bg-white"
                    >
                      <option>Sin ajuste</option>
                      <option>Descuento</option>
                      <option>Recargo</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <Button type="submit" className="px-6 py-2.5 font-bold shadow-md">
              Guardar Configuración General
            </Button>
          </div>
        </form>
      </Card>

      {/* Modal: Crear Nuevo Usuario */}
      {isUserModalOpen && (
        <Modal
          title="Crear Nuevo Usuario"
          onClose={() => setIsUserModalOpen(false)}
        >
          <form onSubmit={handleCreateUser} className="space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-xs text-rose-700 font-medium">
                  {formError}
                </span>
              </div>
            )}

            <div>
              <Label htmlFor="user-name">Nombre y Apellido</Label>
              <Input
                id="user-name"
                type="text"
                required
                placeholder="Ej. Lucas González"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="user-email">Nombre de Usuario o Email</Label>
              <Input
                id="user-email"
                type="email"
                required
                placeholder="lucas.gonzalez@tecnomundo.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-password">Contraseña</Label>
                <Input
                  id="user-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="user-confirm-password">
                  Repetir Contraseña
                </Label>
                <Input
                  id="user-confirm-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-role">Rol en el Sistema</Label>
                <Select
                  id="user-role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                >
                  <option value="Administrador">
                    Administrador (Acceso total)
                  </option>
                  <option value="Ventas">
                    Ventas (Caja, ventas e inventario)
                  </option>
                  <option value="Técnico">
                    Técnico (Órdenes técnicas y caja)
                  </option>
                </Select>
              </div>

              <div>
                <Label htmlFor="user-branch">Sucursal Asignada</Label>
                <Select
                  id="user-branch"
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUserModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Crear Usuario
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Nueva Sucursal */}
      {isBranchModalOpen && (
        <Modal
          title="Registrar Nueva Sucursal"
          onClose={() => setIsBranchModalOpen(false)}
        >
          <form onSubmit={handleCreateBranch} className="space-y-4">
            <div>
              <Label>Nombre de la Sucursal *</Label>
              <Input
                required
                autoFocus
                placeholder="Ej. Sucursal Nueva Córdoba"
                value={branchForm.name}
                onChange={(e) =>
                  setBranchForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Dirección *</Label>
              <Input
                required
                placeholder="Ej. Av. Hipólito Yrigoyen 420"
                value={branchForm.address}
                onChange={(e) =>
                  setBranchForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Teléfono</Label>
                <Input
                  placeholder="Ej. 351-500-9900"
                  value={branchForm.phone}
                  onChange={(e) =>
                    setBranchForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Encargado / Responsable</Label>
                <Input
                  placeholder="Ej. Martín Gómez"
                  value={branchForm.manager}
                  onChange={(e) =>
                    setBranchForm((p) => ({ ...p, manager: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBranchModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Guardar Sucursal
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
