CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    secondary_category TEXT,
    type TEXT,
    payment_method TEXT,
    comment TEXT,
    classification TEXT,
    who TEXT,
    month_num INTEGER,
    competency TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own expenses" ON public.expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses" ON public.expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" ON public.expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" ON public.expenses
    FOR DELETE USING (auth.uid() = user_id);

DO $
DECLARE
  new_user_id uuid;
BEGIN
  -- Seed user
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin"}',
    false, 'authenticated', 'authenticated',
    '',    -- confirmation_token: MUST be '' not NULL
    '',    -- recovery_token: MUST be '' not NULL
    '',    -- email_change_token_new: MUST be '' not NULL
    '',    -- email_change: MUST be '' not NULL
    '',    -- email_change_token_current: MUST be '' not NULL
    NULL,  -- phone: MUST be NULL (not '') due to UNIQUE constraint
    '',    -- phone_change: MUST be '' not NULL
    '',    -- phone_change_token: MUST be '' not NULL
    ''     -- reauthentication_token: MUST be '' not NULL
  );

  -- Seed expenses
  INSERT INTO public.expenses (
    user_id, description, amount, category, date, secondary_category, type, payment_method, comment, classification, who, month_num, competency
  ) VALUES
  (new_user_id, 'Empresa S.A', 12500.0, 'Receitas', '2026-03-01T00:00:00Z', 'Salário', 'Receita', 'Itaú', 'Salário Mensal', 'Pessoal', 'Fabio', 3, 'Mar'),
  (new_user_id, 'Carrefour', 850.5, 'Alimentação', '2026-03-02T00:00:00Z', 'Supermercado/Feira', 'Variável', 'CC Itaú visa infinity', 'Compra do mês', 'Pessoal', 'Fabio', 3, 'Mar'),
  (new_user_id, 'QuintoAndar', 950.0, 'Moradia', '2026-03-10T00:00:00Z', 'Condomínio', 'Fixa', 'Itaú', 'Condomínio apto', 'Pessoal', 'Fabio', 3, 'Mar'),
  (new_user_id, 'Drogasil', 180.0, 'Saúde', '2026-03-15T00:00:00Z', 'Medicamentos/Farmácia', 'Variável', 'CC Nubank master', 'Remédios', 'Pessoal', 'Fabio', 3, 'Mar'),
  (new_user_id, 'Pão de Açúcar', 920.0, 'Alimentação', '2026-04-12T00:00:00Z', 'Supermercado/Feira', 'Variável', 'CC Itaú visa infinity', 'Compra do mês seguinte', 'Pessoal', 'Fabio', 4, 'Abr'),
  (new_user_id, 'Oficina', 1200.0, 'Transporte', '2026-04-20T00:00:00Z', 'Manutenção', 'Variável', 'CC Nubank master', 'Revisão', 'Pessoal', 'Fabio', 4, 'Abr'),
  (new_user_id, 'Parcela Carro', 1500.0, 'Transporte', '2026-05-10T00:00:00Z', 'Financiamento do Carro', 'Fixa', 'Itaú', 'Parcela 27/36', 'Pessoal', 'Fabio', 5, 'Mai'),
  (new_user_id, 'Parcela Carro', 1500.0, 'Transporte', '2026-06-10T00:00:00Z', 'Financiamento do Carro', 'Fixa', 'Itaú', 'Parcela 28/36', 'Pessoal', 'Fabio', 6, 'Jun'),
  (new_user_id, 'Seguro Residencial', 1200.0, 'Moradia', '2026-10-15T00:00:00Z', 'Seguro Residencial', 'Fixa', 'CC Itaú visa infinity', 'Parcela Única', 'Pessoal', 'Fabio', 10, 'Out');
END $;
