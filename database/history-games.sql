-- =============================================
-- HISTORY GAMES TABLE SETUP
-- =============================================

-- Drop existing table if exists
DROP TABLE IF EXISTS public.history_games CASCADE;

-- Create history_games table
CREATE TABLE public.history_games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Game Information
    game_name TEXT NOT NULL,
    game_slug TEXT,
    game_category TEXT,
    game_provider INTEGER NOT NULL,
    game_code TEXT,
    game_image TEXT,
    game_link TEXT,

    -- Game Stats
    total_play INTEGER DEFAULT 0,
    bet_amount DECIMAL(15, 2) DEFAULT 0,
    win_amount DECIMAL(15, 2) DEFAULT 0,
    is_win BOOLEAN DEFAULT FALSE,

    -- User Preferences
    is_favourite BOOLEAN DEFAULT FALSE,

    -- RTP Information
    rtp_value REAL DEFAULT 0,
    rtp_changed BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Constraints
    CONSTRAINT valid_bet_amount CHECK (bet_amount >= 0),
    CONSTRAINT valid_win_amount CHECK (win_amount >= 0),
    CONSTRAINT valid_total_play CHECK (total_play >= 0)
);

-- Create indexes
CREATE INDEX idx_history_games_user_id ON public.history_games(user_id);
CREATE INDEX idx_history_games_game_slug ON public.history_games(game_slug);
CREATE INDEX idx_history_games_game_category ON public.history_games(game_category);
CREATE INDEX idx_history_games_game_provider ON public.history_games(game_provider);
CREATE INDEX idx_history_games_created_at ON public.history_games(created_at DESC);
CREATE INDEX idx_history_games_updated_at ON public.history_games(updated_at DESC);
CREATE INDEX idx_history_games_is_favourite ON public.history_games(is_favourite) WHERE is_favourite = true;
CREATE INDEX idx_history_games_user_created ON public.history_games(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.history_games ENABLE ROW LEVEL SECURITY;

-- ==================== RLS POLICIES ====================

-- Policy 1: Users can view their own game history
CREATE POLICY "users_view_own_game_history" ON public.history_games
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own game history
CREATE POLICY "users_insert_own_game_history" ON public.history_games
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own game history
CREATE POLICY "users_update_own_game_history" ON public.history_games
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own game history
CREATE POLICY "users_delete_own_game_history" ON public.history_games
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Policy 5: Admins can manage all game history
CREATE POLICY "admins_manage_all_game_history" ON public.history_games
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
);

-- ==================== TRIGGER FUNCTIONS ====================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_history_games_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Trigger: Auto-update updated_at
CREATE TRIGGER trigger_update_history_games_timestamp
    BEFORE UPDATE ON public.history_games
    FOR EACH ROW
    EXECUTE FUNCTION update_history_games_timestamp();

-- ==================== GRANT PERMISSIONS ====================

GRANT ALL ON public.history_games TO authenticated;
GRANT SELECT ON public.history_games TO anon;

-- ==================== VERIFICATION ====================

DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'HISTORY GAMES TABLE CREATED SUCCESSFULLY!';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '';
    RAISE NOTICE '✓ Table: history_games';
    RAISE NOTICE '✓ Indexes: 8 indexes created';
    RAISE NOTICE '✓ RLS Policies: 5 policies applied';
    RAISE NOTICE '✓ Trigger: Auto-update timestamp';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready to use! 🎮';
END $$;