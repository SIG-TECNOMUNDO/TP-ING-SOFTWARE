import React, { useState } from "react"
import { Card, Button, Input, Select, Label, Badge } from "../components/ui"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  CreditCard,
} from "lucide-react"

const mockProducts = [
  { id: "1", name: "Funda Silicona MagSafe iPhone 14", price: 15000 },
  { id: "2", name: "Auriculares JBL Tune 510BT", price: 45000 },
]

export default function Sales() {
  const [cart, setCart] = useState(
    mockProducts.map((p) => ({ ...p, quantity: 1 })),
  )
  const [paymentMethod, setPaymentMethod] = useState("efectivo")

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          const newQ = item.quantity + delta
          return { ...item, quantity: newQ > 0 ? newQ : 1 }
        }
        return item
      }),
    )
  }

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )
  const discount = paymentMethod === "efectivo" ? subtotal * 0.1 : 0
  const total = subtotal - discount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Registrar Venta</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products & Cart */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Search className="mr-2 h-5 w-5 text-gray-500" />
              Buscar Producto
            </h2>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Código de barras o nombre del producto..."
                  className="w-full"
                />
              </div>
              <Button>Agregar</Button>
            </div>
          </Card>

          <Card className="flex flex-col h-[400px]">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h2 className="text-sm font-medium text-gray-700 flex items-center uppercase tracking-wider">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Detalle de Venta
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
                  <p>No hay productos en la venta</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="py-3 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          $ {item.price.toLocaleString("es-AR")} c/u
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-l-md"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded-r-md"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="w-24 text-right text-sm font-bold text-gray-900">
                          ${" "}
                          {(item.price * item.quantity).toLocaleString("es-AR")}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Client & Payment */}
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
              Datos del Cliente (Opcional)
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Buscar Cliente</Label>
                <div className="flex mt-1 gap-2">
                  <Input placeholder="DNI o Nombre..." />
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
                Venta a Consumidor Final
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
              Cobro
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Método de Pago</Label>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-1"
                >
                  <option value="efectivo">Efectivo (10% OFF)</option>
                  <option value="debito">Tarjeta de Débito</option>
                  <option value="credito">Tarjeta de Crédito</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="mercadolibre">
                    Venta Mercado Libre (Manual)
                  </option>
                </Select>
              </div>

              {paymentMethod === "credito" && (
                <div>
                  <Label>Cuotas</Label>
                  <Select className="mt-1">
                    <option>1 cuota sin interés</option>
                    <option>3 cuotas fijas</option>
                    <option>6 cuotas fijas</option>
                  </Select>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>$ {subtotal.toLocaleString("es-AR")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Descuento Efectivo (10%)</span>
                    <span>- $ {discount.toLocaleString("es-AR")}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>$ {total.toLocaleString("es-AR")}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full py-3 text-lg h-auto">
                  Confirmar Venta
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
