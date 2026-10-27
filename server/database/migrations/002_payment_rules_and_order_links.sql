CREATE TABLE IF NOT EXISTS payment_settings (
  branch_id uuid PRIMARY KEY REFERENCES branches(id) ON DELETE CASCADE,
  cash_discount numeric(5,2) NOT NULL DEFAULT 0 CHECK (cash_discount BETWEEN 0 AND 100),
  debit_surcharge numeric(5,2) NOT NULL DEFAULT 0 CHECK (debit_surcharge BETWEEN 0 AND 100),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_card_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  brand varchar(50) NOT NULL DEFAULT 'Todas las tarjetas',
  card_type varchar(30) NOT NULL,
  installments integer NOT NULL DEFAULT 1 CHECK (installments BETWEEN 1 AND 24),
  surcharge numeric(5,2) NOT NULL DEFAULT 0 CHECK (surcharge BETWEEN 0 AND 100),
  UNIQUE(branch_id, brand, card_type, installments)
);

CREATE TABLE IF NOT EXISTS payment_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  card_brand varchar(50) NOT NULL,
  installments integer NOT NULL DEFAULT 1 CHECK (installments BETWEEN 1 AND 24),
  discount numeric(5,2) NOT NULL CHECK (discount BETWEEN 0 AND 100),
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS payment_wallet_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  wallet varchar(60) NOT NULL,
  adjustment_type varchar(20) NOT NULL CHECK (adjustment_type IN ('NONE','DISCOUNT','SURCHARGE')),
  adjustment numeric(5,2) NOT NULL DEFAULT 0 CHECK (adjustment BETWEEN 0 AND 100),
  UNIQUE(branch_id, wallet)
);

ALTER TABLE sales ADD COLUMN IF NOT EXISTS card_brand varchar(50);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS card_type varchar(30);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS wallet varchar(60);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS channel varchar(30) NOT NULL DEFAULT 'STORE';
ALTER TABLE sales ADD COLUMN IF NOT EXISTS marketplace_operation varchar(80);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS marketplace_buyer varchar(100);
ALTER TABLE sales ADD COLUMN IF NOT EXISTS marketplace_shipping varchar(30);
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS linked_order_id uuid REFERENCES service_orders(id);
CREATE INDEX IF NOT EXISTS idx_service_orders_linked_order ON service_orders(linked_order_id);
