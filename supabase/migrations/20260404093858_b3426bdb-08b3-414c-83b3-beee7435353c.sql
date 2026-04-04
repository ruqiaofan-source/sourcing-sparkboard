DELETE FROM insights WHERE cover_image_url IS NULL AND author_name = 'Equilinq Editorial';
DELETE FROM insights WHERE id IN (
  SELECT id FROM insights 
  WHERE author_name = 'Equilinq Editorial' AND cover_image_url IS NOT NULL
  ORDER BY created_at DESC
  OFFSET 1
);