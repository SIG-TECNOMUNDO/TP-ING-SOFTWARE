// Stock de celulares por IMEI: cada unidad física es un IMEI en una sucursal.
// En la demo (sin backend) se guarda en el navegador y lo comparten
// Inventario y Ventas. Con la API real es la tabla device_units.

export interface PhoneUnit {
  imei: string
  branchId: string
  status: "AVAILABLE" | "SOLD"
}

export interface PhoneProduct {
  id: string
  name: string
  category: string
  price: number
  costPrice?: number
  minStock: number
  units: PhoneUnit[]
}

export const BRANCH_YOFRE = "suc-yofre"
export const BRANCH_ALTA = "suc-altacba"

const STORAGE_KEY = "sig_tecnomundo_phone_stock"

const unit = (imei: string, branchId: string): PhoneUnit => ({
  imei,
  branchId,
  status: "AVAILABLE",
})

const DEMO_PHONES: PhoneProduct[] = [
  {
    id: "CEL-001",
    name: "Samsung Galaxy S23 Ultra 256GB",
    category: "Equipos",
    price: 1450000,
    costPrice: 1050000,
    minStock: 1,
    units: [
      unit("352099001761481", BRANCH_YOFRE),
      unit("352099001761499", BRANCH_ALTA),
    ],
  },
  {
    id: "CEL-002",
    name: "Motorola Moto G54 128GB",
    category: "Equipos",
    price: 420000,
    costPrice: 290000,
    minStock: 1,
    units: [
      unit("359881234567011", BRANCH_YOFRE),
      unit("359881234567029", BRANCH_YOFRE),
      unit("359881234567037", BRANCH_ALTA),
    ],
  },
]

export function loadPhones(): PhoneProduct[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved) as PhoneProduct[]
  } catch {
    // sin almacenamiento: se usan los datos de ejemplo
  }
  return DEMO_PHONES
}

export function savePhones(phones: PhoneProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(phones))
  } catch {
    // ignorar errores de almacenamiento
  }
}

/** Unidades disponibles de un celular; sin sucursal ("") devuelve todas. */
export function availableUnits(product: PhoneProduct, branchId: string) {
  return product.units.filter(
    (u) => u.status === "AVAILABLE" && (!branchId || u.branchId === branchId),
  )
}

export function markUnitsSold(imeis: string[]) {
  const sold = new Set(imeis)
  savePhones(
    loadPhones().map((product) => ({
      ...product,
      units: product.units.map((u) =>
        sold.has(u.imei) ? { ...u, status: "SOLD" as const } : u,
      ),
    })),
  )
}
