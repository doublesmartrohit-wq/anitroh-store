GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
GRANT USAGE ON TYPE public.app_role TO anon, authenticated;