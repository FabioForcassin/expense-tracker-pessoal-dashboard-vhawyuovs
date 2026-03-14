-- Recreate functions to ensure they exist and handle status correctly
CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT is_active FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Ensure RLS policies are up to date to allow Admin to see all consolidated data
DROP POLICY IF EXISTS "Expenses access policy" ON expenses;
CREATE POLICY "Expenses access policy" ON expenses FOR ALL TO public
  USING ( (is_active_user() AND auth.uid() = user_id) OR is_admin() )
  WITH CHECK ( (is_active_user() AND auth.uid() = user_id) OR is_admin() );

DROP POLICY IF EXISTS "Goals access policy" ON goals;
CREATE POLICY "Goals access policy" ON goals FOR ALL TO public
  USING ( (is_active_user() AND auth.uid() = user_id) OR is_admin() )
  WITH CHECK ( (is_active_user() AND auth.uid() = user_id) OR is_admin() );
