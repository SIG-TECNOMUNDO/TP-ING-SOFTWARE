import { useCallback, useEffect, useState } from "react"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import Modal from "../components/Modal"
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Label,
  Loading,
  Select,
} from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"
import { api, money, queryString } from "../services/api"
import type { Product } from "../types"

type ProductForm = {
  code: string
  name: string
  category: string
  salePrice: string
  minStock: string
  stocks: Record<string, string>
}
const emptyForm: ProductForm = {
  code: "",
  name: "",
  category: "Accesorios",
  salePrice: "",
  minStock: "0",
  stocks: {},
}

export default function Inventory() {
  const { user } = useAuth()
  const { branches, branchId } = useBranch()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<Product | null | undefined>(undefined)
  const [form, setForm] = useState<ProductForm>(emptyForm)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      setProducts(
        (
          await api<{ data: Product[] }>(
            `/products${queryString({ branchId, search, category })}`,
          )
        ).data,
      )
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo cargar el inventario",
      )
    } finally {
      setLoading(false)
    }
  }, [branchId, search, category])
  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  const openForm = (product: Product | null) => {
    setEditing(product)
    setForm(
      product
        ? {
            code: product.code,
            name: product.name,
            category: product.category,
            salePrice: String(product.salePrice),
            minStock: String(product.minStock),
            stocks: Object.fromEntries(
              product.stocks.map((stock) => [
                stock.branchId,
                String(stock.quantity),
              ]),
            ),
          }
        : emptyForm,
    )
  }
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    const payload = {
      ...form,
      salePrice: Number(form.salePrice),
      minStock: Number(form.minStock),
      stocks: branches.map((branch) => ({
        branchId: branch.id,
        quantity: Number(form.stocks[branch.id] ?? 0),
      })),
    }
    try {
      await api(editing ? `/products/${editing.id}` : "/products", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      })
      setEditing(undefined)
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar")
    }
  }
  const remove = async (product: Product) => {
    if (!confirm(`¿Desactivar ${product.name}?`)) return
    try {
      await api(`/products/${product.id}`, { method: "DELETE" })
      await load()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo eliminar")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestioná los productos y repuestos de ambas sucursales.
          </p>
        </div>
        {user?.role === "ADMIN" && (
          <Button icon={Plus} onClick={() => openForm(null)}>
            Nuevo producto
          </Button>
        )}
      </div>
      {error && <Alert>{error}</Alert>}
      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              aria-label="Buscar productos"
              type="search"
              placeholder="Buscar por nombre o código…"
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Select
            aria-label="Filtrar categoría"
            className="sm:w-48"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Todas las categorías</option>
            {["Equipos", "Repuestos", "Accesorios", "Audio"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <EmptyState>No se encontraron productos.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Código / Producto",
                    "Categoría",
                    "Precio de venta",
                    "Stock por sucursal",
                    "Estado",
                    "Acciones",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs text-gray-500 uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => {
                  const total = product.stocks.reduce(
                    (sum, stock) => sum + stock.quantity,
                    0,
                  )
                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.code}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge>{product.category}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {money(product.salePrice)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {product.stocks.map((stock) => (
                          <div key={stock.branchId}>
                            {stock.branchName}:{" "}
                            <strong>{stock.quantity}</strong>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={total <= product.minStock ? "red" : "green"}
                        >
                          {total <= product.minStock
                            ? "Stock bajo"
                            : "Disponible"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {user?.role === "ADMIN" ? (
                            <>
                              <button
                                aria-label={`Editar ${product.name}`}
                                className="text-blue-600"
                                onClick={() => openForm(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                aria-label={`Eliminar ${product.name}`}
                                className="text-red-600"
                                onClick={() => remove(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            "—"
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {editing !== undefined && (
        <Modal
          title={editing ? "Editar producto" : "Nuevo producto"}
          onClose={() => setEditing(undefined)}
        >
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="product-code">Código</Label>
              <Input
                id="product-code"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="product-name">Nombre</Label>
              <Input
                id="product-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="product-category">Categoría</Label>
              <Select
                id="product-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {["Equipos", "Repuestos", "Accesorios", "Audio"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sale-price">Precio</Label>
                <Input
                  id="sale-price"
                  type="number"
                  min="0"
                  required
                  value={form.salePrice}
                  onChange={(e) =>
                    setForm({ ...form, salePrice: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="min-stock">Stock mínimo</Label>
                <Input
                  id="min-stock"
                  type="number"
                  min="0"
                  required
                  value={form.minStock}
                  onChange={(e) =>
                    setForm({ ...form, minStock: e.target.value })
                  }
                />
              </div>
            </div>
            {branches.map((branch) => (
              <div key={branch.id}>
                <Label htmlFor={`stock-${branch.id}`}>
                  Stock {branch.name}
                </Label>
                <Input
                  id={`stock-${branch.id}`}
                  type="number"
                  min="0"
                  value={form.stocks[branch.id] ?? "0"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stocks: { ...form.stocks, [branch.id]: e.target.value },
                    })
                  }
                />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(undefined)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
