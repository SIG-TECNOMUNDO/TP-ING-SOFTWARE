// Registro de equipos vendidos con su IMEI, usado para validar garantías.
// En la demo (sin backend) se guarda en el navegador; con la API real
// la consulta equivalente es GET /api/sales/warranty/:imei.

export const WARRANTY_DAYS = 90

export interface SoldDevice {
  imei: string
  productName: string
  saleId: string
  soldAt: string // fecha ISO
  branch: string
  client: string
  seller: string
}

const STORAGE_KEY = "sig_tecnomundo_sold_devices"

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

// Ventas de ejemplo para mostrar una garantía vigente y una vencida
const DEMO_DEVICES: SoldDevice[] = [
  {
    imei: "356938035643809",
    productName: "Samsung Galaxy S23 Ultra 256GB",
    saleId: "VTA-84750",
    soldAt: daysAgo(25),
    branch: "Sucursal Yofre Norte",
    client: "Martín Pérez (DNI 32456789)",
    seller: "Ventas Yofre",
  },
  {
    imei: "490154203237518",
    productName: "Motorola Moto G54 128GB",
    saleId: "VTA-83102",
    soldAt: daysAgo(130),
    branch: "Sucursal Alta Córdoba",
    client: "Laura Gómez (DNI 28123456)",
    seller: "Ventas Alta Cba",
  },
]

export function normalizeImei(value: string) {
  return value.replace(/\s|-/g, "")
}

/** Un IMEI válido tiene exactamente 15 dígitos. */
export function isValidImei(value: string) {
  return /^\d{15}$/.test(normalizeImei(value))
}

function load(): SoldDevice[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as SoldDevice[]
  } catch {
    // sin almacenamiento: se usan solo los datos de ejemplo
  }
  return DEMO_DEVICES
}

export function registerSoldDevices(devices: SoldDevice[]) {
  const next = [...devices, ...load()]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignorar errores de almacenamiento
  }
}

export function findSoldDevice(imei: string) {
  const target = normalizeImei(imei)
  return load().find((device) => device.imei === target) ?? null
}

export function isImeiAlreadySold(imei: string) {
  return findSoldDevice(imei) !== null
}

export function warrantyInfo(device: SoldDevice, now = new Date()) {
  const expiresAt = new Date(
    new Date(device.soldAt).getTime() + WARRANTY_DAYS * 24 * 60 * 60 * 1000,
  )
  const daysLeft = Math.ceil(
    (expiresAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
  )
  return { expiresAt, active: daysLeft >= 0, daysLeft }
}
