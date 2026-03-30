-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('comida', 'filme', 'compra')),
  comida_tipo TEXT CHECK (comida_tipo IN ('gelateria', 'cafeteria', 'restaurante')),
  restaurante_tipo TEXT CHECK (restaurante_tipo IN ('pizzaria', 'arabe', 'fastfood', 'japones', 'frutos-do-mar', 'brasileiro', 'italiano', 'outro')),
  is_delivery BOOLEAN DEFAULT false,
  is_caranguejo BOOLEAN DEFAULT false,
  compra_tipo TEXT CHECK (compra_tipo IN ('mercado', 'jogo')),
  nocinema BOOLEAN DEFAULT false,
  name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'avaliada')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL CHECK (user_name IN ('livia', 'camila')),
  ratings JSONB NOT NULL DEFAULT '{}',
  average NUMERIC(3,1) NOT NULL DEFAULT 0,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public access policies (private 2-user app, no Supabase auth)
CREATE POLICY "Allow all access to experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_reviews_experience_id ON public.reviews(experience_id);
CREATE INDEX idx_reviews_user_name ON public.reviews(user_name);
CREATE INDEX idx_experiences_status ON public.experiences(status);