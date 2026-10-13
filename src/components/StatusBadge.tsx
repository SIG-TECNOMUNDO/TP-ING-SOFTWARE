import { Badge } from "./ui"
import type { OrderStatus } from "../types"

const variants: Record<OrderStatus, "gray" | "blue" | "yellow" | "orange" | "green" | "red"> =
  {
    INGRESADO: "gray",
    EN_DIAGNOSTICO: "blue",
    ESPERANDO_APROBACION: "yellow",
    EN_REPARACION: "orange",
    LISTO_ENTREGA: "green",
    SIN_SOLUCION: "red",
    ENTREGADO: "gray",
  }

export default function StatusBadge({
  status,
  label,
}: {
  status: OrderStatus
  label: string
}) {
  return <Badge variant={variants[status] ?? "gray"}>{label}</Badge>
}
