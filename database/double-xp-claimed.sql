-- Table untuk tracking Double EXP claims
CREATE TABLE IF NOT EXISTS public.double_exp_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  next_claim_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_double_exp_user_id ON public.double_exp_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_double_exp_active ON public.double_exp_claims(is_active);
CREATE INDEX IF NOT EXISTS idx_double_exp_expires ON public.double_exp_claims(expires_at);

-- Enable RLS
ALTER TABLE public.double_exp_claims ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own claims
CREATE POLICY "Users can view own claims" ON public.double_exp_claims
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own claims
CREATE POLICY "Users can insert own claims" ON public.double_exp_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own claims
CREATE POLICY "Users can update own claims" ON public.double_exp_claims
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to auto-deactivate expired claims
CREATE OR REPLACE FUNCTION deactivate_expired_claims()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.double_exp_claims
  SET is_active = FALSE
  WHERE user_id = NEW.user_id
    AND is_active = TRUE
    AND expires_at < NOW()
    AND id != NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-deactivate when new claim is created
CREATE TRIGGER auto_deactivate_expired
  AFTER INSERT ON public.double_exp_claims
  FOR EACH ROW
  EXECUTE FUNCTION deactivate_expired_claims();

-- Function to check if user can claim (once per 24 hours)
CREATE OR REPLACE FUNCTION can_claim_double_exp(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  last_claim_time TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT next_claim_at INTO last_claim_time
  FROM public.double_exp_claims
  WHERE user_id = p_user_id
  ORDER BY claimed_at DESC
  LIMIT 1;

  -- If no previous claim or next_claim_at has passed
  RETURN last_claim_time IS NULL OR last_claim_time <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data untuk testing (optional)
-- INSERT INTO public.double_exp_claims (user_id, claimed_at, expires_at, next_claim_at)
-- VALUES (
--   'your-user-id-here',
--   NOW(),
--   NOW() + INTERVAL '1 hour',
--   NOW() + INTERVAL '24 hours'
-- );