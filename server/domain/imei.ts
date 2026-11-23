export const WARRANTY_DAYS = 90

/** Categorías de producto que son equipos y exigen IMEI al venderse. */
const IMEI_CATEGORIES = ["equipos", "celulares"]

export function requiresImei(category: string) {
  return IMEI_CATEGORIES.includes(category.trim().toLowerCase())
}

export function normalizeImei(value: string | null | undefined) {
  return (value ?? "").replace(/\s|-/g, "")
}

/** Un IMEI válido tiene exactamente 15 dígitos. */
export function isValidImei(value: string | null | undefined) {
  return /^\d{15}$/.test(normalizeImei(value))
}

export function warrantyStatus(
  saleDate: Date,
  now: Date = new Date(),
  days: number = WARRANTY_DAYS,
) {
  const expiresAt = new Date(saleDate.getTime() + days * 24 * 60 * 60 * 1000)
  return { expiresAt, active: now.getTime() <= expiresAt.getTime() }
}
