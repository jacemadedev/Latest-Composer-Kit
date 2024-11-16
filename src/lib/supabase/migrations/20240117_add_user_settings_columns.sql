-- Drop existing table if it exists
DROP TABLE IF EXISTS public.user_settings CASCADE;

-- Create user_settings table
CREATE TABLE public.user_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  tokens integer NOT NULL DEFAULT 10000,
  default_model text NOT NULL DEFAULT 'gpt-4',
  theme text NOT NULL DEFAULT 'system',
  save_history boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tokens_non_negative CHECK (tokens >= 0),
  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'system')),
  CONSTRAINT valid_model CHECK (default_model IN ('gpt-4', 'gpt-3.5-turbo'))
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Insert default settings for existing users
INSERT INTO public.user_settings (user_id)
SELECT id FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_settings WHERE user_settings.user_id = users.id
);