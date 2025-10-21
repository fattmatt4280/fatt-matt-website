-- Add new columns to portfolio_items table for detailed tattoo information
ALTER TABLE public.portfolio_items
ADD COLUMN IF NOT EXISTS artist_name TEXT,
ADD COLUMN IF NOT EXISTS duration_hours NUMERIC,
ADD COLUMN IF NOT EXISTS placement TEXT,
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS color_type TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage bucket
-- Admins can upload portfolio images
CREATE POLICY "Admins can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can update portfolio images
CREATE POLICY "Admins can update portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Admins can delete portfolio images
CREATE POLICY "Admins can delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'portfolio-images' AND
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Anyone can view portfolio images
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');