-- Add active_widgets column to user_settings
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS active_widgets JSONB DEFAULT '[]'::jsonb;
