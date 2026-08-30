export interface User {
  id: string;
  name: string;
  email: string;
  role: 'official' | 'admin';
  employeeId: string;
  department: string;
  designation: string;
  currentAssignment: string;
  experienceYears: number;
  education: {
    highestQualification: string;
    degree: string;
    specialization: string;
  };
  previousTraining: {
    id: string;
    courseName: string;
    provider: string;
    year: number;
    certificateUrl?: string;
  }[];
  learningStreak: number;
  learningHours: number;
  coursesCompleted: number;
  coursesInProgress: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Statistical' | 'Technical' | 'Digital Governance' | 'Behavioural & Managerial';
  description: string;
  importance: 'High' | 'Medium' | 'Critical';
}

export interface UserSkill {
  userId: string;
  skillId: string;
  skillName: string;
  category: string;
  competencyScore: number;
  initialScore?: number;
  competencyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  lastAssessed: string;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  severity: 'High' | 'Medium' | 'Low' | 'Mastered';
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface GapAnalysisReport {
  overallCompetency: number;
  roleTitle: string;
  cadre: string;
  gaps: SkillGapItem[];
  highGapCount: number;
  mediumGapCount: number;
  lowGapCount: number;
  masteredCount: number;
  aiExplanation: string;
}

export interface Course {
  id: string;
  title: string;
  provider: 'iGOT Karmayogi' | 'NSSTA TPAC' | 'Swayam' | 'NIC' | string;
  skill: string;
  skillCategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  durationHours: number;
  rating: number;
  enrolledCount: number;
  source: 'iGOT' | 'NSSTA';
  description: string;
  syllabus: string[];
  thumbnail: string;
  externalUrl?: string;
  status?: 'active' | 'inactive';
}

export interface PracticeQuestion {
  id: string;
  skill: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PracticeQuizResult {
  id: string;
  userId: string;
  skillName: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  previousScore: number;
  newScore: number;
  improvement: number;
  benchmarkAchieved: boolean;
  timestamp: string;
}

export interface CourseRecommendation {
  course: Course;
  matchScore: number;
  currentScore?: number;
  requiredScore?: number;
  gap?: number;
  priorityLevel?: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY';
  whyReason?: string;
  breakdown: {
    skillGapWeight: number;
    roleRelevanceWeight: number;
    previousLearningWeight: number;
    careerRequirementWeight: number;
    deptPriorityWeight: number;
    emergingDemandWeight: number;
  };
  reason: string;
  isEnrolled: boolean;
  progress?: number;
}

export interface NSSTAProgramme {
  id: string;
  title: string;
  domain: string;
  targetRole: string;
  duration: string;
  mode: 'Residential' | 'Online' | 'Hybrid';
  location: string;
  recommendedSkill: string;
  eligibility: string;
  batchDate: string;
  recommendationScore: number;
  seatsTotal: number;
  seatsAvailable: number;
  curriculumHighlights: string[];
}

export interface AssessmentQuestion {
  id: string;
  skill: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  sourceRef: string;
  source?: string;
  sourceUrl?: string;
  subject?: string;
  topic?: string;
  concepts?: string[];
  tags?: string[];
  usageCount?: number;
  status?: 'approved' | 'pending' | 'draft';
  generatedAt?: string;
}

export interface BankQuestion {
  id: string;
  skill: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  sourceRef: string;
  source: string;
  sourceUrl?: string;
  subject: string;
  topic: string;
  concepts: string[];
  tags: string[];
  usageCount: number;
  status: 'approved' | 'pending' | 'draft';
  generatedAt: string;
  embedding?: number[];
}

export interface BankStats {
  totalQuestions: number;
  approvedQuestions: number;
  pendingQuestions: number;
  subjectsCount: number;
  topicsCount: number;
  uniqueConceptsCount: number;
  difficultyCounts: {
    Easy: number;
    Medium: number;
    Hard: number;
  };
  typeCounts: Record<string, number>;
  subjects: string[];
}

export interface UserQuestionHistory {
  id: string;
  userId: string;
  questionId: string;
  quizId?: string;
  attemptedAt: string;
  isCorrect?: boolean;
}

export type QuizDynamicStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export interface Quiz {
  id: string;
  title: string;
  description: string;
  targetSkill: string;
  domain?: string;
  topic?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  sourceMaterialName?: string;
  createdBy: string;
  createdAt: string;
  status: 'draft' | 'published' | 'archived';
  computedStatus?: QuizDynamicStatus;
  questions: AssessmentQuestion[];
  timeLimitMinutes: number;
  passingScorePercentage?: number;
  startAt?: string;
  endAt?: string;
  timezone?: string;
  targetCadres?: string[];
  targetDepartments?: string[];
  isDeleted?: boolean;
  deletedAt?: string;
  manuallyClosed?: boolean;
  closedAt?: string;
  participantsCount?: number;
  averageScore?: number;
}

export interface AdminQuizStats {
  total: number;
  published: number;
  drafts: number;
  active: number;
  closed: number;
  upcoming: number;
}

export type QuizSubmissionReason =
  | 'MANUAL_SUBMISSION'
  | 'TIMER_EXPIRED'
  | 'NAVIGATION_AWAY'
  | 'BROWSER_BACK'
  | 'PAGE_REFRESH'
  | 'TAB_EXIT'
  | 'BROWSER_CLOSE'
  | 'SESSION_INTERRUPTED'
  | 'ADMIN_CLOSED_QUIZ';

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  startedAt: string;
  submittedAt?: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED';
  submissionType: 'Manual' | 'Auto-submitted';
  submissionReason: QuizSubmissionReason;
  answers: Record<string, number | null>;
  score?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
  totalQuestions: number;
  timeSpentSeconds?: number;
  questionResults?: {
    questionId: string;
    question: string;
    userAnswer?: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
    sourceRef?: string;
    source?: string;
    sourceUrl?: string;
  }[];
  aiFeedback?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'course' | 'assessment' | 'competency' | 'nssta' | 'deadline';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ChatCard {
  type: 'course' | 'skill' | 'gap' | 'nssta';
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  metric?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface ChatResponse {
  answer: string;
  cards?: ChatCard[];
  suggestedActions?: { label: string; url: string; promptText?: string }[];
  sessionContext?: {
    lastTopic?: string;
    lastCourseId?: string;
    lastSkill?: string;
    lastIntent?: string;
  };
}

