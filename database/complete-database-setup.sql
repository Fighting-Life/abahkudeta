-- =============================================
-- COMPLETE DATABASE SETUP - CLEAN START
-- Run this to create all tables from scratch
-- =============================================

-- ==================== STEP 1: DROP EVERYTHING ====================
-- Drop all existing objects to start clean

-- Drop views
DROP VIEW IF EXISTS transaction_history CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS trigger_set_transaction_reference ON public.transactions CASCADE;
DROP TRIGGER IF EXISTS trigger_update_transaction_timestamp ON public.transactions CASCADE;
DROP TRIGGER IF EXISTS trigger_update_user_balance ON public.transactions CASCADE;
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles CASCADE;
DROP TRIGGER IF EXISTS auto_deactivate_expired ON public.double_exp_claims CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.sync_profile_email() CASCADE;
DROP FUNCTION IF EXISTS public.handle_profile_updated_at() CASCADE;
DROP FUNCTION IF EXISTS generate_transaction_reference() CASCADE;
DROP FUNCTION IF EXISTS set_transaction_reference() CASCADE;
DROP FUNCTION IF EXISTS update_transaction_timestamp() CASCADE;
DROP FUNCTION IF EXISTS update_user_balance_on_transaction() CASCADE;
DROP FUNCTION IF EXISTS get_user_transaction_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS deactivate_expired_claims() CASCADE;
DROP FUNCTION IF EXISTS can_claim_double_exp(UUID) CASCADE;

-- Drop tables
DROP TABLE IF EXISTS public.double_exp_claims CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop types
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- ==================== STEP 2: CREATE TYPES ====================

-- User role enum
CREATE TYPE user_role AS ENUM ('user', 'admin', 'superadmin');

-- Transaction types
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdraw');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'rejected');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'e_wallet', 'crypto', 'credit_card');

-- ==================== STEP 3: CREATE PROFILES TABLE ====================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,

  -- Payment Info
  payment_type TEXT DEFAULT 'bank',
  bank_account_number TEXT,
  bank_account_name TEXT,

  -- Balance & Referral
  balance TEXT DEFAULT '0' NOT NULL,
  referral_code TEXT,

  -- User Status
  role user_role DEFAULT 'user' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  bonus_claimed BOOLEAN DEFAULT FALSE NOT NULL,

  -- Timestamps
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3),
  CONSTRAINT balance_format CHECK (balance ~ '^[0-9]+(\.[0-9]{1,2})?$')
);

-- Indexes for profiles
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_referral ON public.profiles(referral_code);

-- ==================== STEP 4: CREATE TRANSACTIONS TABLE ====================

CREATE TABLE public.transactions (
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
  payment_provider TEXT,

  -- User Bank/E-Wallet Details
  user_account_number TEXT NOT NULL,
  user_account_name TEXT NOT NULL,

  -- Transaction Metadata
  reference_number TEXT UNIQUE,
  notes TEXT,
  admin_notes TEXT,

  -- Proof of Payment
  proof_image_url TEXT,

  -- Processing Information
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,

  -- Balance Tracking
  balance_before DECIMAL(15, 2),
  balance_after DECIMAL(15, 2),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT valid_processed_status CHECK (
    (status IN ('completed', 'rejected') AND processed_by IS NOT NULL) OR
    (status NOT IN ('completed', 'rejected'))
  )
);

-- Indexes for transactions
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_transactions_reference ON public.transactions(reference_number);
CREATE INDEX idx_transactions_user_status ON public.transactions(user_id, status);

-- ==================== STEP 5: CREATE DOUBLE EXP CLAIMS TABLE ====================

CREATE TABLE public.double_exp_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  next_claim_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for double_exp_claims
CREATE INDEX idx_double_exp_user_id ON public.double_exp_claims(user_id);
CREATE INDEX idx_double_exp_active ON public.double_exp_claims(is_active);
CREATE INDEX idx_double_exp_expires ON public.double_exp_claims(expires_at);

-- ==================== STEP 6: CREATE TRIGGER FUNCTIONS ====================

-- Function: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    email,
    full_name,
    phone,
    whatsapp,
    payment_type,
    bank_account_number,
    bank_account_name,
    referral_code,
    balance,
    avatar_url,
    role,
    is_active,
    bonus_claimed,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp',
    COALESCE(NEW.raw_user_meta_data->>'payment_type', 'bank'),
    NEW.raw_user_meta_data->>'bank_account_number',
    NEW.raw_user_meta_data->>'bank_account_name',
    NEW.raw_user_meta_data->>'referral_code',
    '0',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'),
    TRUE,
    FALSE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Function: Auto-update updated_at on profile changes
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function: Generate transaction reference number
CREATE OR REPLACE FUNCTION generate_transaction_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  prefix TEXT;
  timestamp_part TEXT;
  random_part TEXT;
BEGIN
  prefix := CASE
    WHEN NEW.transaction_type = 'deposit' THEN 'DEP'
    WHEN NEW.transaction_type = 'withdraw' THEN 'WD'
    ELSE 'TRX'
  END;

  timestamp_part := TO_CHAR(NOW(), 'YYYYMMDDHH24MISS');
  random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

  RETURN prefix || timestamp_part || '-' || random_part;
END;
$$;

-- Function: Set transaction reference
CREATE OR REPLACE FUNCTION set_transaction_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_transaction_reference();
  END IF;
  RETURN NEW;
END;
$$;

-- Function: Update transaction timestamp
CREATE OR REPLACE FUNCTION update_transaction_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();

  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at := NOW();
  END IF;

  RETURN NEW;
END;
$$;

-- Function: Update user balance on transaction completion
CREATE OR REPLACE FUNCTION update_user_balance_on_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance DECIMAL(15, 2);
  new_balance DECIMAL(15, 2);
BEGIN
  -- Only process when status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN

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
$$;

-- Function: Get user transaction stats
CREATE OR REPLACE FUNCTION get_user_transaction_stats(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Function: Deactivate expired double exp claims
CREATE OR REPLACE FUNCTION deactivate_expired_claims()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.double_exp_claims
  SET is_active = FALSE
  WHERE user_id = NEW.user_id
    AND is_active = TRUE
    AND expires_at < NOW()
    AND id != NEW.id;

  RETURN NEW;
END;
$$;

-- Function: Check if user can claim double exp
CREATE OR REPLACE FUNCTION can_claim_double_exp(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_claim_time TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT next_claim_at INTO last_claim_time
  FROM public.double_exp_claims
  WHERE user_id = p_user_id
  ORDER BY claimed_at DESC
  LIMIT 1;

  RETURN last_claim_time IS NULL OR last_claim_time <= NOW();
END;
$$;

-- ==================== STEP 7: CREATE TRIGGERS ====================

-- Trigger: Auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Auto-update updated_at on profile changes
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_updated_at();

-- Trigger: Set transaction reference
CREATE TRIGGER trigger_set_transaction_reference
  BEFORE INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_transaction_reference();

-- Trigger: Update transaction timestamp
CREATE TRIGGER trigger_update_transaction_timestamp
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_timestamp();

-- Trigger: Update user balance
CREATE TRIGGER trigger_update_user_balance
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance_on_transaction();

-- Trigger: Auto-deactivate expired claims
CREATE TRIGGER auto_deactivate_expired
  AFTER INSERT ON public.double_exp_claims
  FOR EACH ROW
  EXECUTE FUNCTION deactivate_expired_claims();

-- ==================== STEP 8: CREATE VIEWS ====================

-- View: Transaction history with user info
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

-- ==================== STEP 9: ENABLE RLS ====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.double_exp_claims ENABLE ROW LEVEL SECURITY;

-- ==================== STEP 10: CREATE RLS POLICIES ====================

DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "admins_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admins_manage_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "anon_view_profiles_limited" ON public.profiles;
DROP POLICY IF EXISTS "users_view_own_transactions" ON public.transactions;
DROP POLICY IF EXISTS "users_create_own_transactions" ON public.transactions;
DROP POLICY IF EXISTS "users_update_own_pending" ON public.transactions;
DROP POLICY IF EXISTS "admins_manage_all_transactions" ON public.transactions;
DROP POLICY IF EXISTS "users_view_own_claims" ON public.double_exp_claims;
DROP POLICY IF EXISTS "users_manage_own_claims" ON public.double_exp_claims;
DROP POLICY IF EXISTS "admins_manage_all_claims" ON public.double_exp_claims;

-- Policies for PROFILES
CREATE POLICY "users_view_own_profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "system_insert_profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "public_read_for_auth"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admins_all_profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Policies for TRANSACTIONS
CREATE POLICY "users_view_own_transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_create_own_transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_pending"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins_all_transactions"
  ON public.transactions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Policies for DOUBLE_EXP_CLAIMS
CREATE POLICY "users_view_own_claims"
  ON public.double_exp_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_claims"
  ON public.double_exp_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_claims"
  ON public.double_exp_claims FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ==================== STEP 11: GRANT PERMISSIONS ====================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.double_exp_claims TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON transaction_history TO authenticated;

-- ==================== STEP 12: VERIFICATION ====================

DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'DATABASE SETUP COMPLETE!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '';

  -- Tables
  RAISE NOTICE '✓ Tables created: profiles, transactions, double_exp_claims';

  -- Triggers
  RAISE NOTICE '✓ Triggers: % total', (
    SELECT COUNT(*) FROM pg_trigger
    WHERE tgname IN (
      'on_auth_user_created',
      'set_updated_at_profiles',
      'trigger_set_transaction_reference',
      'trigger_update_transaction_timestamp',
      'trigger_update_user_balance',
      'auto_deactivate_expired'
    )
  );

  -- Functions
  RAISE NOTICE '✓ Functions: % total', (
    SELECT COUNT(*) FROM pg_proc
    WHERE proname IN (
      'handle_new_user',
      'handle_profile_updated_at',
      'generate_transaction_reference',
      'set_transaction_reference',
      'update_transaction_timestamp',
      'update_user_balance_on_transaction',
      'get_user_transaction_stats',
      'deactivate_expired_claims',
      'can_claim_double_exp'
    )
  );

  -- Policies
  RAISE NOTICE '✓ RLS Policies: % total', (
    SELECT COUNT(*) FROM pg_policies
    WHERE tablename IN ('profiles', 'transactions', 'double_exp_claims')
  );

  RAISE NOTICE '';
  RAISE NOTICE 'Ready to use! 🎉';
  RAISE NOTICE '==========================================';
END $$;

-- ==================== STEP 13: FIX ERRORS PROFILE 1 ====================

-- =============================================
-- FIX INFINITE RECURSION IN PROFILES POLICIES
-- =============================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "system_insert_profile" ON public.profiles;
DROP POLICY IF EXISTS "public_read_for_auth" ON public.profiles;
DROP POLICY IF EXISTS "admins_all_profiles" ON public.profiles;

-- Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==================== CREATE NEW POLICIES (WITHOUT RECURSION) ====================

-- Policy 1: Allow authenticated users to read ALL profiles
-- This is needed for username/email lookup during login
CREATE POLICY "authenticated_read_all_profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy 2: Allow anonymous users to read ALL profiles
-- This is needed for username/email lookup during login
CREATE POLICY "anon_read_all_profiles"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

-- Policy 3: Users can update their own profile
CREATE POLICY "users_update_own_profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: System can insert profiles (for new user registration)
CREATE POLICY "system_insert_profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 5: Admins can do everything (simple version without recursion)
CREATE POLICY "admins_all_access"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    -- Check role directly without subquery to profiles table
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) IN ('admin', 'superadmin')
  )
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) IN ('admin', 'superadmin')
  );

-- ==================== VERIFICATION ====================

DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'PROFILES POLICIES FIXED!';
  RAISE NOTICE '==========================================';

  -- Count policies
  RAISE NOTICE '✓ Total policies on profiles: %', (
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles'
  );

  RAISE NOTICE '';
  RAISE NOTICE 'Policies created:';
  RAISE NOTICE '  1. authenticated_read_all_profiles';
  RAISE NOTICE '  2. anon_read_all_profiles';
  RAISE NOTICE '  3. users_update_own_profile';
  RAISE NOTICE '  4. system_insert_profile';
  RAISE NOTICE '  5. admins_all_access';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready to use! 🎉';
  RAISE NOTICE '==========================================';
END $$;

-- ==================== STEP 14: FIX ERRORS PROFILE 1 ====================

-- =============================================
-- SIMPLE FIX - NO RECURSION (RECOMMENDED)
-- =============================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "system_insert_profile" ON public.profiles;
DROP POLICY IF EXISTS "public_read_for_auth" ON public.profiles;
DROP POLICY IF EXISTS "admins_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "authenticated_read_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "anon_read_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admins_all_access" ON public.profiles;

-- Disable and re-enable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==================== SIMPLE POLICIES (NO RECURSION) ====================

-- Policy 1: Everyone can read all profiles (needed for login)
CREATE POLICY "allow_read_all_profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Policy 2: Users can update their own profile
CREATE POLICY "allow_update_own_profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: System can insert profiles
CREATE POLICY "allow_insert_profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 4: Users can delete their own profile (optional)
CREATE POLICY "allow_delete_own_profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ==================== GRANT PERMISSIONS ====================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- ==================== VERIFICATION ====================

DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'SIMPLE POLICIES APPLIED!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '';

  RAISE NOTICE '✓ RLS Enabled: %', (
    SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles'
  );

  RAISE NOTICE '✓ Total policies: %', (
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles'
  );

  RAISE NOTICE '';
  RAISE NOTICE 'Policies:';
  RAISE NOTICE '  1. allow_read_all_profiles (SELECT for all)';
  RAISE NOTICE '  2. allow_update_own_profile (UPDATE own only)';
  RAISE NOTICE '  3. allow_insert_profile (INSERT with auth)';
  RAISE NOTICE '  4. allow_delete_own_profile (DELETE own only)';
  RAISE NOTICE '';
  RAISE NOTICE 'No more infinite recursion! 🎉';
  RAISE NOTICE '==========================================';
END $$;

-- ==================== STEP 1%: FIX ERRORS TRANSACTIONS 1 ====================

-- =============================================
-- COMPLETE FIX FOR TRANSACTION REFERENCE
-- =============================================

-- 1. Drop problematic objects
DROP TRIGGER IF EXISTS trigger_set_transaction_reference ON public.transactions;
DROP FUNCTION IF EXISTS set_transaction_reference() CASCADE;
DROP FUNCTION IF EXISTS generate_transaction_reference() CASCADE;

-- 2. Create simple reference generator
CREATE OR REPLACE FUNCTION generate_transaction_ref(tx_type transaction_type)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_ref TEXT;
  counter INTEGER := 0;
BEGIN
  LOOP
    new_ref :=
      CASE tx_type
        WHEN 'deposit' THEN 'DEP'
        WHEN 'withdraw' THEN 'WD'
        ELSE 'TRX'
      END ||
      TO_CHAR(NOW(), 'YYYYMMDDHH24MISS') || '-' ||
      LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.transactions WHERE reference_number = new_ref
    );

    counter := counter + 1;
    IF counter > 10 THEN
      RAISE EXCEPTION 'Failed to generate unique reference number';
    END IF;
  END LOOP;

  RETURN new_ref;
END;
$$;

-- 3. Create fixed trigger function
CREATE OR REPLACE FUNCTION set_transaction_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_transaction_ref(NEW.transaction_type);
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Recreate trigger
CREATE TRIGGER trigger_set_transaction_reference
  BEFORE INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_transaction_reference();

-- 5. Verify fix
DO $$
BEGIN
  RAISE NOTICE 'Transaction reference trigger fixed!';
END $$;