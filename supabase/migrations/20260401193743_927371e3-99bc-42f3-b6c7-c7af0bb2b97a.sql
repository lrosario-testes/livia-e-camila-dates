-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow all access to experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow all access to reviews" ON public.reviews;

-- Experiences: public read, authenticated write
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Auth insert experiences" ON public.experiences FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update experiences" ON public.experiences FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete experiences" ON public.experiences FOR DELETE TO authenticated USING (true);

-- Reviews: public read, authenticated write
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update reviews" ON public.reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);