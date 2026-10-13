import { useCallback, useEffect, useState } from "react"
import { ExternalLink, Plus, Search } from "lucide-react"
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
} from "../components/ui"
import { api, money, queryString, shortDate } from "../services/api"
import type { Client } from "../types"
import { useAuth } from "../context/AuthContext"

export default function Clients() {
  const { user } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newOpen, setNewOpen] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)
  const load = useCallback(async () => {
    setLoading(true)
    try {
      setClients(
        (await api<{ data: Client[] }>(`/clients${queryString({ search })}`))
          .data,
      )
      setError("")
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudieron cargar los clientes",
      )
    } finally {
      setLoading(false)
    }
  }, [search])
  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])
  const create = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    try {
      await api("/clients", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(data)),
      })
      setNewOpen(false)
      await load()
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo crear el cliente",
      )
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Base de datos de clientes e historial.
          </p>
        </div>
        {user?.role !== "TECH" && (
          <Button icon={Plus} onClick={() => setNewOpen(true)}>
            Nuevo cliente
          </Button>
        )}
      </div>
      {error && <Alert>{error}</Alert>}
      <Card>
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              aria-label="Buscar clientes"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre, DNI o teléfono…"
            />
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : !clients.length ? (
          <EmptyState>No se encontraron clientes.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Cliente",
                    "Contacto",
                    "Historial",
                    "Última visita",
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
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-sm">{client.name}</div>
                      <div className="text-xs text-gray-500">
                        DNI: {client.dni || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{client.phone}</div>
                      <div className="text-xs text-gray-500">
                        {client.email || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="blue">{client.orders} órdenes</Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {money(client.totalSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {shortDate(client.lastVisit)}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        className="text-primary"
                        onClick={() => setSelected(client)}
                      >
                        Ver ficha <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {newOpen && (
        <Modal title="Nuevo cliente" onClose={() => setNewOpen(false)}>
          <form onSubmit={create} className="space-y-4">
            <div>
              <Label htmlFor="new-name">Nombre y apellido</Label>
              <Input id="new-name" name="name" required />
            </div>
            <div>
              <Label htmlFor="new-dni">DNI</Label>
              <Input id="new-dni" name="dni" />
            </div>
            <div>
              <Label htmlFor="new-phone">Teléfono</Label>
              <Input id="new-phone" name="phone" required />
            </div>
            <div>
              <Label htmlFor="new-email">Correo electrónico</Label>
              <Input id="new-email" name="email" type="email" />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal title="Ficha del cliente" onClose={() => setSelected(null)}>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Nombre</dt>
              <dd className="font-medium">{selected.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">DNI</dt>
              <dd>{selected.dni || "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Teléfono</dt>
              <dd>{selected.phone}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Correo</dt>
              <dd>{selected.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Órdenes</dt>
              <dd>{selected.orders}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Total registrado</dt>
              <dd>{money(selected.totalSpent)}</dd>
            </div>
          </dl>
        </Modal>
      )}
    </div>
  )
}
