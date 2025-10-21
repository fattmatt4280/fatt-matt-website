-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create site_content table for editable content
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  content JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for site_content
CREATE POLICY "Anyone can view site content"
  ON public.site_content
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can edit site content"
  ON public.site_content
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create portfolio_items table
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for portfolio_items
CREATE POLICY "Anyone can view portfolio items"
  ON public.portfolio_items
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage portfolio items"
  ON public.portfolio_items
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default site content
INSERT INTO public.site_content (section, title, subtitle, description) VALUES
('hero', 'Inkwell Artistry', 'Where Art Meets Skin', 'Transform your vision into timeless body art with our award-winning tattoo artists.'),
('about', 'About Us', 'Crafting Stories on Skin', 'At Inkwell Artistry, we believe every tattoo tells a story. With over a decade of experience, our team of skilled artists specializes in bringing your unique vision to life.'),
('booking', 'Book Your Session', null, 'Ready to start your tattoo journey? Fill out the form below and we''ll get back to you within 24 hours.');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();