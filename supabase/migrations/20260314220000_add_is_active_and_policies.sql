-- Add is_active column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_active') THEN
        ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Create function to check if the current user is active
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_active FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Update RLS policies to restrict inactive users from reading/writing data
-- (Admins bypass these checks via the is_admin() function)

-- Categories
DROP POLICY IF EXISTS "Categories access policy" ON categories;
CREATE POLICY "Categories access policy" ON categories FOR ALL TO public
  USING ( (is_active_user() AND auth.uid() = user_id) OR is_admin() )
  WITH CHECK ( (is_active_user() AND auth.uid() = user_id) OR is_admin() );

-- Expenses
DROP POLICY IF EXISTS "Expenses access policy" ON expenses;
CREATE POLICY "Expenses access policy" ON expenses FOR ALL TO public
  USING ( (is_active_user() AND auth.uid() = user_id) OR is_admin() )
  WITH CHECK ( (is_active_user() AND auth.uid() = user_id) OR is_admin() );

-- Goals
DROP POLICY IF EXISTS "Goals access policy" ON goals;
CREATE POLICY "Goals access policy" ON goals FOR ALL TO public
  USING ( (is_active_user() AND auth.uid() = user_id) OR is_admin() )
  WITH CHECK ( (is_active_user() AND auth.uid() = user_id) OR is_admin() );

-- Payment Methods
DROP POLICY IF EXISTS "Payment methods access policy" ON payment_methods;
CREATE POLICY "Payment methods access policy" ON payment_methods FOR ALL TO public
  USING ( (is_active_user() AND auth.uid() = user_id) OR is_admin() )
  WITH CHECK ( (is_active_user() AND auth.uid() = user_id) OR is_admin() );

-- Subcategories
DROP POLICY IF EXISTS "Subcategories access policy" ON subcategories;
CREATE POLICY "Subcategories access policy" ON subcategories FOR ALL TO public
  USING ( (is_active_user() AND category_id IN (SELECT id FROM categories WHERE user_id = auth.uid())) OR is_admin() )
  WITH CHECK ( (is_active_user() AND category_id IN (SELECT id FROM categories WHERE user_id = auth.uid())) OR is_admin() );

-- Profiles: Admins can do anything, users can read their own profile even if inactive (to know they exist), 
-- but can only update their profile if they are active.
DROP POLICY IF EXISTS "Enable read for admins" ON profiles;
DROP POLICY IF EXISTS "Enable read for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for admins" ON profiles;

CREATE POLICY "Enable read for all" ON profiles FOR SELECT TO public
  USING ( auth.uid() = id OR is_admin() );

CREATE POLICY "Enable update for active users and admins" ON profiles FOR UPDATE TO public
  USING ( (is_active_user() AND auth.uid() = id) OR is_admin() )
  WITH CHECK ( (is_active_user() AND auth.uid() = id) OR is_admin() );
