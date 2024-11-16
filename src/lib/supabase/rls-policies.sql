-- Enable Row Level Security
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for prompts table
CREATE POLICY "Users can view their own prompts"
  ON public.prompts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompts"
  ON public.prompts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompts"
  ON public.prompts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prompts"
  ON public.prompts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for user_settings table
CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  user_id uuid,
  max_requests int DEFAULT 100,
  window_minutes int DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  request_count int;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM public.prompts
  WHERE prompts.user_id = check_rate_limit.user_id
    AND created_at > NOW() - (window_minutes || ' minutes')::interval;
    
  RETURN request_count < max_requests;
END;
$$;