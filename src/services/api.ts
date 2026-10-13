export const API_URL = import.meta.env.VITE_API_URL ?? "/api"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  })
  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => ({ message: "No se pudo completar la operación" }))
    throw new ApiError(
      response.status,
      body.message ?? "No se pudo completar la operación",
    )
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function queryString(values: Record<string, string | null | undefined>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(values))
    if (value) params.set(key, value)
  const result = params.toString()
  return result ? `?${result}` : ""
}

export const money = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value)
export const shortDate = (value: string | null) =>
  value ? new Intl.DateTimeFormat("es-AR").format(new Date(value)) : "—"
export const dateTime = (value: string) =>
  new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
