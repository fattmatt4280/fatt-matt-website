CREATE POLICY "location_registrations_insert_restrictive_validation"
ON public.location_registrations
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 5 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(location) BETWEEN 1 AND 100
  AND (phone IS NULL OR char_length(phone) <= 40)
);