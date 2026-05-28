CREATE TABLE IF NOT EXISTS public.email_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  name text,
  source text DEFAULT 'waitlist',
  sequence_index int NOT NULL,
  send_at timestamptz NOT NULL,
  sent boolean DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source text DEFAULT 'waitlist';
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
