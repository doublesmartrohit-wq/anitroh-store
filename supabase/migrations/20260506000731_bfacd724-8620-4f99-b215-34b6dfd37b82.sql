
-- Orders: tracking + invoice
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_id text,
  ADD COLUMN IF NOT EXISTS tracking_url text,
  ADD COLUMN IF NOT EXISTS invoice_number text UNIQUE;

CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number := 'INV-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(replace(NEW.id::text,'-',''),1,6));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_invoice ON public.orders;
CREATE TRIGGER trg_orders_invoice
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

-- Backfill existing
UPDATE public.orders SET invoice_number =
  'INV-' || to_char(created_at,'YYYYMMDD') || '-' || upper(substr(replace(id::text,'-',''),1,6))
WHERE invoice_number IS NULL;

-- Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percent', -- 'percent' | 'fixed'
  discount_value numeric NOT NULL,
  min_order numeric NOT NULL DEFAULT 0,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
CREATE POLICY "Anyone can view active coupons" ON public.coupons
FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
CREATE POLICY "Admins manage coupons" ON public.coupons
FOR ALL TO authenticated
USING (app_private.has_role(auth.uid(),'admin'))
WITH CHECK (app_private.has_role(auth.uid(),'admin'));

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images','product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Product images public read" ON storage.objects;
CREATE POLICY "Product images public read" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
CREATE POLICY "Admins upload product images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images' AND app_private.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins update product images" ON storage.objects;
CREATE POLICY "Admins update product images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND app_private.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;
CREATE POLICY "Admins delete product images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND app_private.has_role(auth.uid(),'admin'));
