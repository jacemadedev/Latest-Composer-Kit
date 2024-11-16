-- Add metrics columns to prompts table
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS tokens integer,
ADD COLUMN IF NOT EXISTS response_time double precision;

-- Update existing rows with default values
UPDATE public.prompts 
SET tokens = 0,
    response_time = 0
WHERE tokens IS NULL 
   OR response_time IS NULL;

-- Add constraints
ALTER TABLE public.prompts
ALTER COLUMN tokens SET DEFAULT 0,
ALTER COLUMN response_time SET DEFAULT 0,
ADD CONSTRAINT tokens_positive CHECK (tokens >= 0),
ADD CONSTRAINT response_time_positive CHECK (response_time >= 0);