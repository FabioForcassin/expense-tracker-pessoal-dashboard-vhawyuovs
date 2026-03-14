CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, month, year)
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals" ON public.goals
    FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own payment methods" ON public.payment_methods
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.expenses
ADD COLUMN is_installment BOOLEAN DEFAULT FALSE,
ADD COLUMN current_installment INTEGER,
ADD COLUMN total_installments INTEGER;

-- Seed an installment expense and payment methods for testing if admin exists
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1;
    IF target_user_id IS NOT NULL THEN
        -- Seed payment methods
        INSERT INTO public.payment_methods (user_id, name, type) VALUES
        (target_user_id, 'Itaú', 'Conta Corrente/Débito'),
        (target_user_id, 'Nubank', 'Conta Corrente/Débito'),
        (target_user_id, 'CC Itaú visa infinity', 'Cartão de Crédito')
        ON CONFLICT DO NOTHING;

        -- Seed installments
        INSERT INTO public.expenses (
            user_id, description, amount, category, date, secondary_category, type, payment_method, comment, classification, who, month_num, competency, is_installment, current_installment, total_installments
        ) VALUES
        (target_user_id, 'MacBook Pro', 850.0, 'Pessoal', '2026-04-15T00:00:00Z', 'Eletrônicos', 'Variável', 'CC Itaú visa infinity', 'Parcela 1', 'Pessoal', 'Admin', 4, 'Abr', true, 1, 10),
        (target_user_id, 'MacBook Pro', 850.0, 'Pessoal', '2026-05-15T00:00:00Z', 'Eletrônicos', 'Variável', 'CC Itaú visa infinity', 'Parcela 2', 'Pessoal', 'Admin', 5, 'Mai', true, 2, 10),
        (target_user_id, 'MacBook Pro', 850.0, 'Pessoal', '2026-06-15T00:00:00Z', 'Eletrônicos', 'Variável', 'CC Itaú visa infinity', 'Parcela 3', 'Pessoal', 'Admin', 6, 'Jun', true, 3, 10);
    END IF;
END $$;
