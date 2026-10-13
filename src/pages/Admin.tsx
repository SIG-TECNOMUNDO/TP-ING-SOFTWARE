import { useCallback, useEffect, useState } from "react"
import { Shield, Trash2, UserPlus } from "lucide-react"
import Modal from "../components/Modal"
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  Label,
  Loading,
  Select,
} from "../components/ui"
import { useAuth } from "../context/AuthContext"
import { useBranch } from "../context/BranchContext"
import { API_URL, api, queryString } from "../services/api"
import type { Role } from "../types"

type SystemUser = {
  id: string
  name: string
  email: string
  role: Role
  roleName: string
  branchId: string | null
  branch: string
  active: boolean
}

export default function Admin() {
  const { user } = useAuth()
  const { branches, branchId } = useBranch()
  const [users, setUsers] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)
  const load = useCallback(async () => {
    try {
      setUsers((await api<{ data: SystemUser[] }>("/users")).data)
      setError("")
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudieron cargar los usuarios",
      )
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    load()
  }, [load])
  const create = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const role = String(data.get("role"))
    try {
      await api("/users", {
        method: "POST",
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
          role,
          branchId: role === "ADMIN" ? null : data.get("branchId"),
        }),
      })
      setOpen(false)
      await load()
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo crear el usuario",
      )
    }
  }
  const deactivate = async (account: SystemUser) => {
    if (!confirm(`¿Desactivar a ${account.name}?`)) return
    try {
      await api(`/users/${account.id}`, { method: "DELETE" })
      await load()
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "No se pudo desactivar",
      )
    }
  }
  const download = (path: string) => {
    window.location.href = `${API_URL}/reports/${path}${queryString({ branchId })}`
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administración</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestión de usuarios, permisos y configuración general.
        </p>
      </div>
      {error && <Alert>{error}</Alert>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-4 border-b flex justify-between">
              <h2 className="text-lg font-medium flex">
                <Shield className="mr-2 h-5 w-5" />
                Usuarios del sistema
              </h2>
              <Button icon={UserPlus} onClick={() => setOpen(true)}>
                Nuevo usuario
              </Button>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Usuario", "Rol", "Sucursal", "Estado", "Acciones"].map(
                        (head) => (
                          <th
                            key={head}
                            className="px-6 py-3 text-left text-xs text-gray-500 uppercase"
                          >
                            {head}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((account) => (
                      <tr
                        key={account.id}
                        className={!account.active ? "opacity-50" : ""}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-sm">
                            {account.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {account.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              account.role === "ADMIN"
                                ? "orange"
                                : account.role === "TECH"
                                  ? "blue"
                                  : "green"
                            }
                          >
                            {account.roleName}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">{account.branch}</td>
                        <td className="px-6 py-4">
                          <Badge variant={account.active ? "green" : "red"}>
                            {account.active ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            disabled={
                              !account.active || account.id === user?.id
                            }
                            aria-label={`Desactivar ${account.name}`}
                            onClick={() => deactivate(account)}
                            className="text-red-600 disabled:text-gray-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4 border-b pb-2">Reportes</h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => download("cash-closing.csv")}
              >
                Cierre de caja diario
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => download("sales.csv")}
              >
                Detalle de ventas
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => download("technicians.csv")}
              >
                Rendimiento de técnicos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => download("top-products.csv")}
              >
                Productos más vendidos
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => download("export.json")}
              >
                Exportar datos
              </Button>
              <p className="text-xs text-gray-500">
                El archivo CSV respeta el filtro global de sucursal.
              </p>
            </div>
          </Card>
          <Card className="p-4 bg-gray-50">
            <h2 className="text-sm font-medium uppercase mb-2">
              Información del sistema
            </h2>
            <p className="text-xs text-gray-500">Versión: v1.0.0-mvp</p>
            <p className="text-xs text-gray-500">
              Arquitectura: React + API Node + PostgreSQL
            </p>
          </Card>
        </div>
      </div>
      {open && (
        <Modal title="Nuevo usuario" onClose={() => setOpen(false)}>
          <form onSubmit={create} className="space-y-4">
            <div>
              <Label htmlFor="user-name">Nombre</Label>
              <Input id="user-name" name="name" required />
            </div>
            <div>
              <Label htmlFor="user-email">Correo</Label>
              <Input id="user-email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="user-password">Contraseña inicial</Label>
              <Input
                id="user-password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </div>
            <div>
              <Label htmlFor="user-role">Rol</Label>
              <Select id="user-role" name="role">
                <option value="SALES">Ventas</option>
                <option value="TECH">Técnico</option>
                <option value="ADMIN">Administrador</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="user-branch">Sucursal</Label>
              <Select id="user-branch" name="branchId">
                <option value="">Seleccionar…</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Para administradores se ignorará la sucursal.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Crear usuario</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
