-- ==========================================
-- Migration 001: Profile, Blog, Current Affairs Enhancements
-- Run this in the Supabase SQL Editor to apply missing columns
-- ==========================================

-- 1. Add missing fields to profiles table
alter table public.profiles 
  add column if not exists state text,
  add column if not exists date_of_birth date,
  add column if not exists preferred_language text not null default 'Hindi',
  add column if not exists bio text,
  add column if not exists social_links jsonb default '{}';

-- 2. Add missing fields to blogs table  
alter table public.blogs
  add column if not exists excerpt text,
  add column if not exists cover_image_url text,
  add column if not exists tags text[] default '{}',
  add column if not exists read_time_minutes integer not null default 5,
  add column if not exists views integer not null default 0,
  add column if not exists meta_description text,
  add column if not exists meta_keywords text[];

-- 3. Add missing fields to current_affairs table
alter table public.current_affairs
  add column if not exists image_url text,
  add column if not exists source_url text,
  add column if not exists tags text[] default '{}',
  add column if not exists views integer not null default 0,
  add column if not exists meta_description text;

-- 4. Add missing fields to exams table
alter table public.exams
  add column if not exists cover_image_url text,
  add column if not exists notification_date date,
  add column if not exists exam_date date,
  add column if not exists vacancies integer,
  add column if not exists age_limit text,
  add column if not exists meta_description text;

-- 5. Add missing fields to materials table
alter table public.materials
  add column if not exists cover_image_url text,
  add column if not exists tags text[] default '{}',
  add column if not exists download_count integer not null default 0,
  add column if not exists views integer not null default 0,
  add column if not exists author_name text,
  add column if not exists meta_description text;

-- 6. Add missing fields to study_plans table
alter table public.study_plans
  add column if not exists cover_image_url text,
  add column if not exists tags text[] default '{}',
  add column if not exists enrolled_count integer not null default 0,
  add column if not exists meta_description text;

-- 7. Add missing fields to mock_tests table
alter table public.mock_tests
  add column if not exists description text,
  add column if not exists instructions text,
  add column if not exists passing_marks numeric(10, 2),
  add column if not exists tags text[] default '{}';

-- 8. Add notification_preferences to profiles (JSON column)
alter table public.profiles
  add column if not exists notification_preferences jsonb not null default '{"email_checklist": true, "forum_replies": true, "mock_results": true}';

-- 9. Update handle_new_user trigger to include new fields
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
    state,
    qualification,
    preferred_language,
    target_exam_id,
    role, 
    community_status,
    notification_preferences
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substring(new.id::text from 1 for 8)),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'qualification',
    coalesce(new.raw_user_meta_data->>'preferred_language', 'Hindi'),
    case 
      when (new.raw_user_meta_data->>'target_exam_id') = 'exam-ssc' 
      then '433a7ad1-77ad-4560-bf88-a739b8bc7e6a'::uuid
      when (new.raw_user_meta_data->>'target_exam_id') = 'exam-upsc' 
      then '123e4567-e89b-12d3-a456-426614174000'::uuid
      when (new.raw_user_meta_data->>'target_exam_id') = 'exam-rrb' 
      then 'b7c53d10-8b1b-4f51-b0db-bcf643f8e52e'::uuid
      when (new.raw_user_meta_data->>'target_exam_id') = 'exam-ibps' 
      then 'cb03e190-21a4-4f9e-a0db-bcd6f58bc7ea'::uuid
      when (new.raw_user_meta_data->>'target_exam_id') ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
      then (new.raw_user_meta_data->>'target_exam_id')::uuid
      else null 
    end,
    'student',
    'active',
    '{"email_checklist": true, "forum_replies": true, "mock_results": true}'::jsonb
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 10. Add RLS policy for student to update own notification_preferences
-- (already covered by existing "Allow users to update own profile" policy)

-- 11. Create indexes for common query patterns
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_community_status on public.profiles(community_status);
create index if not exists idx_profiles_target_exam_id on public.profiles(target_exam_id);
create index if not exists idx_blogs_status on public.blogs(status);
create index if not exists idx_blogs_category on public.blogs(category);
create index if not exists idx_current_affairs_date on public.current_affairs(date desc);
create index if not exists idx_current_affairs_status on public.current_affairs(status);
create index if not exists idx_materials_type on public.materials(type);
create index if not exists idx_materials_exam_id on public.materials(exam_id);
create index if not exists idx_mock_tests_exam_id on public.mock_tests(exam_id);
create index if not exists idx_student_plan_enrollments_student on public.student_plan_enrollments(student_id);
create index if not exists idx_student_task_progress_student on public.student_task_progress(student_id);
create index if not exists idx_test_results_user on public.test_results(user_id);
create index if not exists idx_payment_requests_user on public.payment_requests(user_id);
create index if not exists idx_payment_requests_status on public.payment_requests(status);

-- Done!
