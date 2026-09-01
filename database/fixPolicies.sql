-- Drop existing policies
drop policy if exists "Anyone can view questions" on public.questions;

-- Create permissive policies
create policy "Allow all read on questions" on public.questions for select using (true);
create policy "Allow all insert on questions" on public.questions for insert with check (true);
create policy "Allow all update on questions" on public.questions for update using (true);
create policy "Allow all delete on questions" on public.questions for delete using (true);
