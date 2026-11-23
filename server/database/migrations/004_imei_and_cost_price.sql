-- Precio de costo: solo visible y editable por el Administrador (riesgo R6)
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price numeric(14,2) CHECK (cost_price IS NULL OR cost_price >= 0);

-- Celulares: el producto controla stock por IMEI (una fila por unidad física)
ALTER TABLE products ADD COLUMN IF NOT EXISTS tracks_imei boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS device_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  branch_id uuid NOT NULL REFERENCES branches(id),
  imei varchar(15) NOT NULL UNIQUE CHECK (imei ~ '^[0-9]{15}$'),
  status varchar(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','SOLD')),
  sale_id uuid REFERENCES sales(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  sold_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_device_units_product ON device_units (product_id, branch_id, status);

-- IMEI de cada celular vendido (riesgo R4 y validación de garantía)
ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS imei varchar(15);
CREATE INDEX IF NOT EXISTS idx_sale_items_imei ON sale_items (imei) WHERE imei IS NOT NULL;
