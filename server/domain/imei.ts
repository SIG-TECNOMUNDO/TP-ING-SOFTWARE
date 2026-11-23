export const WARRANTY_DAYS = 90

export function normalizeImei(value: string | null | undefined) {
  return (value ?? "").replace(/\s|-/g, "")
}

/** Un IMEI válido tiene exactamente 15 dígitos. */
export function isValidImei(value: string | null | undefined) {
  return /^\d{15}$/.test(normalizeImei(value))
}

/** Describe los IMEI inválidos o repetidos de una lista, o null si está bien. */
export function imeiListError(imeis: string[]) {
  const normalized = imeis.map(normalizeImei)
  const invalid = normalized.filter((imei) => !isValidImei(imei))
  if (invalid.length === 1)
    return `El IMEI ${invalid[0]} no es válido: debe tener 15 dígitos`
  if (invalid.length > 1)
    return `Hay ${invalid.length} IMEI no válidos (deben tener 15 dígitos): ${invalid.join(", ")}`
  const repeated = [
    ...new Set(normalized.filter((imei, index) => normalized.indexOf(imei) !== index)),
  ]
  if (repeated.length === 1) return `El IMEI ${repeated[0]} está repetido`
  if (repeated.length > 1)
    return `Hay ${repeated.length} IMEI repetidos: ${repeated.join(", ")}`
  return null
}

export function warrantyStatus(
  saleDate: Date,
  now: Date = new Date(),
  days: number = WARRANTY_DAYS,
) {
  const expiresAt = new Date(saleDate.getTime() + days * 24 * 60 * 60 * 1000)
  return { expiresAt, active: now.getTime() <= expiresAt.getTime() }
}
