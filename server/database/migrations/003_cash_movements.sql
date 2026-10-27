CREATE TABLE IF NOT EXISTS cash_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES branches(id),
  source varchar(20) NOT NULL CHECK (source IN ('VENTAS', 'SAT', 'MANUAL')),
  type varchar(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  concept varchar(240) NOT NULL,
  payment_method varchar(60) NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  reference_type varchar(40),
  reference_id uuid,
  note text
);

CREATE INDEX IF NOT EXISTS idx_cash_movements_history
  ON cash_movements (branch_id, occurred_at DESC);
