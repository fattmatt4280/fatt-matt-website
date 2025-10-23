-- Change category column from single text to text array
ALTER TABLE portfolio_items 
ALTER COLUMN category TYPE text[] 
USING ARRAY[category];

-- Update the column to not be nullable
ALTER TABLE portfolio_items 
ALTER COLUMN category SET NOT NULL;

-- Add a check to ensure at least one category is selected
ALTER TABLE portfolio_items 
ADD CONSTRAINT at_least_one_category 
CHECK (array_length(category, 1) > 0);