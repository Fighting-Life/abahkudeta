
-- Create table for categories (many-to-many relationship)
CREATE TABLE game_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    seq_no INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_categories_game_id ON public.game_categories(game_id);
CREATE INDEX idx_game_categories_seq_no ON public.game_categories(seq_no);

CREATE TRIGGER update_game_categories_updated_at
    BEFORE UPDATE ON public.game_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- Enable RLS on game_categories table
ALTER TABLE public.game_categories ENABLE ROW LEVEL SECURITY;

-- Policy untuk membaca categories (public access)
CREATE POLICY "Allow public read access for game_categories" ON public.game_categories FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.game_categories
FOR INSERT
TO authenticated
WITH CHECK (true);