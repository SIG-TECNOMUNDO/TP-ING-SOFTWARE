CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  address varchar(200),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id serial PRIMARY KEY,
  code varchar(30) NOT NULL UNIQUE,
  name varchar(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  email varchar(160) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role_id integer NOT NULL REFERENCES roles(id),
  branch_id uuid REFERENCES branches(id),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(140) NOT NULL,
  dni varchar(20) UNIQUE,
  phone varchar(40) NOT NULL,
  email varchar(160),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  name varchar(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  name varchar(180) NOT NULL,
  category_id integer NOT NULL REFERENCES categories(id),
  sale_price numeric(14,2) NOT NULL CHECK (sale_price >= 0),
  min_stock integer NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS branch_stock (
  branch_id uuid NOT NULL REFERENCES branches(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  PRIMARY KEY (branch_id, product_id)
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES branches(id),
  product_id uuid NOT NULL REFERENCES products(id),
  user_id uuid NOT NULL REFERENCES users(id),
  type varchar(30) NOT NULL CHECK (type IN ('ENTRY','SALE','SERVICE','ADJUSTMENT','TRANSFER_IN','TRANSFER_OUT')),
  quantity integer NOT NULL CHECK (quantity <> 0),
  reference_type varchar(40),
  reference_id uuid,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number bigserial UNIQUE,
  branch_id uuid NOT NULL REFERENCES branches(id),
  client_id uuid REFERENCES clients(id),
  user_id uuid NOT NULL REFERENCES users(id),
  payment_method varchar(30) NOT NULL,
  subtotal numeric(14,2) NOT NULL,
  discount numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  subtotal numeric(14,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id),
  service_order_id uuid,
  method varchar(30) NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount >= 0),
  installments integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number bigserial UNIQUE,
  branch_id uuid NOT NULL REFERENCES branches(id),
  client_id uuid NOT NULL REFERENCES clients(id),
  created_by uuid NOT NULL REFERENCES users(id),
  device_type varchar(60) NOT NULL,
  brand varchar(80) NOT NULL,
  model varchar(100) NOT NULL,
  serial_imei varchar(100),
  reported_issue text NOT NULL,
  physical_condition text,
  accessories text,
  diagnosis text,
  labor_cost numeric(14,2) NOT NULL DEFAULT 0,
  budget_status varchar(30) NOT NULL DEFAULT 'PENDING',
  status varchar(40) NOT NULL DEFAULT 'INGRESADO',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS payments_service_order_id_fkey;
ALTER TABLE payments
  ADD CONSTRAINT payments_service_order_id_fkey
  FOREIGN KEY (service_order_id) REFERENCES service_orders(id);

CREATE TABLE IF NOT EXISTS service_order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  from_status varchar(40),
  to_status varchar(40) NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_order_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid NOT NULL REFERENCES service_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_service_order_parts_unique
  ON service_order_parts (service_order_id, product_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  action varchar(80) NOT NULL,
  entity_type varchar(80) NOT NULL,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products (lower(name));
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients (lower(name));
CREATE INDEX IF NOT EXISTS idx_orders_branch_status ON service_orders (branch_id, status);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements (product_id, created_at DESC);
