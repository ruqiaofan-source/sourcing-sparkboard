CREATE OR REPLACE FUNCTION public.auto_generate_insight_seo()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Auto-generate meta_title if empty
  IF NEW.meta_title IS NULL OR NEW.meta_title = '' THEN
    NEW.meta_title := LEFT(NEW.title, 50) || ' | Equilinq Insights';
  END IF;

  -- Auto-generate meta_description if empty
  IF NEW.meta_description IS NULL OR NEW.meta_description = '' THEN
    NEW.meta_description := LEFT(
      regexp_replace(NEW.excerpt, E'[\\n\\r]+', ' ', 'g'),
      155
    );
    -- Ensure it doesn't cut mid-word
    IF length(NEW.excerpt) > 155 THEN
      NEW.meta_description := LEFT(NEW.meta_description, length(NEW.meta_description) - position(' ' in reverse(NEW.meta_description))) || '...';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_seo_insights
  BEFORE INSERT OR UPDATE ON public.insights
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_insight_seo();