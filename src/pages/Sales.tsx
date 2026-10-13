import { useEffect, useMemo, useState } from "react"
import {
  CreditCard,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
} from "lucide-react"
import { Alert, Button, Card, Input, Label, Select } from "../components/ui"
import { useBranch } from "../context/BranchContext"
import { api, money, queryString } from "../services/api"
import type { Client, Product } from "../types"

type CartItem = Product & { quantity: number }

export default function Sales() {
  const { branchId } = useBranch()
  const [products, setProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("efectivo")
  const [installments, setInstallments] = useState("1")
  const [clientSearch, setClientSearch] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState("")
  const [message, setMessage] = useState<{
    text: string
    success?: boolean
  } | null>(null)

  useEffect(() => {
    if (!branchId) {
      setProducts([])
      return
    }
    const timer = setTimeout(
      () =>
        api<{ data: Product[] }>(
          `/products${queryString({ branchId, search: productSearch })}`,
        )
          .then((result) => setProducts(result.data))
          .catch((error) => setMessage({ text: error.message })),
      200,
    )
    return () => clearTimeout(timer)
  }, [branchId, productSearch])
  useEffect(() => {
    if (!clientSearch) {
      setClients([])
      return
    }
    const timer = setTimeout(
      () =>
        api<{ data: Client[] }>(
          `/clients${queryString({ search: clientSearch })}`,
        )
          .then((result) => setClients(result.data))
          .catch(() => setClients([])),
      250,
    )
    return () => clearTimeout(timer)
  }, [clientSearch])

  const addProduct = (product: Product) =>
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      return existing
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { ...product, quantity: 1 }]
    })
  const updateQuantity = (id: string, delta: number) =>
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    )
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0),
    [cart],
  )
  const discount = paymentMethod === "efectivo" ? subtotal * 0.1 : 0
  const total = subtotal - discount
  const confirmSale = async () => {
    setMessage(null)
    if (!branchId)
      return setMessage({
        text: "Seleccioná una sucursal para registrar la venta",
      })
    if (!cart.length) return setMessage({ text: "Agregá al menos un producto" })
    try {
      const sale = await api<{ number: string }>("/sales", {
        method: "POST",
        body: JSON.stringify({
          branchId,
          clientId: clientId || null,
          paymentMethod,
          installments: Number(installments),
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      })
      setCart([])
      setClientId("")
      setClientSearch("")
      setMessage({
        text: `Venta N.º ${sale.number} registrada correctamente`,
        success: true,
      })
    } catch (reason) {
      setMessage({
        text:
          reason instanceof Error
            ? reason.message
            : "No se pudo registrar la venta",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Registrar Venta</h1>
      {message && (
        <Alert variant={message.success ? "success" : "error"}>
          {message.text}
        </Alert>
      )}
      {!branchId && (
        <Alert variant="info">
          Seleccioná una sucursal en la barra superior para consultar stock y
          vender.
        </Alert>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4 flex">
              <Search className="mr-2 h-5 w-5 text-gray-500" />
              Buscar producto
            </h2>
            <Input
              type="search"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Código o nombre del producto…"
            />
            {productSearch && (
              <div className="mt-2 border rounded-md divide-y max-h-48 overflow-y-auto">
                {products.map((product) => {
                  const stock = product.stocks.reduce(
                    (sum, item) => sum + item.quantity,
                    0,
                  )
                  return (
                    <button
                      key={product.id}
                      disabled={!stock}
                      onClick={() => addProduct(product)}
                      className="w-full p-3 flex justify-between text-left hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span>
                        <strong className="block text-sm">
                          {product.name}
                        </strong>
                        <small>
                          {product.code} · Stock {stock}
                        </small>
                      </span>
                      <span className="font-medium">
                        {money(product.salePrice)}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </Card>
          <Card className="flex flex-col min-h-[350px]">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h2 className="text-sm font-medium uppercase flex">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Detalle de venta
              </h2>
            </div>
            <div className="flex-1 p-4">
              {!cart.length ? (
                <div className="h-full min-h-52 grid place-items-center text-gray-500">
                  <div className="text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto" />
                    <p>No hay productos en la venta</p>
                  </div>
                </div>
              ) : (
                <ul className="divide-y">
                  {cart.map((item) => (
                    <li key={item.id} className="py-3 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {money(item.salePrice)} c/u
                        </p>
                      </div>
                      <div className="flex border rounded">
                        <button
                          aria-label="Restar"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm py-1">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Sumar"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="w-28 text-right font-bold text-sm">
                        {money(item.salePrice * item.quantity)}
                      </div>
                      <button
                        aria-label="Quitar"
                        className="text-red-500"
                        onClick={() =>
                          setCart(
                            cart.filter((current) => current.id !== item.id),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4 border-b pb-2">
              Datos del cliente (opcional)
            </h2>
            <Label htmlFor="client-search">Buscar cliente</Label>
            <Input
              id="client-search"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder="DNI o nombre…"
            />
            {clients.length > 0 && (
              <Select
                className="mt-2"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Consumidor final</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} · {client.dni}
                  </option>
                ))}
              </Select>
            )}
          </Card>
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4 border-b pb-2 flex">
              <CreditCard className="mr-2 h-5 w-5" />
              Cobro
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment">Método de pago</Label>
                <Select
                  id="payment"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="efectivo">Efectivo (10% OFF)</option>
                  <option value="debito">Tarjeta de débito</option>
                  <option value="credito">Tarjeta de crédito</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="mercadolibre">Mercado Libre</option>
                </Select>
              </div>
              {paymentMethod === "credito" && (
                <div>
                  <Label htmlFor="installments">Cuotas</Label>
                  <Select
                    id="installments"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                  >
                    <option value="1">1 cuota</option>
                    <option value="3">3 cuotas</option>
                    <option value="6">6 cuotas</option>
                  </Select>
                </div>
              )}
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span>- {money(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>
              <Button className="w-full py-3" onClick={confirmSale}>
                Confirmar venta
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
