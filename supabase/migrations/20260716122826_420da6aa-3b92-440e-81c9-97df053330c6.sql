DROP POLICY IF EXISTS "Anyone can register for location notifications" ON public.location_registrations;
DROP POLICY IF EXISTS "location_registrations_insert_restrictive_validation" ON public.location_registrations;
REVOKE INSERT ON public.location_registrations FROM anon;