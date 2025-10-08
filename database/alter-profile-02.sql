-- 1. DROP trigger dan function lama jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Buat function baru yang handle semua field custom
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
    NEW.email, -- username pakai email
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

-- 3. Buat trigger baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger untuk auto-update updated_at saat profile di-update
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_updated_at();

-- 6. Tambahkan policy untuk admin bisa update semua profile
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Policy untuk admin bisa delete profile
CREATE POLICY "Admins can delete any profile" ON public.profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );