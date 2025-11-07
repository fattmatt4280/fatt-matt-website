-- Create portfolio_images table to support multiple images per portfolio item
CREATE TABLE public.portfolio_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_item_id UUID NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view portfolio images"
ON public.portfolio_images
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage portfolio images"
ON public.portfolio_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_portfolio_images_item_id ON public.portfolio_images(portfolio_item_id);
CREATE INDEX idx_portfolio_images_display_order ON public.portfolio_images(portfolio_item_id, display_order);

-- Trigger for updating updated_at
CREATE TRIGGER update_portfolio_images_updated_at
BEFORE UPDATE ON public.portfolio_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing images from portfolio_items to portfolio_images
INSERT INTO public.portfolio_images (portfolio_item_id, image_url, display_order)
SELECT id, image_url, 0
FROM public.portfolio_items
WHERE image_url IS NOT NULL AND image_url != '';

-- Add a comment to clarify the image_url column is now legacy
COMMENT ON COLUMN public.portfolio_items.image_url IS 'Legacy column - images now stored in portfolio_images table. Kept for backwards compatibility.';