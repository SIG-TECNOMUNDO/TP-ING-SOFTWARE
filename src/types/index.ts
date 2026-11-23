export type Role = "ADMIN" | "SALES" | "TECH"

export type User = {
  id: string
  name: string
  email: string
  role: Role
  branchId: string | null
  branchName: string | null
}

export type Branch = {
  id: string
  name: string
  address: string | null
}
export type Stock = {
  branchId: string
  branchName: string
  quantity: number
}
export type Product = {
  id: string
  code: string
  name: string
  category: string
  salePrice: number
  /** Solo llega en la respuesta de la API para el rol Administrador. */
  costPrice?: number | null
  minStock: number
  stocks: Stock[]
  /** Celular: stock por IMEI. */
  tracksImei?: boolean
  availableUnits?: { imei: string; branchId: string }[]
}
export type Client = {
  id: string
  name: string
  dni: string | null
  phone: string
  email: string | null
  orders: number
  totalSpent: number
  lastVisit: string | null
}
export type OrderStatus = "INGRESADO" | "EN_DIAGNOSTICO" | "ESPERANDO_APROBACION" | "EN_REPARACION" | "LISTO_ENTREGA" | "SIN_SOLUCION" | "ENTREGADO"
export type ServiceOrder = {
  id: string
  number: string
  client: string
  dni: string | null
  device: string
  issue: string
  status: OrderStatus
  statusLabel: string
  date: string
  branch: string
}
