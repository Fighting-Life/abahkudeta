-- DROP dan CREATE ULANG trigger function yang benar
-- Run ini di Supabase SQL Editor

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Function baru yang handle email & username dengan benar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
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
    last_sign_in_at,
    updated_at
  ) VALUES (
    NEW.id,
    -- Username dari metadata, fallback ke email jika tidak ada
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    -- Full name dari metadata
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'whatsapp',
    COALESCE(NEW.raw_user_meta_data->>'payment_type', 'bank'),
    NEW.raw_user_meta_data->>'bank_account_number',
    NEW.raw_user_meta_data->>'bank_account_name',
    NEW.raw_user_meta_data->>'referral_code',
    '0', -- balance default 0
    NEW.raw_user_meta_data->>'avatar_url',
    'user', -- role default user
    TRUE, -- is_active default true
    FALSE, -- bonus_claimed default false
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify trigger created successfully
SELECT
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as is_enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';