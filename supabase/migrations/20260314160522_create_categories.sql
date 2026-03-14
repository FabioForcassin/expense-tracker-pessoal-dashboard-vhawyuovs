CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    color TEXT DEFAULT 'hsl(220 70% 50%)',
    icon TEXT DEFAULT 'Layers',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own categories" ON categories FOR ALL USING (auth.uid() = user_id);

CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own subcategories" ON subcategories FOR ALL USING (
    category_id IN (SELECT id FROM categories WHERE user_id = auth.uid())
);
