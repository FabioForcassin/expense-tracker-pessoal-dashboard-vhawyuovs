-- Set the default logged in user as admin to test RBAC and global dashboard views
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'fabio.forcassin@benera.com.br';
