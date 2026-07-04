-- Aspirav Supabase PostgreSQL Schema Definition
-- Phase 3 Integration

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. PROFILE AND CORE SCHEMAS
-- ==========================================

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  username text unique,
  email text,
  phone text,
  city text,
  qualification text,
  target_exam_id uuid, -- bound to exams later
  role text not null default 'student' check (role in ('student', 'admin', 'moderator', 'content_creator')),
  avatar_url text,
  community_status text not null default 'active' check (community_status in ('active', 'muted', 'banned')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.exam_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  status text not null default 'active' check (status in ('active', 'inactive'))
);

create table public.exams (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.exam_categories on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  eligibility text,
  syllabus text,
  exam_pattern text,
  official_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bind target_exam_id in profiles to exams table
alter table public.profiles add constraint fk_target_exam foreign key (target_exam_id) references public.exams(id) on delete set null;

create table public.subjects (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams on delete cascade,
  name text not null,
  slug text not null
);

create table public.topics (
  id uuid default gen_random_uuid() primary key,
  subject_id uuid references public.subjects on delete cascade,
  name text not null,
  slug text not null
);

-- ==========================================
-- 2. STUDY PLAN SCHEMAS
-- ==========================================

create table public.study_plans (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams on delete cascade not null,
  title text not null,
  slug text unique not null,
  description text,
  duration_days integer not null check (duration_days > 0),
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  language text not null default 'English',
  is_free boolean not null default true,
  is_paid boolean not null default false,
  price numeric(10, 2) default 0.00,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.study_plan_days (
  id uuid default gen_random_uuid() primary key,
  study_plan_id uuid references public.study_plans on delete cascade not null,
  day_number integer not null check (day_number > 0),
  week_number integer not null check (week_number > 0),
  title text not null,
  description text,
  estimated_study_time text,
  revision_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.materials (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  exam_id uuid references public.exams on delete set null,
  subject_id uuid references public.subjects on delete set null,
  topic_id uuid references public.topics on delete set null,
  type text not null check (type in ('article', 'pdf', 'notes', 'formula_sheet', 'practice_set', 'video')),
  content text,
  pdf_url text,
  video_url text,
  language text not null default 'English',
  is_free boolean not null default true,
  is_paid boolean not null default false,
  price numeric(10, 2) default 0.00,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.mock_tests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  exam_id uuid references public.exams on delete cascade not null,
  subject_id uuid references public.subjects on delete set null,
  test_type text not null default 'full' check (test_type in ('daily', 'topic', 'sectional', 'mini', 'full')),
  duration_minutes integer not null check (duration_minutes > 0),
  total_questions integer not null check (total_questions > 0),
  total_marks numeric(10, 2) not null check (total_marks > 0),
  language text not null default 'English',
  is_free boolean not null default true,
  is_paid boolean not null default false,
  price numeric(10, 2) default 0.00,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.study_plan_tasks (
  id uuid default gen_random_uuid() primary key,
  study_plan_day_id uuid references public.study_plan_days on delete cascade not null,
  title text not null,
  description text,
  task_type text not null default 'read' check (task_type in ('read', 'practice', 'quiz', 'mock', 'revision', 'community', 'custom')),
  material_id uuid references public.materials on delete set null,
  mock_test_id uuid references public.mock_tests on delete set null,
  estimated_minutes integer not null default 30 check (estimated_minutes > 0),
  sort_order integer not null default 1
);

create table public.student_plan_enrollments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  study_plan_id uuid references public.study_plans on delete cascade not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  current_day integer not null default 1 check (current_day > 0)
);

create table public.student_task_progress (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  study_plan_task_id uuid references public.study_plan_tasks on delete cascade not null,
  is_completed boolean not null default false,
  completed_at timestamp with time zone
);

create table public.material_downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  material_id uuid references public.materials on delete cascade not null,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. ASSESSMENT SCHEMAS (QUESTIONS & RESULTS)
-- ==========================================

create table public.questions (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams on delete set null,
  subject_id uuid references public.subjects on delete set null,
  topic_id uuid references public.topics on delete set null,
  question_text text not null,
  question_text_hi text, -- Hindi text translation
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text,
  explanation_hi text,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  marks numeric(5, 2) not null default 2.00,
  negative_marks numeric(5, 2) not null default 0.50,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.mock_test_questions (
  id uuid default gen_random_uuid() primary key,
  mock_test_id uuid references public.mock_tests on delete cascade not null,
  question_id uuid references public.questions on delete cascade not null,
  sort_order integer not null default 1
);

create table public.test_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mock_test_id uuid references public.mock_tests on delete cascade not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  submitted_at timestamp with time zone,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted', 'auto_submitted'))
);

create table public.test_answers (
  id uuid default gen_random_uuid() primary key,
  attempt_id uuid references public.test_attempts on delete cascade not null,
  question_id uuid references public.questions on delete cascade not null,
  selected_option text check (selected_option in ('A', 'B', 'C', 'D')),
  is_marked_review boolean not null default false,
  is_correct boolean,
  marks_awarded numeric(5, 2)
);

create table public.test_results (
  id uuid default gen_random_uuid() primary key,
  attempt_id uuid references public.test_attempts on delete cascade unique not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mock_test_id uuid references public.mock_tests on delete cascade not null,
  score numeric(10, 2) not null default 0.00,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  skipped_count integer not null default 0,
  accuracy numeric(5, 2) not null default 0.00, -- percentage
  time_taken_seconds integer not null default 0,
  weak_topics jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. GUIDANCE & CURRENT AFFAIRS SCHEMAS
-- ==========================================

create table public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  content text not null,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.current_affairs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  date date not null default current_date,
  category text not null,
  content text not null,
  important_points text[],
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.daily_quizzes (
  id uuid default gen_random_uuid() primary key,
  date date not null unique default current_date,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published'))
);

create table public.daily_quiz_questions (
  id uuid default gen_random_uuid() primary key,
  daily_quiz_id uuid references public.daily_quizzes on delete cascade not null,
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text
);

-- ==========================================
-- 5. SECURE COMMUNITY FORUMS
-- ==========================================

create table public.community_categories (
  id uuid default gen_random_uuid() primary key,
  exam_id uuid references public.exams on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  rules text,
  status text not null default 'active' check (status in ('active', 'inactive'))
);

create table public.community_threads (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.community_categories on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  content text not null,
  thread_type text not null default 'doubt' check (thread_type in ('doubt', 'strategy', 'mock_discussion', 'materials', 'progress', 'general')),
  status text not null default 'active' check (status in ('active', 'locked', 'hidden', 'deleted')),
  is_solved boolean not null default false,
  is_pinned boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.community_replies (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references public.community_threads on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null,
  status text not null default 'active' check (status in ('active', 'hidden', 'deleted')),
  is_helpful boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.community_reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles(id) on delete set null,
  content_type text not null check (content_type in ('thread', 'reply', 'user')),
  content_id uuid not null, -- references thread or reply or user id
  reason text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.community_rules_acceptance (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique not null,
  accepted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.community_bans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  ban_type text not null check (ban_type in ('mute', 'temporary_ban', 'permanent_ban')),
  starts_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ends_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null
);

-- ==========================================
-- 6. E-COMMERCE & ADMINISTRATION SCHEMAS
-- ==========================================

create table public.payment_settings (
  id uuid default gen_random_uuid() primary key,
  payment_mode text not null default 'off' check (payment_mode in ('on', 'off')),
  upi_id text,
  upi_name text,
  qr_code_url text,
  payment_instructions text,
  support_whatsapp text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_type text not null check (content_type in ('plan', 'material', 'mock_test')),
  content_id uuid not null, -- references study plan, mock test or material id
  amount numeric(10, 2) not null check (amount >= 0),
  upi_transaction_id text not null unique,
  screenshot_url text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_content_access (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_type text not null check (content_type in ('plan', 'material', 'mock_test')),
  content_id uuid not null,
  granted_by uuid references public.profiles(id) on delete set null,
  granted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, content_type, content_id)
);

create table public.admin_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 7. DATABASE PROCEDURES AND TRIGGERS
-- ==========================================

-- Trigger to sync updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Apply updated_at handles to core models
create trigger tr_profiles_updated before update on public.profiles for each row execute procedure public.handle_updated_at();
create trigger tr_exams_updated before update on public.exams for each row execute procedure public.handle_updated_at();
create trigger tr_study_plans_updated before update on public.study_plans for each row execute procedure public.handle_updated_at();
create trigger tr_materials_updated before update on public.materials for each row execute procedure public.handle_updated_at();
create trigger tr_blogs_updated before update on public.blogs for each row execute procedure public.handle_updated_at();
create trigger tr_current_affairs_updated before update on public.current_affairs for each row execute procedure public.handle_updated_at();
create trigger tr_community_threads_updated before update on public.community_threads for each row execute procedure public.handle_updated_at();
create trigger tr_community_replies_updated before update on public.community_replies for each row execute procedure public.handle_updated_at();
create trigger tr_payment_settings_updated before update on public.payment_settings for each row execute procedure public.handle_updated_at();

-- Trigger to sync auth.users inserts to profiles table automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    username,
    email, 
    phone,
    city,
    qualification,
    target_exam_id,
    role, 
    community_status
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substring(new.id::text from 1 for 8)),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'qualification',
    case 
      when (new.raw_user_meta_data->>'target_exam_id') = 'exam-ssc' 
      then '433a7ad1-77ad-4560-bf88-a739b8bc7e6a'::uuid
      when (new.raw_user_meta_data->>'target_exam_id') = 'exam-rrb' 
      then 'b7c53d10-8b1b-4f51-b0db-bcf643f8e52e'::uuid
      when (new.raw_user_meta_data->>'target_exam_id') ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      then (new.raw_user_meta_data->>'target_exam_id')::uuid
      else null 
    end,
    'student',
    'active'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to automatically confirm email addresses upon registration (avoids pending verification lock)
create or replace function public.auto_confirm_user_email()
returns trigger as $$
begin
  new.email_confirmed_at := now();
  new.confirmed_at := now();
  return new;
end;
$$ language plpgsql security definer;

create trigger tr_auto_confirm_user_email
  before insert on auth.users
  for each row execute procedure public.auto_confirm_user_email();

-- Post moderation validation function
-- Prevents muted or banned profiles from inserting threads/replies
create or replace function public.validate_posting_privilege()
returns trigger as $$
declare
  usr_status text;
  ban_exists boolean;
begin
  -- Fetch basic profile status
  select community_status into usr_status
  from public.profiles
  where id = auth.uid();

  if usr_status = 'banned' then
    raise exception 'Posting Denied: Your account is permanently banned due to community guideline violations.';
  end if;

  -- Check if user is currently muted/suspended
  select exists (
    select 1
    from public.community_bans
    where user_id = auth.uid()
      and ban_type in ('mute', 'temporary_ban')
      and starts_at <= now()
      and (ends_at is null or ends_at > now())
  ) into ban_exists;

  if ban_exists or usr_status = 'muted' then
    raise exception 'Posting Denied: Your account posting access is muted temporarily.';
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Apply posting checks triggers
create trigger tr_check_thread_privilege
  before insert on public.community_threads
  for each row execute procedure public.validate_posting_privilege();

create trigger tr_check_reply_privilege
  before insert on public.community_replies
  for each row execute procedure public.validate_posting_privilege();


-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.exam_categories enable row level security;
alter table public.exams enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.study_plans enable row level security;
alter table public.study_plan_days enable row level security;
alter table public.study_plan_tasks enable row level security;
alter table public.materials enable row level security;
alter table public.mock_tests enable row level security;
alter table public.questions enable row level security;
alter table public.mock_test_questions enable row level security;
alter table public.student_plan_enrollments enable row level security;
alter table public.student_task_progress enable row level security;
alter table public.material_downloads enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security;
alter table public.test_results enable row level security;
alter table public.blogs enable row level security;
alter table public.current_affairs enable row level security;
alter table public.daily_quizzes enable row level security;
alter table public.daily_quiz_questions enable row level security;
alter table public.community_categories enable row level security;
alter table public.community_threads enable row level security;
alter table public.community_replies enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_rules_acceptance enable row level security;
alter table public.community_bans enable row level security;
alter table public.payment_settings enable row level security;
alter table public.payment_requests enable row level security;
alter table public.user_content_access enable row level security;
alter table public.admin_logs enable row level security;

-- Setup policy rules

-- 8.1 Public Catalogs (Read All, Write Admin only)
create policy "Allow public read-only for exams categories" on public.exam_categories for select using (true);
create policy "Allow public read-only for published exams" on public.exams for select using (status = 'published');
create policy "Allow public read-only for subjects" on public.subjects for select using (true);
create policy "Allow public read-only for topics" on public.topics for select using (true);

create policy "Allow public read-only for published plans" on public.study_plans for select using (status = 'published');
create policy "Allow public read-only for plan days" on public.study_plan_days for select using (true);
create policy "Allow public read-only for plan tasks" on public.study_plan_tasks for select using (true);

create policy "Allow public read-only for published materials" on public.materials for select using (status = 'published');
create policy "Allow public read-only for published mock tests" on public.mock_tests for select using (status = 'published');
create policy "Allow public read-only for questions" on public.questions for select using (status = 'published');
create policy "Allow public read-only for mock test questions" on public.mock_test_questions for select using (true);

create policy "Allow public read-only for published blogs" on public.blogs for select using (status = 'published');
create policy "Allow public read-only for published current affairs" on public.current_affairs for select using (status = 'published');
create policy "Allow public read-only for published daily quizzes" on public.daily_quizzes for select using (status = 'published');
create policy "Allow public read-only for daily quiz questions" on public.daily_quiz_questions for select using (true);

create policy "Allow public read-only for active community categories" on public.community_categories for select using (status = 'active');

-- 8.2 Profiles Table (Anyone can read, Owner can write/update)
create policy "Allow anyone to view profiles" on public.profiles for select using (true);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);

-- 8.3 Student Personal Checkpoints (Owner reads & writes)
create policy "Allow students to view own enrollments" on public.student_plan_enrollments for select using (auth.uid() = student_id);
create policy "Allow students to enroll in plans" on public.student_plan_enrollments for insert with check (auth.uid() = student_id);
create policy "Allow students to update own enrollment" on public.student_plan_enrollments for update using (auth.uid() = student_id);

create policy "Allow students to view own task progress" on public.student_task_progress for select using (auth.uid() = student_id);
create policy "Allow students to track task progress" on public.student_task_progress for insert with check (auth.uid() = student_id);
create policy "Allow students to update own progress" on public.student_task_progress for update using (auth.uid() = student_id);

create policy "Allow students to view own material downloads log" on public.material_downloads for select using (auth.uid() = user_id);
create policy "Allow students to log material downloads" on public.material_downloads for insert with check (auth.uid() = user_id);

create policy "Allow students to view own test attempts" on public.test_attempts for select using (auth.uid() = user_id);
create policy "Allow students to start test attempts" on public.test_attempts for insert with check (auth.uid() = user_id);
create policy "Allow students to update own attempt state" on public.test_attempts for update using (auth.uid() = user_id);

create policy "Allow students to view own submitted answers" on public.test_answers for select using (
  exists (select 1 from public.test_attempts where id = attempt_id and user_id = auth.uid())
);
create policy "Allow students to submit test answers" on public.test_answers for insert with check (
  exists (select 1 from public.test_attempts where id = attempt_id and user_id = auth.uid())
);

create policy "Allow students to view own test results" on public.test_results for select using (auth.uid() = user_id);
create policy "Allow students to post own test results" on public.test_results for insert with check (auth.uid() = user_id);

-- 8.4 Secure Community Forums (Authenticated reads & writes, owner updates)
create policy "Allow anyone to view active community threads" on public.community_threads for select using (status = 'active' or status = 'locked');
create policy "Allow authenticated users to post doubts threads" on public.community_threads for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);
create policy "Allow authors to update own threads" on public.community_threads for update using (auth.uid() = user_id);

create policy "Allow anyone to view active community replies" on public.community_replies for select using (status = 'active');
create policy "Allow authenticated users to post replies" on public.community_replies for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);
create policy "Allow authors to update own replies" on public.community_replies for update using (auth.uid() = user_id);

create policy "Allow students to submit community reports" on public.community_reports for insert with check (auth.role() = 'authenticated' and auth.uid() = reporter_id);
create policy "Allow students to view own reported items" on public.community_reports for select using (auth.uid() = reporter_id);

create policy "Allow students to accept community guidelines" on public.community_rules_acceptance for insert with check (auth.uid() = user_id);
create policy "Allow students to check own guidelines status" on public.community_rules_acceptance for select using (auth.uid() = user_id);

-- 8.5 E-Commerce purchases
create policy "Allow public to read payment instructions" on public.payment_settings for select using (true);

create policy "Allow students to file payment requests" on public.payment_requests for insert with check (auth.uid() = user_id);
create policy "Allow students to track own payments status" on public.payment_requests for select using (auth.uid() = user_id);

create policy "Allow students to view own content unlock keys" on public.user_content_access for select using (auth.uid() = user_id);

-- 8.6 Admin and Moderator absolute bypasses
create policy "Admins have absolute write bypass on exam categories" on public.exam_categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on exams" on public.exams for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on subjects" on public.subjects for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on topics" on public.topics for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on plans" on public.study_plans for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on plan days" on public.study_plan_days for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on plan tasks" on public.study_plan_tasks for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on materials" on public.materials for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on mock tests" on public.mock_tests for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on questions" on public.questions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins have absolute write bypass on mock test questions" on public.mock_test_questions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "Admins and Moderators have audit accesses on community threads" on public.community_threads for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
create policy "Admins and Moderators have audit accesses on community replies" on public.community_replies for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
create policy "Admins and Moderators have audit accesses on community reports" on public.community_reports for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
create policy "Admins and Moderators can manage community bans" on public.community_bans for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);

create policy "Admins can manage payment configurations" on public.payment_settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage payment approval requests" on public.payment_requests for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage user content access records" on public.user_content_access for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can manage admin logs" on public.admin_logs for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
