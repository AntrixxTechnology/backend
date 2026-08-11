-- Antrixx ERP Schema Migration

-- 1. ERP Clients Table
CREATE TABLE IF NOT EXISTS erp_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ERP Transactions (Income/Expenses)
CREATE TABLE IF NOT EXISTS erp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL CHECK (type IN ('Income', 'Expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  client_id UUID REFERENCES erp_clients(id) ON DELETE SET NULL,
  reference_number TEXT,
  status TEXT DEFAULT 'Completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ERP Invoices
CREATE TABLE IF NOT EXISTS erp_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  client_id UUID REFERENCES erp_clients(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  total_amount NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
  items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_erp_clients') THEN
    CREATE TRIGGER set_updated_at_erp_clients BEFORE UPDATE ON erp_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_erp_transactions') THEN
    CREATE TRIGGER set_updated_at_erp_transactions BEFORE UPDATE ON erp_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_erp_invoices') THEN
    CREATE TRIGGER set_updated_at_erp_invoices BEFORE UPDATE ON erp_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
