-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Add type column to prompts table
ALTER TABLE public.prompts 
ADD COLUMN type text NOT NULL DEFAULT 'prompt';

-- Add check constraint for valid types
ALTER TABLE public.prompts
ADD CONSTRAINT valid_prompt_types CHECK (type IN ('prompt', 'blog'));

-- Update existing rows
UPDATE public.prompts 
SET type = 'prompt'
WHERE type IS NULL;

-- Create policy for type column
CREATE POLICY "Users can view their own prompts by type"
ON public.prompts
FOR SELECT
USING (auth.uid() = user_id);

-- Index for better query performance
CREATE INDEX idx_prompts_type ON public.prompts(type);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;