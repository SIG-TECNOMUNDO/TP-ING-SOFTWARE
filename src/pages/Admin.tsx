import React, { useState } from "react"
import { Card, Button, Badge, Input, Label, Select } from "../components/ui"
import {
  UserPlus,
  Shield,
  Edit,
  Trash2,
  CreditCard,
  CheckCircle,
  CalendarDays,
  Wallet,
} from "lucide-react"

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

          <Card>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Configuración de Métodos de Pago
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Definí los descuentos y recargos que se aplican al registrar
                una venta.
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


