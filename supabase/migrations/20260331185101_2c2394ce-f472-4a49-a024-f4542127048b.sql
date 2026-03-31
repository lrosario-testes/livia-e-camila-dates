
ALTER TABLE public.experiences ADD COLUMN date_unknown boolean DEFAULT false;
ALTER TABLE public.experiences ADD COLUMN produto_nome text;

ALTER TABLE public.reviews ADD COLUMN tags text[] DEFAULT '{}'::text[];
