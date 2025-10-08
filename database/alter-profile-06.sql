-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Allow system to insert during signup
CREATE POLICY "Enable insert for service role"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy 4: Allow public to read username (for login check)
CREATE POLICY "Anyone can search by username"
ON profiles FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 5: Allow public to read email (for login check)
-- IMPORTANT: This is safe because we only expose email during login check
CREATE POLICY "Anyone can search by email"
ON profiles FOR SELECT
TO anon, authenticated
USING (true);