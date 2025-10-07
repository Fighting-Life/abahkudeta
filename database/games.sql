-- Create games table
CREATE TABLE games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    provider INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    game_code TEXT UNIQUE NOT NULL,
    game_image TEXT,
    game_link TEXT,
    is_favourite BOOLEAN DEFAULT FALSE,
    rtp_value NUMERIC(5,2),
    rtp_changed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_games_category ON public.games(category);
CREATE INDEX idx_games_provider ON public.games(provider);
CREATE INDEX idx_games_game_code ON public.games(game_code);
CREATE INDEX idx_games_is_active ON public.games(is_active);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON public.games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- Enable RLS on games table
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Policy untuk membaca games (public access)
CREATE POLICY "Allow public read access for games" ON public.games FOR SELECT USING (is_active = true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.games
FOR INSERT
TO authenticated
WITH CHECK (true);