-- Enable realtime for prompts table
alter publication supabase_realtime add table prompts;

-- Add realtime security policies
create policy "Enable realtime for authenticated users"
on prompts
for select
to authenticated
using (
  auth.uid() = user_id
);

-- Enable row level security
alter table prompts enable row level security;