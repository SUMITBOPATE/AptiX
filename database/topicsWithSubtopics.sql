-- Drop existing topics table if any
drop table if exists public.topics;

-- Create topics table (for both categories and subtopics)
create table public.topics (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  icon text,
  description text,
  estimated_time text,
  question_count int default 0,
  parent_slug text, -- for subtopics, reference to parent category
  is_category boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.topics enable row level security;

-- Allow public read
create policy "Anyone can view topics" on public.topics for select using (true);

-- Insert categories (main topics)
insert into topics (name, slug, icon, description, question_count, is_category) values
('Quantitative Aptitude', 'quantitative-aptitude', '📊', 'Master numerical and mathematical reasoning skills', 500, true),
('Logical Reasoning', 'logical-reasoning', '🧠', 'Develop logical thinking and analytical problem-solving', 400, true),
('Verbal Ability', 'verbal-ability', '📝', 'Enhance language skills and reading comprehension', 450, true),
('Mock Tests', 'mock-tests', '🎯', 'Complete exam simulation with all topics combined', 1000, true);

-- Insert Quantitative Aptitude subtopics
insert into topics (name, slug, icon, description, estimated_time, question_count, parent_slug, is_category) values
('Percentages', 'percentages', '%', 'Master percentage calculations and real-world applications', '30 min', 50, 'quantitative-aptitude', false),
('Profit & Loss', 'profit-loss', '💰', 'Business mathematics and trading profit/loss concepts', '45 min', 40, 'quantitative-aptitude', false),
('Simple Interest', 'simple-interest', '🏦', 'Interest calculations and basic financial mathematics', '25 min', 30, 'quantitative-aptitude', false),
('Time & Work', 'time-work', '⏰', 'Work efficiency and collaborative task completion', '40 min', 35, 'quantitative-aptitude', false),
('Ratios & Proportions', 'ratios-proportions', '⚖️', 'Ratio calculations and proportional relationships', '35 min', 35, 'quantitative-aptitude', false);

-- Insert Logical Reasoning subtopics
insert into topics (name, slug, icon, description, estimated_time, question_count, parent_slug, is_category) values
('Series Completion', 'series-completion', '🔢', 'Identify patterns in number and letter sequences', '25 min', 35, 'logical-reasoning', false),
('Coding-Decoding', 'coding-decoding', '🔐', 'Crack codes and decode hidden patterns', '30 min', 40, 'logical-reasoning', false),
('Blood Relations', 'blood-relations', '👨‍👩‍👧‍👦', 'Solve family relationship and kinship problems', '25 min', 30, 'logical-reasoning', false),
('Direction Sense', 'direction-sense', '🧭', 'Master spatial reasoning and direction finding', '20 min', 25, 'logical-reasoning', false),
('Logical Puzzles', 'logical-puzzles', '🧩', 'Challenge yourself with brain teasers and logic puzzles', '45 min', 30, 'logical-reasoning', false);

-- Insert Verbal Ability subtopics
insert into topics (name, slug, icon, description, estimated_time, question_count, parent_slug, is_category) values
('Synonyms & Antonyms', 'synonyms-antonyms', '📚', 'Build vocabulary with word relationships and meanings', '20 min', 50, 'verbal-ability', false),
('Sentence Correction', 'sentence-correction', '✏️', 'Master grammar rules and sentence structure', '25 min', 45, 'verbal-ability', false),
('Reading Comprehension', 'reading-comprehension', '📖', 'Improve text analysis and understanding skills', '60 min', 25, 'verbal-ability', false),
('Fill in the Blanks', 'fill-in-blanks', '📝', 'Complete sentences with appropriate words or phrases', '15 min', 50, 'verbal-ability', false),
('Para Jumbles', 'para-jumbles', '🔀', 'Arrange jumbled sentences in logical order', '30 min', 35, 'verbal-ability', false);

-- Insert Mock Tests subtopics
insert into topics (name, slug, icon, description, estimated_time, question_count, parent_slug, is_category) values
('Full Mock Tests', 'full-mock-tests', '📋', 'Complete aptitude tests covering all subjects', '90 min', 100, 'mock-tests', false);
