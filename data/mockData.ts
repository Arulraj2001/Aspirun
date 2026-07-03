import {
  Exam,
  StudyPlan,
  Task,
  StudyMaterial,
  MockTest,
  MockResult,
  BlogPost,
  CurrentAffairsItem,
  CommunityPost,
  CommunityReply
} from '@/types';

export const mockExams: Exam[] = [
  {
    id: 'exam-upsc',
    name: 'UPSC Civil Services Examination',
    code: 'UPSC-CSE',
    description: 'India\'s premier civil services exam. Covers History, Geography, Polity, Economy, and Current Affairs.',
    slug: 'upsc-cse',
    activePlansCount: 2
  },
  {
    id: 'exam-ssc',
    name: 'SSC Combined Graduate Level',
    code: 'SSC-CGL',
    description: 'Staff Selection Commission recruitment for Group B & C posts. Covers Quant, Reasoning, English, and General Awareness.',
    slug: 'ssc-cgl',
    activePlansCount: 3
  },
  {
    id: 'exam-rrb',
    name: 'RRB Non-Technical Popular Categories',
    code: 'RRB-NTPC',
    description: 'Railway Recruitment Board jobs in technical and non-technical cadres. Focuses on General Awareness and Math.',
    slug: 'rrb-ntpc',
    activePlansCount: 1
  },
  {
    id: 'exam-ibps',
    name: 'IBPS Probationary Officer',
    code: 'IBPS-PO',
    description: 'Institute of Banking Personnel Selection recruitment for officers in public sector banks. Focuses on Aptitude and English.',
    slug: 'ibps-po',
    activePlansCount: 2
  },
  {
    id: 'exam-police',
    name: 'State Police Constable Exam',
    code: 'POLICE-CONSTABLE',
    description: 'State-wise police recruitment boards tests. Focuses on general awareness, basic math, reasoning, and regional GK.',
    slug: 'police-constable',
    activePlansCount: 1
  },
  {
    id: 'exam-bank-clerk',
    name: 'IBPS Clerk & Banking Clerical',
    code: 'BANK-CLERK',
    description: 'Common recruitment processes for banking clerical cadre positions. Focuses on quant, reasoning, and English.',
    slug: 'bank-clerk',
    activePlansCount: 1
  }
];

export const mockPlans: StudyPlan[] = [
  {
    id: 'plan-upsc-prelims-90',
    examId: 'exam-upsc',
    title: '90-Day UPSC Prelims GS Master Plan',
    description: 'Comprehensive day-by-day static syllabus coverage & current affairs revision targeting GS Paper 1.',
    durationDays: 90,
    enrolledCount: 12450,
    rating: 4.8,
    difficulty: 'Hard',
    isFree: true
  },
  {
    id: 'plan-upsc-polity-30',
    examId: 'exam-upsc',
    title: '30-Day Laxmikanth Indian Polity Crash Course',
    description: 'Targeted study plan to master Laxmikanth Indian Polity with chapters broken down into daily tasks.',
    durationDays: 30,
    enrolledCount: 8900,
    rating: 4.9,
    difficulty: 'Medium',
    isFree: true
  },
  {
    id: 'plan-ssc-quant-45',
    examId: 'exam-ssc',
    title: '45-Day SSC CGL Quant & Arithmetic Booster',
    description: 'Master advanced and arithmetic mathematics with short tricks, shortcuts, and selected practice questions.',
    durationDays: 45,
    enrolledCount: 18200,
    rating: 4.7,
    difficulty: 'Medium',
    isFree: true
  },
  {
    id: 'plan-ssc-cgl-complete-120',
    examId: 'exam-ssc',
    title: '120-Day SSC CGL Tier 1 & 2 Complete Plan',
    description: 'All 4 sections (Quant, Reasoning, English, General Awareness) structured daily with tests and materials.',
    durationDays: 120,
    enrolledCount: 24600,
    rating: 4.6,
    difficulty: 'Hard',
    isFree: false
  },
  {
    id: 'plan-rrb-ntpc-60',
    examId: 'exam-rrb',
    title: '60-Day RRB NTPC General Awareness Mastery',
    description: 'Focuses heavily on general science, history, geography, railway history, and static GK.',
    durationDays: 60,
    enrolledCount: 15400,
    rating: 4.5,
    difficulty: 'Easy',
    isFree: true
  },
  {
    id: 'plan-ibps-po-crush-45',
    examId: 'exam-ibps',
    title: '45-Day IBPS PO Bank Exams Prelims Plan',
    description: 'Rigorous quantitative aptitude, high-level reasoning, and english grammar speed booster.',
    durationDays: 45,
    enrolledCount: 9320,
    rating: 4.7,
    difficulty: 'Hard',
    isFree: true
  },
  {
    id: 'plan-ssc-cgl-90',
    examId: 'exam-ssc',
    title: 'SSC CGL 90-Day Beginner Plan',
    description: 'Perfect roadmap for absolute beginners. Detailed daily coverage of math, reasoning, English, and GK foundation.',
    durationDays: 90,
    enrolledCount: 18500,
    rating: 4.8,
    difficulty: 'Easy',
    isFree: true,
    tasksCount: 270,
    mocksCount: 15
  },
  {
    id: 'plan-rrb-group-d-60',
    examId: 'exam-rrb',
    title: 'Railway Group D 60-Day Plan',
    description: 'Targeted study plan to master general awareness, general science, arithmetic and reasoning for Group D recruitment.',
    durationDays: 60,
    enrolledCount: 32000,
    rating: 4.7,
    difficulty: 'Easy',
    isFree: true,
    tasksCount: 120,
    mocksCount: 8
  },
  {
    id: 'plan-police-45',
    examId: 'exam-police',
    title: 'Police Constable 45-Day Plan',
    description: 'Fast-track preparation roadmap for state police constable written exams, focusing on local GK, aptitude, and current affairs.',
    durationDays: 45,
    enrolledCount: 24000,
    rating: 4.6,
    difficulty: 'Easy',
    isFree: true,
    tasksCount: 90,
    mocksCount: 10
  },
  {
    id: 'plan-bank-clerk-75',
    examId: 'exam-bank-clerk',
    title: 'Banking Clerk 75-Day Plan',
    description: 'Structured daily targets to master banking aptitude, data analysis, English grammar, and clerical reasoning.',
    durationDays: 75,
    enrolledCount: 14500,
    rating: 4.7,
    difficulty: 'Medium',
    isFree: true,
    tasksCount: 150,
    mocksCount: 12
  }
];

export const mockMaterials: StudyMaterial[] = [
  {
    id: 'mat-polity-intro',
    examId: 'exam-upsc',
    title: 'Historical Background & Making of Constitution notes',
    category: 'PDF',
    sizeOrDuration: '1.8 MB',
    url: '#',
    isFree: true,
    subject: 'Indian Polity',
    downloadCount: 3450
  },
  {
    id: 'mat-polity-video-fr',
    examId: 'exam-upsc',
    title: 'Video Lecture: Fundamental Rights Decoded (Articles 12-35)',
    category: 'Video',
    sizeOrDuration: '52 mins',
    url: '#',
    isFree: true,
    subject: 'Indian Polity',
    downloadCount: 1980
  },
  {
    id: 'mat-ssc-quant-geom',
    examId: 'exam-ssc',
    title: 'Geometry Formula Sheet: Triangles, Circles & Polygons',
    category: 'PDF',
    sizeOrDuration: '2.5 MB',
    url: '#',
    isFree: true,
    subject: 'Quantitative Aptitude',
    downloadCount: 9800
  },
  {
    id: 'mat-ca-june-2026',
    examId: 'exam-upsc',
    title: 'June 2026 Monthly Current Affairs Digest (Compilation)',
    category: 'PDF',
    sizeOrDuration: '6.4 MB',
    url: '#',
    isFree: true,
    subject: 'Current Affairs',
    downloadCount: 15600
  },
  {
    id: 'mat-ibps-puzzles',
    examId: 'exam-ibps',
    title: '50 High-Level Floor & Circular Puzzles for Bank Exams',
    category: 'PDF',
    sizeOrDuration: '3.1 MB',
    url: '#',
    isFree: false,
    subject: 'Reasoning Ability',
    downloadCount: 1200
  }
];

export const mockMockTests: MockTest[] = [
  {
    id: 'mock-upsc-pre-gs1',
    examId: 'exam-upsc',
    title: 'UPSC GS Paper-1 Full-Length Mock Test 1',
    durationMinutes: 120,
    totalQuestions: 100,
    totalMarks: 200,
    difficulty: 'Hard',
    subject: 'General Studies',
    isFree: true
  },
  {
    id: 'mock-ssc-cgl-t1-maths',
    examId: 'exam-ssc',
    title: 'SSC CGL Tier 1: Quant Sectional Mock Test',
    durationMinutes: 20,
    totalQuestions: 25,
    totalMarks: 50,
    difficulty: 'Medium',
    subject: 'Quantitative Aptitude',
    isFree: true
  },
  {
    id: 'mock-ssc-cgl-t1-full',
    examId: 'exam-ssc',
    title: 'SSC CGL Tier 1 Full-Length Mock Test (Latest Pattern)',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 200,
    difficulty: 'Medium',
    subject: 'All Subjects',
    isFree: true
  },
  {
    id: 'mock-ibps-po-pre-reasoning',
    examId: 'exam-ibps',
    title: 'IBPS PO Prelims: High-Level Reasoning Mock',
    durationMinutes: 20,
    totalQuestions: 35,
    totalMarks: 35,
    difficulty: 'Hard',
    subject: 'Reasoning Ability',
    isFree: false
  }
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    planId: 'plan-upsc-polity-30',
    dayNumber: 1,
    title: 'Historical Background of Indian Constitution',
    description: 'Read the Chapter 1 of M. Laxmikanth. Focus on Regulating Act 1773, Pitts India Act 1784, Charter Acts, and Govt of India Acts.',
    estimatedMinutes: 60,
    status: 'completed',
    category: 'General Studies',
    materialId: 'mat-polity-intro'
  },
  {
    id: 'task-2',
    planId: 'plan-upsc-polity-30',
    dayNumber: 1,
    title: 'Attempt MCQ Quiz on Historical Background',
    description: 'Solve 15 practice questions based on standard prelims format to check your conceptual clarity.',
    estimatedMinutes: 20,
    status: 'in_progress',
    category: 'General Studies',
    mockTestId: 'mock-upsc-pre-gs1'
  },
  {
    id: 'task-3',
    planId: 'plan-upsc-polity-30',
    dayNumber: 1,
    title: 'Watch Fundamental Rights Decoded video',
    description: 'Understand the concept of state, equality, and freedoms guaranteed in Articles 12 to 19.',
    estimatedMinutes: 52,
    status: 'pending',
    category: 'General Studies',
    materialId: 'mat-polity-video-fr'
  },
  {
    id: 'task-4',
    planId: 'plan-upsc-polity-30',
    dayNumber: 2,
    title: 'Fundamental Rights - Part II (Articles 20 to 35)',
    description: 'Study Right to Freedom of Religion, Cultural & Educational Rights, and Constitutional Remedies (Writs).',
    estimatedMinutes: 90,
    status: 'pending',
    category: 'General Studies'
  },
  {
    id: 'task-5',
    planId: 'plan-ssc-quant-45',
    dayNumber: 1,
    title: 'Triangle Congruence and Similarity Theorems',
    description: 'Revise basics of triangles, ratios of areas, Thales theorem, angle bisector theorem. Solve 20 basic sums.',
    estimatedMinutes: 45,
    status: 'completed',
    category: 'Quant',
    materialId: 'mat-ssc-quant-geom'
  },
  {
    id: 'task-6',
    planId: 'plan-ssc-quant-45',
    dayNumber: 1,
    title: 'Attempt SSC Geometry Sectional Mock',
    description: 'Take this timed test to check your speed and accuracy in geometry questions under exam pressure.',
    estimatedMinutes: 20,
    status: 'pending',
    category: 'Quant',
    mockTestId: 'mock-ssc-cgl-t1-maths'
  }
];

export const mockMockResults: MockResult[] = [
  {
    id: 'res-1',
    mockTestId: 'mock-upsc-pre-gs1',
    mockTestTitle: 'UPSC GS Paper-1 Full-Length Mock Test 1',
    score: 112.5,
    totalMarks: 200,
    accuracy: 72.4,
    percentile: 94.6,
    timeTakenMinutes: 105,
    dateAttempted: '2026-06-25T14:30:00Z',
    rank: '84/1560'
  },
  {
    id: 'res-2',
    mockTestId: 'mock-ssc-cgl-t1-maths',
    mockTestTitle: 'SSC CGL Tier 1: Quant Sectional Mock Test',
    score: 42.0,
    totalMarks: 50,
    accuracy: 88.0,
    percentile: 96.2,
    timeTakenMinutes: 18,
    dateAttempted: '2026-07-02T10:15:00Z',
    rank: '145/3800'
  }
];

export const mockBlogs: BlogPost[] = [
  {
    id: 'blog-upsc-strategy',
    title: 'How to Read Laxmikanth Polity effectively for UPSC CSE 2027',
    summary: 'Polity is highly scoring. Learn the page-by-page breakdown strategy to master Indian Polity in your first reading.',
    content: '<p>Indian Polity by M. Laxmikanth is considered the bible for UPSC GS Paper II. However, with over 80 chapters, it can overwhelm aspirants. The key is structural learning. Group related chapters like President with Governor, Parliament with State Legislature, Supreme Court with High Court...</p>',
    author: 'IAS Vivek Sharma',
    authorRole: 'Mentor & Ex-Civil Servant',
    date: '2026-06-28',
    readTime: '6 mins read',
    category: 'UPSC Preparation',
    slug: 'read-laxmikanth-polity-effectively'
  },
  {
    id: 'blog-ssc-maths',
    title: 'SSC CGL Maths Speed Tricks: Solve Geometry in Seconds',
    summary: 'A compilation of high-frequency geometry shortcuts, theorems, and value-putting methods to save time in Tier 1 and Tier 2.',
    content: '<p>Quantitative Aptitude is the make-or-break section in SSC CGL. In geometry, standard questions repeat constantly. Using special cases, angle-chasing patterns, and direct formulas can save you up to 30 seconds per question. In this guide, we discuss internal and external bisector theorems...</p>',
    author: 'Ravi Kumar',
    authorRole: 'Quantitative Aptitude Faculty',
    date: '2026-07-01',
    readTime: '8 mins read',
    category: 'SSC Preparation',
    slug: 'ssc-cgl-maths-speed-tricks'
  }
];

export const mockCurrentAffairs: CurrentAffairsItem[] = [
  {
    id: 'ca-1',
    title: 'India-France Bilateral Summit 2026: Key Defense & Energy Accords Signed',
    summary: 'The two countries formalized agreements on next-generation Scorpene submarines, space collaboration, and green hydrogen technology.',
    content: '<p>At the bilateral summit held in Paris, India and France inked landmark agreements. The Prime Minister of India and the French President emphasized strategic autonomy and Indo-Pacific maritime safety. A key pact includes joint development of aircraft engine tech and purchase of additional Rafale-M fighters for the Indian Navy.</p>',
    date: '2026-07-03',
    category: 'International'
  },
  {
    id: 'ca-2',
    title: 'RBI Monetary Policy: Repo Rate Kept Unchanged at 6.5%',
    summary: 'The Reserve Bank of India MPC voted 5-1 to maintain the repo rate to keep retail inflation aligned with target ranges.',
    content: '<p>The Monetary Policy Committee (MPC) of the Reserve Bank of India decided to keep the policy repo rate under the liquidity adjustment facility (LAF) unchanged at 6.50 per cent. The RBI Governor stated that while GDP growth projections remain robust at 7.2% for the current fiscal, inflation targets warrant a cautious stance.</p>',
    date: '2026-07-02',
    category: 'Economy'
  },
  {
    id: 'ca-3',
    title: 'Launch of ISRO\'s Chandrayaan-4 Mission: Target Lunar Sample Return',
    summary: 'ISRO successfully conducts early orbit maneuvers for the pathfinder satellite in preparation for the lunar sample return attempt.',
    content: '<p>In a historic move, the Indian Space Research Organisation (ISRO) has advanced its plans for Chandrayaan-4. Unlike its predecessor which performed soft-landing and rover exploration, the primary objective of Chandrayaan-4 is to collect samples from the South Pole of the Moon and bring them back to Earth safely. The launch will involve multiple modular launches and docking in space.</p>',
    date: '2026-06-30',
    category: 'Science & Tech'
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'How to calculate remainder of 2^99 divided by 33?',
    content: 'Hi everyone, I am practicing Number Systems for SSC CGL. What is the fastest method to solve 2^99 / 33? Should I use Euler\'s Totient Theorem or binomial expansion? Please explain the step-by-step logic.',
    category: 'Maths Doubts',
    authorName: 'Rohan Deshmukh',
    authorRole: 'Student',
    date: '2026-07-03T09:30:00Z',
    upvotes: 24,
    repliesCount: 3,
    reportsCount: 0,
    isLocked: false,
    isPinned: false
  },
  {
    id: 'post-2',
    title: 'Official Notification: SSC CGL 2026 Exam Dates Out!',
    content: 'The Staff Selection Commission has released the official schedule for Combined Graduate Level Examination (Tier-I) 2026. The exams will commence from September 15, 2026 and continue until October 10, 2026. Make sure your syllabus is completed by August. All the best!',
    category: 'Official Announcements',
    authorName: 'Aspirav Team',
    authorRole: 'Admin',
    date: '2026-07-01T12:00:00Z',
    upvotes: 142,
    repliesCount: 15,
    reportsCount: 0,
    isLocked: true,
    isPinned: true
  },
  {
    id: 'post-3',
    title: 'Difference between Article 32 and Article 226 Writs?',
    content: 'I understand both are for writs, but Laxmikanth says Article 226 is wider in scope than Article 32. Can someone explain why High Courts have wider power, and is it a fundamental right to approach under 226 as well?',
    category: 'GK & CA',
    authorName: 'Priya Sharma',
    authorRole: 'New User',
    date: '2026-07-02T15:45:00Z',
    upvotes: 18,
    repliesCount: 2,
    reportsCount: 0,
    isLocked: false,
    isPinned: false
  },
  {
    id: 'post-4',
    title: 'Need a study partner for UPSC CSE 2027 daily targets',
    content: 'Hi, looking for a serious study partner. We can match daily study targets based on the Aspirav Laxmikanth Polity plan, discuss doubts at 9 PM, and solve quizzes together. Drop a comment if interested.',
    category: 'Exam Strategy',
    authorName: 'Sanjay Verma',
    authorRole: 'Student',
    date: '2026-07-03T11:00:00Z',
    upvotes: 5,
    repliesCount: 4,
    reportsCount: 0,
    isLocked: false,
    isPinned: false
  }
];

export const mockReplies: Record<string, CommunityReply[]> = {
  'post-1': [
    {
      id: 'rep-1-1',
      postId: 'post-1',
      content: 'Write 2^99 as (2^5)^19 * 2^4 = 32^19 * 16. Now, 32 can be written as (33 - 1). So, (33 - 1)^19 * 16. By binomial expansion, the remainder of (33 - 1)^19 divided by 33 is (-1)^19 = -1. Therefore, the overall remainder is -1 * 16 = -16. Since a remainder cannot be negative, we add the divisor: 33 - 16 = 17. The answer is 17!',
      authorName: 'Aditya Sen',
      authorRole: 'Moderator',
      date: '2026-07-03T10:00:00Z',
      upvotes: 12,
      reportsCount: 0
    },
    {
      id: 'rep-1-2',
      postId: 'post-1',
      content: 'Euler\'s totient method: Totient of 33, phi(33) = 33 * (1 - 1/3) * (1 - 1/11) = 33 * 2/3 * 10/11 = 20. Since GCD(2,33) = 1, by Euler\'s theorem, 2^20 = 1 (mod 33). So 2^99 = 2^(20*4 + 19) = (2^20)^4 * 2^19 = 1 * 2^19 = 2^19 (mod 33). Now 2^19 = (2^5)^3 * 2^4 = 32^3 * 16 = (-1)^3 * 16 = -16 = 17 (mod 33). Both methods yield 17!',
      authorName: 'Prof. Mathematics',
      authorRole: 'Student',
      date: '2026-07-03T10:20:00Z',
      upvotes: 8,
      reportsCount: 0
    }
  ],
  'post-3': [
    {
      id: 'rep-3-1',
      postId: 'post-3',
      content: 'Under Article 32, you can only approach the Supreme Court for violation of Fundamental Rights. Under Article 226, you can approach the High Court for violation of Fundamental Rights OR any other legal rights (hence "wider scope"). However, Article 32 is itself a Fundamental Right (Right to Constitutional Remedies), whereas Article 226 is a constitutional right, not a fundamental right.',
      authorName: 'Vikas Dubey',
      authorRole: 'Student',
      date: '2026-07-02T16:30:00Z',
      upvotes: 10,
      reportsCount: 0
    }
  ]
};
