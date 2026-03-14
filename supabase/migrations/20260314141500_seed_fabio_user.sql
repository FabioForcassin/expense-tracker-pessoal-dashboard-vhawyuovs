DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user already exists to make migration safe
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'fabio.forcassin@benera.com.br') THEN
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
      'fabio.forcassin@benera.com.br',
      crypt('@#Benera123456@#', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Fabio Forcassin"}',
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

    -- Seed basic expenses to fulfill the "historical data for the year 2026" visual requirement
    INSERT INTO public.expenses (
      user_id, description, amount, category, date, secondary_category, type, payment_method, comment, classification, who, month_num, competency
    ) VALUES
    (new_user_id, 'Empresa S.A', 15500.0, 'Receitas', '2026-03-01T00:00:00Z', 'Salário', 'Receita', 'Itaú', 'Salário Mensal', 'Pessoal', 'Fabio', 3, 'Mar'),
    (new_user_id, 'Carrefour', 1250.0, 'Alimentação', '2026-03-02T00:00:00Z', 'Supermercado/Feira', 'Variável', 'CC Itaú visa infinity', 'Compra do mês', 'Pessoal', 'Fabio', 3, 'Mar'),
    (new_user_id, 'QuintoAndar', 2950.0, 'Moradia', '2026-03-10T00:00:00Z', 'Condomínio', 'Fixa', 'Itaú', 'Condomínio apto', 'Pessoal', 'Fabio', 3, 'Mar'),
    (new_user_id, 'Drogasil', 280.0, 'Saúde', '2026-03-15T00:00:00Z', 'Medicamentos/Farmácia', 'Variável', 'CC Nubank master', 'Remédios', 'Pessoal', 'Fabio', 3, 'Mar'),
    (new_user_id, 'Pão de Açúcar', 920.0, 'Alimentação', '2026-04-12T00:00:00Z', 'Supermercado/Feira', 'Variável', 'CC Itaú visa infinity', 'Compra do mês seguinte', 'Pessoal', 'Fabio', 4, 'Abr'),
    (new_user_id, 'Oficina', 1200.0, 'Transporte', '2026-04-20T00:00:00Z', 'Manutenção', 'Variável', 'CC Nubank master', 'Revisão', 'Pessoal', 'Fabio', 4, 'Abr'),
    (new_user_id, 'Parcela Carro', 1500.0, 'Transporte', '2026-05-10T00:00:00Z', 'Financiamento do Carro', 'Fixa', 'Itaú', 'Parcela 27/36', 'Pessoal', 'Fabio', 5, 'Mai'),
    (new_user_id, 'Seguro Residencial', 1200.0, 'Moradia', '2026-10-15T00:00:00Z', 'Seguro Residencial', 'Fixa', 'CC Itaú visa infinity', 'Parcela Única', 'Pessoal', 'Fabio', 10, 'Out');
  END IF;
END $$;
