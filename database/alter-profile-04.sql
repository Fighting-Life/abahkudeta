
-- Add email column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email
ON public.profiles(email);

-- Update existing data (one-time)
UPDATE profiles
SET email = (
  SELECT email
  FROM auth.users
  WHERE auth.users.id = profiles.id
)
WHERE email IS NULL;

-- Trigger untuk auto-update email saat user baru
CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update email di profiles
  INSERT INTO public.profiles (id, username, email, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.email,
    NOW()
  )
  ON CONFLICT (id)
  DO UPDATE SET
    email = NEW.email,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_email();