-- IMEI por ítem vendido (obligatorio para equipos, validado en la API)
ALTER TABLE sale_items ADD COLUMN IF NOT EXISTS imei varchar(20);
CREATE INDEX IF NOT EXISTS idx_sale_items_imei ON sale_items (imei) WHERE imei IS NOT NULL;

-- Precio de costo: solo visible y editable por el Administrador
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price numeric(14,2) CHECK (cost_price IS NULL OR cost_price >= 0);
