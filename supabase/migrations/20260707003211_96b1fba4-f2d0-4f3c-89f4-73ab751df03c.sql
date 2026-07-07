
-- 1. Remove location_registrations from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.location_registrations;

-- 2. Revoke public execute on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 3. user_roles: add restrictive policies preventing non-admins from inserting/updating/deleting their own role
CREATE POLICY "Only admins can insert roles"
ON public.user_roles AS RESTRICTIVE
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles AS RESTRICTIVE
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles AS RESTRICTIVE
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. Tighten location_registrations INSERT policy - replace WITH CHECK (true) with basic validation
DROP POLICY IF EXISTS "Anyone can register for location notifications" ON public.location_registrations;
CREATE POLICY "Anyone can register for location notifications"
ON public.location_registrations
FOR INSERT
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 200
  AND length(email) BETWEEN 5 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(coalesce(location, '')) BETWEEN 1 AND 100
  AND (phone IS NULL OR length(phone) <= 40)
);

-- 5. Remove broad SELECT policy on storage.objects for portfolio-images bucket.
-- The bucket remains public, so direct object URLs still work; only listing is disabled.
DROP POLICY IF EXISTS "Anyone can view portfolio images" ON storage.objects;
