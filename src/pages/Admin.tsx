import React, { useState } from "react"
import { Card, Button, Badge, Input, Label, Select } from "../components/ui"
import Modal from "../components/Modal"
import {
  UserPlus,
  Shield,
  Trash2,
  CreditCard,
  CheckCircle,
  CalendarDays,
  Wallet,
  AlertCircle,
  Users,
  User as UserIcon,
  Mail,
  Lock,
} from "lucide-react"

type UserRole = "Administrador" | "Ventas" | "Técnico"

interface SystemUser {
  id: string
  name: string
  email: string
  role: UserRole
  branch?: string
}

const initialUsers: SystemUser[] = [
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
  // Estado para gestión de usuarios
  const [users, setUsers] = useState<SystemUser[]>(initialUsers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userToast, setUserToast] = useState<string | null>(null)

  // Estado del formulario de nuevo usuario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Ventas" as UserRole,
  })
  const [formError, setFormError] = useState<string | null>(null)

  // Estado de configuración de pagos existente
  const [paymentSettings, setPaymentSettings] = useState({
    cashDiscount: "10",
    creditThree: "12",
    creditSix: "24",
    creditTwelve: "42",
    cardBrand: "Todas las tarjetas",
    cardType: "Crédito",
    debitSurcharge: "0",
    promotionDay: "Martes",
    promotionCard: "Visa",
    promotionInstallments: "3 cuotas",
    promotionDiscount: "15",
    virtualWallet: "Mercado Pago",
    walletAdjustmentType: "Sin ajuste",
    walletAdjustment: "0",
  })
  const [settingsSaved, setSettingsSaved] = useState(false)

  // Handlers para usuarios
  const handleOpenModal = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Ventas",
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormError(null)
  }

  const handleCreateUser = (event: React.FormEvent) => {
    event.preventDefault()
    setFormError(null)

    // Validaciones
    if (!formData.name.trim()) {
      setFormError("Por favor ingrese el nombre y apellido.")
      return
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("Por favor ingrese un correo electrónico válido.")
      return
    }

    if (!formData.password) {
      setFormError("La contraseña no puede estar vacía.")
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

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === formData.email.trim().toLowerCase(),
    )
    if (emailExists) {
      setFormError("Ya existe un usuario con este correo electrónico.")
      return
    }

    const newUser: SystemUser = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      branch: formData.role === "Administrador" ? "Todas" : "Yofre Norte",
    }

    setUsers((prev) => [newUser, ...prev])
    setIsModalOpen(false)
    setUserToast(`Usuario "${newUser.name}" creado con éxito.`)
    window.setTimeout(() => setUserToast(null), 4000)
  }

  const handleDeleteUser = (id: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    setUserToast(`Usuario "${name}" eliminado.`)
    window.setTimeout(() => setUserToast(null), 3000)
  }

  // Helpers de estilo para roles
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

  // Handlers para pagos
  const updatePaymentSetting = (
    field: keyof typeof paymentSettings,
    value: string,
  ) => {
    setPaymentSettings((current) => ({ ...current, [field]: value }))
    setSettingsSaved(false)
  }

  const savePaymentSettings = (event: React.FormEvent) => {
    event.preventDefault()
    setSettingsSaved(true)
    window.setTimeout(() => setSettingsSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión de usuarios, permisos y configuración general del sistema.
        </p>
      </div>

      {/* Toast de notificación global */}
      {userToast && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-sm font-medium">{userToast}</span>
          </div>
          <button
            onClick={() => setUserToast(null)}
            className="text-green-600 hover:text-green-800 text-xs font-semibold uppercase tracking-wider"
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Gestión de Usuarios */}
          <Card className="overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-primary rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Gestión de Usuarios
                  </h2>
                  <p className="text-xs text-gray-500">
                    {users.length} usuarios registrados en la plataforma
                  </p>
                </div>
              </div>

              <Button
                icon={UserPlus}
                onClick={handleOpenModal}
                className="py-2 text-sm shadow-sm"
              >
                Nuevo Usuario
              </Button>
            </div>

            {/* Listado de Usuarios */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Usuario / Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm mr-3">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No hay usuarios cargados en el sistema.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Modal / Formulario de Creación de Usuario */}
          {isModalOpen && (
            <Modal title="Crear Nuevo Usuario" onClose={handleCloseModal}>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <p className="text-xs text-gray-500 -mt-2">
                  Completa los datos del nuevo integrante para asignarle
                  credenciales y rol en SIG-Tecnomundo.
                </p>

                {formError && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-red-700 font-medium">
                      {formError}
                    </span>
                  </div>
                )}

                <div>
                  <Label htmlFor="user-name">Nombre y Apellido</Label>
                  <div className="relative mt-1">
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
                </div>

                <div>
                  <Label htmlFor="user-email">Nombre de Usuario o Email</Label>
                  <div className="relative mt-1">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-password">Contraseña</Label>
                    <div className="relative mt-1">
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
                  </div>

                  <div>
                    <Label htmlFor="user-confirm-password">
                      Repetir Contraseña
                    </Label>
                    <div className="relative mt-1">
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
                </div>

                <div>
                  <Label htmlFor="user-role">Rol en el Sistema</Label>
                  <div className="mt-1">
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
                        Técnico (Órdenes técnicas y servicio)
                      </option>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
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

          {/* Configuración de Métodos de Pago */}
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Configuración de Métodos de Pago
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Definí los descuentos y recargos que se aplican al registrar una
                venta.
              </p>
            </div>
            <form className="p-5" onSubmit={savePaymentSettings}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Condiciones generales
                  </h3>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cash-discount">
                        Descuento en Efectivo (%)
                      </Label>
                      <Input
                        id="cash-discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.cashDiscount}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "cashDiscount",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="debit-surcharge">
                        Recargo Tarjeta de Débito (%)
                      </Label>
                      <Input
                        id="debit-surcharge"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.debitSurcharge}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "debitSurcharge",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Tarjetas
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Seleccioná la tarjeta y el tipo al que se aplicarán estos
                    recargos.
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-brand">Tarjeta</Label>
                      <Select
                        id="card-brand"
                        value={paymentSettings.cardBrand}
                        onChange={(event) =>
                          updatePaymentSetting("cardBrand", event.target.value)
                        }
                      >
                        <option>Todas las tarjetas</option>
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>American Express</option>
                        <option>Naranja X</option>
                        <option>Cabal</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="card-type">Tipo de Tarjeta</Label>
                      <Select
                        id="card-type"
                        value={paymentSettings.cardType}
                        onChange={(event) =>
                          updatePaymentSetting("cardType", event.target.value)
                        }
                      >
                        <option>Crédito</option>
                        <option>Débito</option>
                        <option>Prepaga</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="credit-three">
                        Recargo Crédito 3 Cuotas (%)
                      </Label>
                      <Input
                        id="credit-three"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.creditThree}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "creditThree",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="credit-six">
                        Recargo Crédito 6 Cuotas (%)
                      </Label>
                      <Input
                        id="credit-six"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.creditSix}
                        onChange={(event) =>
                          updatePaymentSetting("creditSix", event.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="credit-twelve">
                        Recargo Crédito 12 Cuotas (%)
                      </Label>
                      <Input
                        id="credit-twelve"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.creditTwelve}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "creditTwelve",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Promociones por Día
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Configurá una promoción bancaria recurrente para un día de
                    la semana.
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="promotion-day">Día de la Promoción</Label>
                      <Select
                        id="promotion-day"
                        value={paymentSettings.promotionDay}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "promotionDay",
                            event.target.value,
                          )
                        }
                      >
                        <option>Lunes</option>
                        <option>Martes</option>
                        <option>Miércoles</option>
                        <option>Jueves</option>
                        <option>Viernes</option>
                        <option>Sábado</option>
                        <option>Domingo</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="promotion-card">Tarjeta Aplicable</Label>
                      <Select
                        id="promotion-card"
                        value={paymentSettings.promotionCard}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "promotionCard",
                            event.target.value,
                          )
                        }
                      >
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>American Express</option>
                        <option>Naranja X</option>
                        <option>Cabal</option>
                        <option>Todas las tarjetas</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="promotion-installments">
                        Plan de Cuotas
                      </Label>
                      <Select
                        id="promotion-installments"
                        value={paymentSettings.promotionInstallments}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "promotionInstallments",
                            event.target.value,
                          )
                        }
                      >
                        <option>1 cuota</option>
                        <option>3 cuotas</option>
                        <option>6 cuotas</option>
                        <option>12 cuotas</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="promotion-discount">
                        Descuento Promocional (%)
                      </Label>
                      <Input
                        id="promotion-discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.promotionDiscount}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "promotionDiscount",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-5">
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Billeteras Virtuales
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Definí si cada billetera aplica un descuento, un recargo o
                    mantiene el precio de lista.
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="virtual-wallet">Billetera</Label>
                      <Select
                        id="virtual-wallet"
                        value={paymentSettings.virtualWallet}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "virtualWallet",
                            event.target.value,
                          )
                        }
                      >
                        <option>Mercado Pago</option>
                        <option>MODO</option>
                        <option>Ualá</option>
                        <option>Naranja X</option>
                        <option>Personal Pay</option>
                        <option>Cuenta DNI</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="wallet-adjustment-type">
                        Tipo de Ajuste
                      </Label>
                      <Select
                        id="wallet-adjustment-type"
                        value={paymentSettings.walletAdjustmentType}
                        onChange={(event) =>
                          updatePaymentSetting(
                            "walletAdjustmentType",
                            event.target.value,
                          )
                        }
                      >
                        <option>Sin ajuste</option>
                        <option>Descuento</option>
                        <option>Recargo</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="wallet-adjustment">Porcentaje (%)</Label>
                      <Input
                        id="wallet-adjustment"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={paymentSettings.walletAdjustment}
                        disabled={
                          paymentSettings.walletAdjustmentType === "Sin ajuste"
                        }
                        onChange={(event) =>
                          updatePaymentSetting(
                            "walletAdjustment",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <Button type="submit">Guardar Configuración</Button>
                {settingsSaved && (
                  <div
                    className="flex items-center text-sm font-medium text-green-700"
                    role="status"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Configuración guardada correctamente.
                  </div>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Barra lateral */}
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
