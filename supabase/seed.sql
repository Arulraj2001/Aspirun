-- Aspirav Supabase Seed Script
-- Phase 3 Integration

-- ==========================================
-- 1. EXAMS AND CATEGORIES SEEDING
-- ==========================================

-- Insert Exam Categories
insert into public.exam_categories (id, name, slug, description, status)
values
  ('888e99ab-60a6-4be9-aa2b-b9ab5bcf65eb', 'Staff Selection Commission', 'ssc', 'All examinations conducted by the Staff Selection Commission.', 'active'),
  ('5a5d89ab-76f5-4293-86ab-dcd6be8bc5ea', 'Railway Recruitment Board', 'railway', 'Examinations conducted by Indian Railways.', 'active'),
  ('c22d7ad0-7a91-4cf1-8a9d-b8bc88b5e9ee', 'Police Recruitment Boards', 'police', 'Constable and SI written tests of various states.', 'active'),
  ('fb03e190-21a4-4f9e-a0db-bcd6f58bc7ea', 'Banking & Insurance', 'banking', 'IBPS, SBI, RBI recruitment examinations.', 'active'),
  ('e23a9ab0-bb7a-42cd-bf6b-dbdf6c23f18e', 'State PSC & General Exams', 'state-exams', 'State Public Service Commissions general aptitude papers.', 'active')
on conflict (id) do nothing;

-- Insert Exams
insert into public.exams (id, category_id, name, slug, description, eligibility, syllabus, exam_pattern, official_url, status)
values
  ('433a7ad1-77ad-4560-bf88-a739b8bc7e6a', '888e99ab-60a6-4be9-aa2b-b9ab5bcf65eb', 'SSC CGL', 'ssc-cgl', 'Staff Selection Commission Combined Graduate Level Examination.', 'Graduation in any stream.', 'Quant, Reasoning, English, General Awareness.', 'Tier-I (Objective), Tier-II (Computer Based Test).', 'https://ssc.gov.in', 'published'),
  ('b7c53d10-8b1b-4f51-b0db-bcf643f8e52e', '5a5d89ab-76f5-4293-86ab-dcd6be8bc5ea', 'Railway Group D', 'rrb-group-d', 'RRB Level 1 Track Maintainer and helper recruitments.', '10th standard pass or ITI.', 'General Science, Math, General Intelligence & GK.', 'Single CBT followed by Physical Efficiency Test.', 'https://indianrailways.gov.in', 'published'),
  ('da23e200-a49e-49b8-aa39-c5c8f18bc7e1', 'c22d7ad0-7a91-4cf1-8a9d-b8bc88b5e9ee', 'Police Constable', 'police-constable', 'State-wise police constable entry-level exams.', '12th standard pass.', 'Aptitude, reasoning, regional general knowledge.', 'Written test, physical screening, medical test.', '#', 'published')
on conflict (id) do nothing;

-- ==========================================
-- 2. SUBJECTS AND TOPICS SEEDING
-- ==========================================

-- Insert Subjects
insert into public.subjects (id, exam_id, name, slug)
values
  ('70b92f91-561b-4f32-84db-bd8bc78bca61', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', 'Quantitative Aptitude', 'maths'),
  ('70b92f91-561b-4f32-84db-bd8bc78bca62', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', 'Reasoning Ability', 'reasoning'),
  ('70b92f91-561b-4f32-84db-bd8bc78bca63', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', 'English Comprehension', 'english'),
  ('70b92f91-561b-4f32-84db-bd8bc78bca64', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', 'General Knowledge & Science', 'gk')
on conflict (id) do nothing;

-- Insert Topics
insert into public.topics (id, subject_id, name, slug)
values
  ('bcf82f10-77a8-4293-bcda-bc8bc7f8be5a', '70b92f91-561b-4f32-84db-bd8bc78bca61', 'Number Systems & Algebra', 'number-system'),
  ('bcf82f10-77a8-4293-bcda-bc8bc7f8be5b', '70b92f91-561b-4f32-84db-bd8bc78bca62', 'Puzzles & Syllogism', 'puzzles'),
  ('bcf82f10-77a8-4293-bcda-bc8bc7f8be5c', '70b92f91-561b-4f32-84db-bd8bc78bca64', 'Daily Current Affairs & GK', 'current-affairs')
on conflict (id) do nothing;

-- ==========================================
-- 3. STUDY PLAN SEEDING
-- ==========================================

-- Insert Study Plan
insert into public.study_plans (id, exam_id, title, slug, description, duration_days, level, language, is_free, is_paid, price, status)
values
  ('123e4567-e89b-12d3-a456-426614174000', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', 'Laxmikanth Indian Polity Crash Course', 'laxmikanth-polity', 'Targeted study plan to master Laxmikanth Indian Polity with chapters broken down into daily tasks.', 30, 'intermediate', 'English', true, false, 0.00, 'published')
on conflict (id) do nothing;

-- Insert Study Plan Days
insert into public.study_plan_days (id, study_plan_id, day_number, week_number, title, description, estimated_study_time, revision_notes)
values
  ('223e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 1, 1, 'Making of the Constitution', 'Learn how the constitution was formed and read background historical acts.', '2 hours', 'Revise Charter Acts (1773-1853) and Government of India Acts (1858-1947).')
on conflict (id) do nothing;

-- ==========================================
-- 4. MATERIALS & MOCKS SEEDING
-- ==========================================

-- Insert Materials
insert into public.materials (id, title, slug, exam_id, subject_id, topic_id, type, content, pdf_url, video_url, language, is_free, is_paid, price, status)
values
  ('323e4567-e89b-12d3-a456-426614174002', 'Historical Background & Acts notes', 'historical-background-notes', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', '70b92f91-561b-4f32-84db-bd8bc78bca64', 'bcf82f10-77a8-4293-bcda-bc8bc7f8be5c', 'pdf', 'This note covers Regulating Act 1773, Pitts India Act 1784, and Charter Acts.', '#', null, 'English', true, false, 0.00, 'published')
on conflict (id) do nothing;

-- Insert Mock Tests
insert into public.mock_tests (id, title, slug, exam_id, subject_id, test_type, duration_minutes, total_questions, total_marks, language, is_free, is_paid, price, status)
values
  ('423e4567-e89b-12d3-a456-426614174003', 'Polity Day 1 Sectional Quiz', 'polity-day1-quiz', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', '70b92f91-561b-4f32-84db-bd8bc78bca64', 'sectional', 15, 10, 20.00, 'English', true, false, 0.00, 'published')
on conflict (id) do nothing;

-- Insert Study Plan Tasks
insert into public.study_plan_tasks (id, study_plan_day_id, title, description, task_type, material_id, mock_test_id, estimated_minutes, sort_order)
values
  ('523e4567-e89b-12d3-a456-426614174004', '223e4567-e89b-12d3-a456-426614174001', 'Read Making of Constitution notes', 'Read the compiled notes detailing committee formations and members.', 'read', '323e4567-e89b-12d3-a456-426614174002', null, 45, 1),
  ('523e4567-e89b-12d3-a456-426614174005', '223e4567-e89b-12d3-a456-426614174001', 'Attempt Polity Day 1 Quiz', 'Test your knowledge on historical acts using standard multiple-choice questions.', 'mock', null, '423e4567-e89b-12d3-a456-426614174003', 15, 2)
on conflict (id) do nothing;

-- ==========================================
-- 5. SECURE COMMUNITY FORUMS SEEDING
-- ==========================================

-- Insert Community Categories
insert into public.community_categories (id, exam_id, name, slug, description, rules, status)
values
  ('623e4567-e89b-12d3-a456-426614174006', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', 'Maths Doubts', 'maths-doubts', 'Post quantitative aptitude equations and shortcuts.', 'Only academic quantitative questions allowed.', 'active'),
  ('623e4567-e89b-12d3-a456-426614174007', '433a7ad1-77ad-4560-bf88-a739b8bc7e6a', 'GK & Current Affairs', 'gk-ca', 'Discuss daily national events, economy, and general science updates.', 'No political debates or cut-off speculations.', 'active'),
  ('623e4567-e89b-12d3-a456-426614174008', null, 'Preparation Strategy', 'strategy', 'Ask guidance regarding daily target completions, book lists, and revision schedules.', 'Keep strategy guides honest and serious.', 'active')
on conflict (id) do nothing;
