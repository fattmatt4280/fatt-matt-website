
CREATE TABLE public.location_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  location text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.location_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for location notifications"
ON public.location_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view registrations"
ON public.location_registrations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage registrations"
ON public.location_registrations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
