export const WARRANTY_DAYS = 90

export function normalizeImei(value: string | null | undefined) {
  return (value ?? "").replace(/\s|-/g, "")
}

/** Un IMEI válido tiene exactamente 15 dígitos. */
export function isValidImei(value: string | null | undefined) {
  return /^\d{15}$/.test(normalizeImei(value))
}

/** Devuelve el primer problema de una lista de IMEI, o null si está bien. */
export function imeiListError(imeis: string[]) {
  const seen = new Set<string>()
  for (const raw of imeis) {
    const imei = normalizeImei(raw)
    if (!isValidImei(imei))
      return `El IMEI "${raw}" no es válido: debe tener 15 dígitos`
    if (seen.has(imei)) return `El IMEI ${imei} está repetido`
    seen.add(imei)
  }
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
