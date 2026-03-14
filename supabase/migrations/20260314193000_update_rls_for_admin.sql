-- Drop existing specific RLS policies to cleanly update them
DROP POLICY IF EXISTS "Expenses access policy" ON public.expenses;
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;

DROP POLICY IF EXISTS "Categories access policy" ON public.categories;
DROP POLICY IF EXISTS "Users can manage their own categories" ON public.categories;

DROP POLICY IF EXISTS "Goals access policy" ON public.goals;
DROP POLICY IF EXISTS "Users can manage their own goals" ON public.goals;

DROP POLICY IF EXISTS "Payment methods access policy" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can manage their own payment methods" ON public.payment_methods;

DROP POLICY IF EXISTS "Subcategories access policy" ON public.subcategories;
DROP POLICY IF EXISTS "Users can manage their own subcategories" ON public.subcategories;

-- Apply rigorous RLS updates enforcing Admin Global Read/Write privileges

CREATE POLICY "Expenses access policy" ON public.expenses
FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Categories access policy" ON public.categories
FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Goals access policy" ON public.goals
FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Payment methods access policy" ON public.payment_methods
FOR ALL USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Subcategories access policy" ON public.subcategories
FOR ALL USING (
  category_id IN (SELECT id FROM public.categories WHERE user_id = auth.uid() OR public.is_admin())
) WITH CHECK (
  category_id IN (SELECT id FROM public.categories WHERE user_id = auth.uid() OR public.is_admin())
);
