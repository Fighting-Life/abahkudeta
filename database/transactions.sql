-- =============================================
-- TRANSACTION SYSTEM FOR SUPABASE
-- Deposit & Withdrawal Management
-- =============================================

-- 1. CREATE ENUM TYPES
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdraw');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'rejected');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'e_wallet', 'crypto', 'credit_card');

-- 2. CREATE TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Transaction Details
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  status transaction_status NOT NULL DEFAULT 'pending',

  -- Payment Information
  payment_method payment_method NOT NULL,
  payment_account_number TEXT,
  payment_account_name TEXT,
  payment_provider TEXT, -- e.g., "BCA", "Mandiri", "OVO", "DANA"

  -- Bank/E-Wallet Details (from user profile)
  user_account_number TEXT NOT NULL,
  user_account_name TEXT NOT NULL,

  -- Transaction Metadata
  reference_number TEXT UNIQUE, -- Auto-generated unique ref
  notes TEXT,
  admin_notes TEXT, -- Notes dari admin saat approve/reject

  -- Proof of Payment (for deposits)
  proof_image_url TEXT,

  -- Processing Information
  processed_by UUID REFERENCES auth.users(id), -- Admin yang process
  processed_at TIMESTAMP WITH TIME ZONE,

  -- Balance Before/After (for tracking)
  balance_before DECIMAL(15, 2),
  balance_after DECIMAL(15, 2),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Indexes for better query performance
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_processed_status CHECK (
    (status IN ('completed', 'rejected') AND processed_by IS NOT NULL AND processed_at IS NOT NULL) OR
    (status NOT IN ('completed', 'rejected'))
  )
);

-- 3. CREATE INDEXES
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_reference ON public.transactions(reference_number);
CREATE INDEX idx_transactions_user_status ON public.transactions(user_id, status);

-- 4. CREATE FUNCTION TO GENERATE REFERENCE NUMBER
CREATE OR REPLACE FUNCTION generate_transaction_reference()
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  timestamp_part TEXT;
  random_part TEXT;
  ref_number TEXT;
BEGIN
  -- Get transaction type prefix from TG_ARGV
  prefix := CASE
    WHEN NEW.transaction_type = 'deposit' THEN 'DEP'
    WHEN NEW.transaction_type = 'withdraw' THEN 'WD'
    ELSE 'TRX'
  END;

  -- Generate timestamp part (YYYYMMDDHHMMSS)
  timestamp_part := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');

  -- Generate random 4-digit number
  random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

  -- Combine: DEP20250115123045-1234
  ref_number := prefix || timestamp_part || '-' || random_part;

  RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- 5. CREATE TRIGGER FOR AUTO REFERENCE NUMBER
CREATE OR REPLACE FUNCTION set_transaction_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_transaction_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_transaction_reference
  BEFORE INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_transaction_reference();

-- 6. CREATE TRIGGER FOR AUTO UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();

  -- Set completed_at when status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at := NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_transaction_timestamp
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_timestamp();

-- 7. CREATE FUNCTION TO UPDATE USER BALANCE
CREATE OR REPLACE FUNCTION update_user_balance_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
  current_balance DECIMAL(15, 2);
  new_balance DECIMAL(15, 2);
BEGIN
  -- Only process when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN

    -- Get current balance
    SELECT balance::DECIMAL INTO current_balance
    FROM public.profiles
    WHERE id = NEW.user_id;

    -- Store balance before transaction
    NEW.balance_before := current_balance;

    -- Calculate new balance
    IF NEW.transaction_type = 'deposit' THEN
      new_balance := current_balance + NEW.amount;
    ELSIF NEW.transaction_type = 'withdraw' THEN
      -- Check if user has sufficient balance
      IF current_balance < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient balance for withdrawal';
      END IF;
      new_balance := current_balance - NEW.amount;
    ELSE
      RAISE EXCEPTION 'Invalid transaction type';
    END IF;

    -- Store balance after transaction
    NEW.balance_after := new_balance;

    -- Update user balance
    UPDATE public.profiles
    SET balance = new_balance::TEXT,
        updated_at = NOW()
    WHERE id = NEW.user_id;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_user_balance
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance_on_transaction();

-- 8. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own transactions (deposit/withdraw requests)
CREATE POLICY "Users can create own transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending transactions (cancel, add proof)
CREATE POLICY "Users can update own pending transactions"
  ON public.transactions
  FOR UPDATE
  USING (
    auth.uid() = user_id AND
    status = 'pending'
  )
  WITH CHECK (
    auth.uid() = user_id AND
    status IN ('pending', 'cancelled')
  );

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
  ON public.transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any transaction (approve, reject, process)
CREATE POLICY "Admins can update any transaction"
  ON public.transactions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete transactions (if needed)
CREATE POLICY "Admins can delete transactions"
  ON public.transactions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. CREATE VIEW FOR TRANSACTION HISTORY (with user info)
CREATE OR REPLACE VIEW transaction_history AS
SELECT
  t.*,
  p.username,
  p.full_name,
  p.phone,
  p.whatsapp,
  admin.username AS processed_by_username,
  admin.full_name AS processed_by_name
FROM public.transactions t
LEFT JOIN public.profiles p ON t.user_id = p.id
LEFT JOIN public.profiles admin ON t.processed_by = admin.id;

-- Grant access to view
GRANT SELECT ON transaction_history TO authenticated;

-- 11. CREATE FUNCTION TO GET USER TRANSACTION STATS
CREATE OR REPLACE FUNCTION get_user_transaction_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_deposits', COALESCE(SUM(CASE WHEN transaction_type = 'deposit' AND status = 'completed' THEN amount ELSE 0 END), 0),
    'total_withdrawals', COALESCE(SUM(CASE WHEN transaction_type = 'withdraw' AND status = 'completed' THEN amount ELSE 0 END), 0),
    'pending_deposits', COALESCE(SUM(CASE WHEN transaction_type = 'deposit' AND status = 'pending' THEN amount ELSE 0 END), 0),
    'pending_withdrawals', COALESCE(SUM(CASE WHEN transaction_type = 'withdraw' AND status = 'pending' THEN amount ELSE 0 END), 0),
    'total_transactions', COUNT(*),
    'completed_transactions', COUNT(*) FILTER (WHERE status = 'completed')
  ) INTO result
  FROM public.transactions
  WHERE user_id = p_user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. CREATE SAMPLE DATA (Optional - for testing)
-- Run this only in development

-- Insert sample deposit
-- INSERT INTO public.transactions (
--   user_id,
--   transaction_type,
--   amount,
--   payment_method,
--   payment_provider,
--   user_account_number,
--   user_account_name,
--   notes
-- ) VALUES (
--   'your-user-id-here',
--   'deposit',
--   100000.00,
--   'bank_transfer',
--   'BCA',
--   '1234567890',
--   'John Doe',
--   'First deposit'
-- );

-- 13. VERIFY INSTALLATION
-- Check if everything is created successfully
DO $$
BEGIN
  RAISE NOTICE 'Checking installation...';

  -- Check table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
    RAISE NOTICE '✓ Table "transactions" created';
  END IF;

  -- Check indexes
  IF EXISTS (SELECT FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'transactions') THEN
    RAISE NOTICE '✓ Indexes created';
  END IF;

  -- Check triggers
  IF EXISTS (SELECT FROM pg_trigger WHERE tgname LIKE '%transaction%') THEN
    RAISE NOTICE '✓ Triggers created';
  END IF;

  -- Check RLS
  IF (SELECT relrowsecurity FROM pg_class WHERE relname = 'transactions') THEN
    RAISE NOTICE '✓ Row Level Security enabled';
  END IF;

  -- Check policies
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'transactions') THEN
    RAISE NOTICE '✓ RLS Policies created';
  END IF;

  RAISE NOTICE 'Installation complete! 🎉';
END $$;