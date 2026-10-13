export const orderStatuses = [
  "INGRESADO",
  "EN_DIAGNOSTICO",
  "ESPERANDO_APROBACION",
  "EN_REPARACION",
  "LISTO_ENTREGA",
  "SIN_SOLUCION",
  "ENTREGADO",
] as const

export type OrderStatus = typeof orderStatuses[number]

export const statusLabels: Record<OrderStatus, string> = {
  INGRESADO: "Ingresado",
  EN_DIAGNOSTICO: "En Diagnóstico",
  ESPERANDO_APROBACION: "Esperando Aprobación",
  EN_REPARACION: "En Reparación",
  LISTO_ENTREGA: "Listo para Entrega",
  SIN_SOLUCION: "Sin Solución",
  ENTREGADO: "Entregado",
}

const transitions: Record<OrderStatus, OrderStatus[]> = {
  INGRESADO: ["EN_DIAGNOSTICO", "SIN_SOLUCION"],
  EN_DIAGNOSTICO: ["ESPERANDO_APROBACION", "EN_REPARACION", "SIN_SOLUCION"],
  ESPERANDO_APROBACION: ["EN_REPARACION", "SIN_SOLUCION"],
  EN_REPARACION: ["LISTO_ENTREGA", "SIN_SOLUCION"],
  LISTO_ENTREGA: ["ENTREGADO", "EN_REPARACION"],
  SIN_SOLUCION: ["ENTREGADO", "EN_DIAGNOSTICO"],
  ENTREGADO: [],
}

export function canTransition(from: OrderStatus, to: OrderStatus) {
  return from === to || transitions[from].includes(to)
}
