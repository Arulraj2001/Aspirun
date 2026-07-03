export interface Exam {
  id: string;
  name: string;
  code: string; // e.g. "UPSC-CSE", "SSC-CGL"
  description: string;
  slug: string;
  activePlansCount: number;
  eligibility?: string;
  syllabus?: string;
  exam_pattern?: string;
  official_url?: string;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface StudyPlan {
  id: string;
  examId: string;
  title: string;
  slug?: string;
  description: string;
  durationDays: number;
  enrolledCount: number;
  rating: number;
  difficulty: Difficulty;
  isFree: boolean;
  tasksCount?: number;
  mocksCount?: number;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  planId: string;
  dayNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  status: TaskStatus;
  category: 'Quant' | 'Reasoning' | 'English' | 'GK' | 'General Studies';
  materialId?: string;
  mockTestId?: string;
}

export type MaterialCategory = 'Article' | 'PDF' | 'Notes' | 'Formula sheet' | 'Practice set' | 'Video';

export interface StudyMaterial {
  id: string;
  examId: string;
  title: string;
  category: MaterialCategory;
  sizeOrDuration: string; // e.g., "2.4 MB" or "45 mins"
  url: string; // pdf download link (e.g. from Supabase Storage)
  isFree: boolean;
  subject: string;
  downloadCount: number;
  slug?: string;
  content?: string;
  videoUrl?: string;
  language?: string;
  price?: number;
  status?: 'published' | 'draft';
  topic?: string;
  updatedAt?: string;
}

export interface MockTest {
  id: string;
  examId: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  difficulty: Difficulty;
  subject: string;
  isFree: boolean;
  slug?: string;
  testType?: 'daily' | 'topic' | 'sectional' | 'mini' | 'full';
  language?: string;
  price?: number;
  status?: 'published' | 'draft';
  negativeMarking?: number;
  questions?: string[]; // Question IDs list
}

export interface MockResult {
  id: string;
  mockTestId: string;
  mockTestTitle: string;
  score: number;
  totalMarks: number;
  accuracy: number; // percentage
  percentile: number;
  timeTakenMinutes: number;
  dateAttempted: string;
  rank: string; // e.g., "124/1580"
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export interface CurrentAffairsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: 'National' | 'International' | 'Economy' | 'Science & Tech' | 'Sports';
  slug?: string;
}

export type UserRole = 'Student' | 'New User' | 'Admin' | 'Moderator';

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  date: string;
  upvotes: number;
  repliesCount: number;
  reportsCount: number;
  isLocked: boolean;
  isPinned: boolean;
  hasUpvoted?: boolean;
  isSolved?: boolean;
  followers?: string[];
}

export interface CommunityReply {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  date: string;
  upvotes: number;
  reportsCount: number;
  hasUpvoted?: boolean;
  isHelpful?: boolean;
}

export interface Question {
  id: string;
  examId: string;
  subject: string;
  topic?: string;
  questionText: string;
  questionTextHindi?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  explanationHindi?: string;
  difficulty: Difficulty;
  marks: number;
  negativeMarks: number;
  status: 'published' | 'draft';
}
