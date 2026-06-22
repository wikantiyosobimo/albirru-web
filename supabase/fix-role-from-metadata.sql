-- Fix users who signed up as staf via Google but got role='siswa'
-- because the trigger didn't read OAuth metadata.
-- Run this ONCE in SQL Editor to fix existing mismatched users.

UPDATE public.profiles p
SET role = 'staf'
FROM auth.users u
WHERE p.id = u.id
  AND p.role = 'siswa'
  AND u.raw_user_meta_data ->> 'role' = 'staf';

-- Verify: show all users and their roles
SELECT p.id, p.nama, p.role, u.raw_user_meta_data ->> 'role' as meta_role, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.role, p.nama;
