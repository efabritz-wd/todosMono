-- Create the todos table
CREATE TABLE IF NOT EXISTS public.todos (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    text TEXT,
    user_auth_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own todos" 
ON public.todos FOR INSERT 
WITH CHECK (auth.uid() = user_auth_id);

CREATE POLICY "Users can view their own todos" 
ON public.todos FOR SELECT 
USING (auth.uid() = user_auth_id);

CREATE POLICY "Users can update their own todos" 
ON public.todos FOR UPDATE 
USING (auth.uid() = user_auth_id)
WITH CHECK (auth.uid() = user_auth_id);

CREATE POLICY "Users can delete their own todos" 
ON public.todos FOR DELETE 
USING (auth.uid() = user_auth_id);

-- Enable Realtime for the todos table
ALTER PUBLICATION supabase_realtime ADD TABLE public.todos;
