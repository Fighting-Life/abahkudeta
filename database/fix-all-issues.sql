-- =============================================
-- CLEANUP & FIX ALL ISSUES
-- Run this script to fix registration & transaction errors
-- =============================================

-- ==================== STEP 1: CLEANUP ====================
-- Drop all problematic triggers and functions

-- Drop triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.sync_profile_email() CASCADE;

-- Drop all policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Anyone can search by username" ON profiles;
DROP POLICY IF EXISTS "Anyone can search by email" ON profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;

-- ==================== STEP 2: ENSURE PROFILES TABLE HAS EMAIL ====================
-- Add email column if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Update existing profiles with email from auth.users
UPDATE public.profiles 
SET email = u.email
FROM auth.users u
WHERE profiles.id = u.id AND profiles.email IS NULL;

-- ==================== STEP 3: CREATE NEW TRIGGER FUNCTION ====================
-- This function will automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert new profile with basic info
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
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

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==================== STEP 4: FIX RLS POLICIES FOR PROFILES ====================
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile
CREATE POLICY "users_view_own_profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "users_update_own_profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: System can insert profiles (for new user registration)
CREATE POLICY "system_insert_profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 4: Public read for username/email lookup (needed for login)
CREATE POLICY "public_read_for_auth"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 5: Admins can do everything
CREATE POLICY "admins_all_access"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==================== STEP 5: FIX TRANSACTIONS TABLE ====================
-- Disable RLS temporarily
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own pending transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can update any transaction" ON public.transactions;
DROP POLICY IF EXISTS "Admins can delete transactions" ON public.transactions;

-- Enable RLS again
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create simple policies
-- Policy 1: Users can view their own transactions
CREATE POLICY "users_view_own_transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Users can create their own transactions
CREATE POLICY "users_create_own_transactions"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own pending transactions
CREATE POLICY "users_update_own_pending"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Admins can do everything
CREATE POLICY "admins_all_transactions"
  ON public.transactions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==================== STEP 6: GRANT PERMISSIONS ====================
-- Grant access to tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.transactions TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ==================== STEP 7: VERIFICATION ====================
-- Check if everything is set up correctly
DO $$
BEGIN
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'VERIFICATION RESULTS';
  RAISE NOTICE '==========================================';
  
  -- Check profiles table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    RAISE NOTICE '✓ Table "profiles" exists';
  ELSE
    RAISE NOTICE '✗ Table "profiles" NOT found';
  END IF;
  
  -- Check email column
  IF EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    RAISE NOTICE '✓ Column "email" exists in profiles';
  ELSE
    RAISE NOTICE '✗ Column "email" NOT found in profiles';
  END IF;
  
  -- Check trigger
  IF EXISTS (SELECT FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    RAISE NOTICE '✓ Trigger "on_auth_user_created" exists';
  ELSE
    RAISE NOTICE '✗ Trigger "on_auth_user_created" NOT found';
  END IF;
  
  -- Check function
  IF EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') THEN
    RAISE NOTICE '✓ Function "handle_new_user" exists';
  ELSE
    RAISE NOTICE '✗ Function "handle_new_user" NOT found';
  END IF;
  
  -- Check RLS on profiles
  IF (SELECT relrowsecurity FROM pg_class WHERE relname = 'profiles') THEN
    RAISE NOTICE '✓ RLS enabled on profiles';
  ELSE
    RAISE NOTICE '✗ RLS NOT enabled on profiles';
  END IF;
  
  -- Check RLS on transactions
  IF (SELECT relrowsecurity FROM pg_class WHERE relname = 'transactions') THEN
    RAISE NOTICE '✓ RLS enabled on transactions';
  ELSE
    RAISE NOTICE '✗ RLS NOT enabled on transactions';
  END IF;
  
  -- Count policies on profiles
  RAISE NOTICE '✓ Policies on profiles: %', (
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles'
  );
  
  -- Count policies on transactions
  RAISE NOTICE '✓ Policies on transactions: %', (
    SELECT COUNT(*) FROM pg_policies WHERE tablename = 'transactions'
  );
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE 'Setup complete! 🎉';
  RAISE NOTICE '==========================================';
END $$;
