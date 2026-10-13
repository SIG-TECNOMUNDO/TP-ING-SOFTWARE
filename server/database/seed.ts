import bcrypt from "bcryptjs"
import type { PoolClient } from "pg"
import { pool } from "./pool.js"

type IdRow = { id: string }

async function upsertId(client: PoolClient, sql: string, values: unknown[]) {
  const result = await client.query<IdRow>(sql, values)
  const row = result.rows[0]
  if (!row) throw new Error("No se pudo crear el dato inicial")
  return row.id
}

const client = await pool.connect()

try {
  await client.query("BEGIN")
  await client.query(`
    INSERT INTO roles (code, name) VALUES
      ('ADMIN', 'Administrador'), ('SALES', 'Ventas'), ('TECH', 'Técnico')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
  `)
  await client.query(`
    INSERT INTO categories (name) VALUES ('Equipos'), ('Repuestos'), ('Accesorios'), ('Audio')
    ON CONFLICT (name) DO NOTHING
  `)

  const yofre = await upsertId(
    client,
    `INSERT INTO branches (name, address) VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET address = EXCLUDED.address RETURNING id`,
    ["Yofre Norte", "Córdoba, Argentina"],
  )
  const alta = await upsertId(
    client,
    `INSERT INTO branches (name, address) VALUES ($1, $2)
     ON CONFLICT (name) DO UPDATE SET address = EXCLUDED.address RETURNING id`,
    ["Alta Córdoba", "Córdoba, Argentina"],
  )

  const roleRows = await client.query<{
    id: number
    code: string
  }>("SELECT id, code FROM roles")
  const roleIds = Object.fromEntries(
    roleRows.rows.map((role) => [role.code, role.id]),
  )
  const passwordHash = await bcrypt.hash("admin", 12)

  const users = [
    ["Administrador Principal", "admin@tecnomundo.com", "ADMIN", null],
    ["Ventas Yofre", "ventas.yofre@tecnomundo.com", "SALES", yofre],
    ["Técnico Alta Cba", "tec.altacba@tecnomundo.com", "TECH", alta],
    ["Ventas Alta Cba", "ventas.altacba@tecnomundo.com", "SALES", alta],
  ] as const
  for (const [name, email, role, branchId] of users) {
    await client.query(
      `INSERT INTO users (name, email, password_hash, role_id, branch_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role_id = EXCLUDED.role_id,
         branch_id = EXCLUDED.branch_id, active = true`,
      [name, email, passwordHash, roleIds[role], branchId],
    )
  }

  const products = [
    ["PRD-001", "Módulo Display iPhone 13 Pro", "Repuestos", 125000, 3, 3, 2],
    ["PRD-002", "Samsung Galaxy S23 Ultra 256GB", "Equipos", 1450000, 1, 1, 1],
    [
      "PRD-003",
      "Funda Silicona MagSafe iPhone 14",
      "Accesorios",
      15000,
      5,
      12,
      8,
    ],
    ["PRD-004", "Batería Original Motorola G22", "Repuestos", 35000, 3, 0, 2],
    ["PRD-005", "Auriculares JBL Tune 510BT", "Audio", 45000, 4, 5, 6],
    ["PRD-006", "Cargador Samsung 25W Tipo C", "Accesorios", 22000, 10, 15, 10],
  ] as const
  for (const [
    code,
    name,
    category,
    price,
    minStock,
    stockYofre,
    stockAlta,
  ] of products) {
    const productResult = await client.query<IdRow>(
      `INSERT INTO products (code, name, category_id, sale_price, min_stock)
       SELECT $1, $2, id, $3, $4 FROM categories WHERE name = $5
       ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, sale_price = EXCLUDED.sale_price,
         min_stock = EXCLUDED.min_stock RETURNING id`,
      [code, name, price, minStock, category],
    )
    const productId = productResult.rows[0]?.id
    for (const [branchId, quantity] of [
      [yofre, stockYofre],
      [alta, stockAlta],
    ] as const) {
      await client.query(
        `INSERT INTO branch_stock (branch_id, product_id, quantity) VALUES ($1, $2, $3)
         ON CONFLICT (branch_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
        [branchId, productId, quantity],
      )
    }
  }

  const clients = [
    ["Martín Pérez", "32456789", "351-555-4321", "martin.p@email.com"],
    ["Laura Gómez", "28123456", "351-444-9876", "laurag@email.com"],
    ["Carlos Ruiz", "40987654", "351-777-1122", null],
    ["Ana Martínez", "35654321", "351-222-3344", "ana.m@email.com"],
  ]
  for (const item of clients) {
    await client.query(
      `INSERT INTO clients (name, dni, phone, email) VALUES ($1, $2, $3, $4)
       ON CONFLICT (dni) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email`,
      item,
    )
  }

  const adminResult = await client.query<IdRow>(
    `SELECT id FROM users WHERE email = 'admin@tecnomundo.com'`,
  )
  const martinResult = await client.query<IdRow>(
    `SELECT id FROM clients WHERE dni = '32456789'`,
  )
  const lauraResult = await client.query<IdRow>(
    `SELECT id FROM clients WHERE dni = '28123456'`,
  )
  const sampleOrders = [
    [
      alta,
      martinResult.rows[0]?.id,
      "Celular",
      "Samsung",
      "S22 Ultra",
      "Módulo astillado por caída",
      "EN_REPARACION",
    ],
    [
      yofre,
      lauraResult.rows[0]?.id,
      "Celular",
      "Apple",
      "iPhone 13 Pro",
      "No carga correctamente",
      "LISTO_ENTREGA",
    ],
  ] as const
  for (const [
    branchId,
    clientId,
    deviceType,
    brand,
    model,
    issue,
    status,
  ] of sampleOrders) {
    const exists = await client.query(
      `SELECT 1 FROM service_orders WHERE client_id=$1 AND brand=$2 AND model=$3`,
      [clientId, brand, model],
    )
    if (!exists.rowCount) {
      const created = await client.query<IdRow>(
        `INSERT INTO service_orders (branch_id,client_id,created_by,device_type,brand,model,reported_issue,status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
        [
          branchId,
          clientId,
          adminResult.rows[0]?.id,
          deviceType,
          brand,
          model,
          issue,
          status,
        ],
      )
      await client.query(
        `INSERT INTO service_order_status_history (service_order_id,user_id,to_status,note) VALUES ($1,$2,$3,$4)`,
        [
          created.rows[0]?.id,
          adminResult.rows[0]?.id,
          status,
          "Dato inicial de demostración",
        ],
      )
    }
  }

  await client.query("COMMIT")
  console.log("Datos iniciales creados. Usuario: admin@tecnomundo.com / admin")
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  client.release()
  await pool.end()
}
