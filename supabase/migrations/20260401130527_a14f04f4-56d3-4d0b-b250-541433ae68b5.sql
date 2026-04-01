
ALTER TABLE public.profiles 
  ADD COLUMN phone_number text,
  ADD COLUMN full_name text,
  ADD COLUMN area_of_residence text;

ALTER TABLE public.sourcing_requests
  ADD COLUMN delivery_address text NOT NULL DEFAULT '';
