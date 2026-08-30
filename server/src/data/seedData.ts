export interface User {
  id: string;
  name: string;
  email: string;
  role: 'official' | 'admin';
  employeeId: string;
  department: string;
  designation: string;
  cadre?: string;
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

export interface RoleBenchmark {
  roleName: string;
  cadre: string;
  requiredSkills: {
    skillId: string;
    skillName: string;
    requiredScore: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];
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

export interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'enrolled';
  enrolledAt: string;
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
export const seedUsers: User[] = [
  {
    id: 'u-1',
    name: 'Rajesh Sharma',
    email: 'rajesh.mospi@gov.in',
    role: 'official',
    employeeId: 'MOSPI-SSO-8842',
    department: 'Ministry of Statistics and Programme Implementation (MoSPI)',
    designation: 'Statistical Officer (Data & Survey Division)',
    currentAssignment: 'All-India Annual Survey of Industries & Socio-Economic Surveys',
    experienceYears: 4,
    education: {
      highestQualification: 'Post Graduate (M.Sc)',
      degree: 'Master of Statistics',
      specialization: 'Applied Statistics & Econometrics'
    },
    previousTraining: [
      { id: 't-1', courseName: 'Modern Survey Methodologies', provider: 'NSSTA Greater Noida', year: 2024 },
      { id: 't-2', courseName: 'R for Official Statistics', provider: 'iGOT Karmayogi', year: 2025 }
    ],
    learningStreak: 12,
    learningHours: 42,
    coursesCompleted: 5,
    coursesInProgress: 2
  },
  {
    id: 'u-2',
    name: 'Dr. Sunita Rao',
    email: 'sunita.director@gov.in',
    role: 'admin',
    employeeId: 'MOSPI-DIR-1029',
    department: 'National Statistical Systems Training Academy (NSSTA)',
    designation: 'Director (Capacity Building & Statistical Intelligence)',
    currentAssignment: 'National Statistical Capacity Building Programme & Cadre Development',
    experienceYears: 18,
    education: {
      highestQualification: 'Ph.D.',
      degree: 'Doctorate in Economics & Quantitative Statistics',
      specialization: 'Macroeconomic Aggregates & System of National Accounts'
    },
    previousTraining: [
      { id: 't-3', courseName: 'UN-SIAP Statistical Leadership', provider: 'United Nations SIAP', year: 2023 }
    ],
    learningStreak: 45,
    learningHours: 180,
    coursesCompleted: 14,
    coursesInProgress: 1
  }
];

export const seedSkills: Skill[] = [
  { id: 'sk-1', name: 'Survey Design', category: 'Statistical', description: 'Designing national socio-economic questionnaires & field protocols', importance: 'Critical' },
  { id: 'sk-2', name: 'Sampling', category: 'Statistical', description: 'Stratified multistage cluster sampling and sample weight calibration', importance: 'Critical' },
  { id: 'sk-3', name: 'National Accounts', category: 'Statistical', description: 'SNA 2008 framework, GDP/GVA compilation, and SUT tables', importance: 'High' },
  { id: 'sk-4', name: 'Price Statistics', category: 'Statistical', description: 'Consumer Price Index (CPI), WPI, and Laspeyres indices', importance: 'High' },
  { id: 'sk-5', name: 'Labour Statistics', category: 'Statistical', description: 'Periodic Labour Force Survey (PLFS) metrics: LFPR, WPR, UR', importance: 'Medium' },
  { id: 'sk-6', name: 'Agricultural Statistics', category: 'Statistical', description: 'Crop cutting experiments, area estimation, land-use data', importance: 'Medium' },
  { id: 'sk-7', name: 'Industrial Statistics', category: 'Statistical', description: 'Annual Survey of Industries (ASI) and IIP compilation', importance: 'High' },
  { id: 'sk-8', name: 'SDG Indicators', category: 'Statistical', description: 'National Indicator Framework (NIF) for Sustainable Development Goals', importance: 'Critical' },
  { id: 'sk-9', name: 'Metadata Standards', category: 'Statistical', description: 'SDMX, DDI standards and statistical classification registers', importance: 'Medium' },
  { id: 'sk-10', name: 'Data Quality Frameworks', category: 'Statistical', description: 'National Quality Assurance Framework (NQAF) and audit rules', importance: 'High' },

  { id: 'sk-11', name: 'Python', category: 'Technical', description: 'Python for statistical modeling, Pandas, NumPy, and data automation', importance: 'Critical' },
  { id: 'sk-12', name: 'R', category: 'Technical', description: 'R programming for survey package analysis and microdata processing', importance: 'High' },
  { id: 'sk-13', name: 'SQL', category: 'Technical', description: 'Relational querying, aggregation, window functions, and enterprise DB', importance: 'Critical' },
  { id: 'sk-14', name: 'Stata', category: 'Technical', description: 'Econometric analysis, microdata handling, and panel regression', importance: 'Medium' },
  { id: 'sk-15', name: 'SPSS', category: 'Technical', description: 'Statistical packaging, cross-tabulation, and multivariate analysis', importance: 'Medium' },
  { id: 'sk-16', name: 'SAS', category: 'Technical', description: 'Enterprise statistical software for administrative datasets', importance: 'Medium' },
  { id: 'sk-17', name: 'GIS', category: 'Technical', description: 'Spatial analysis, QGIS, and geo-tagging survey enumeration blocks', importance: 'High' },
  { id: 'sk-18', name: 'Data Visualization', category: 'Technical', description: 'Interactive policy dashboards, PowerBI, Tableau, and infographics', importance: 'High' },
  { id: 'sk-19', name: 'AI/ML', category: 'Technical', description: 'Predictive modeling, NLP parsing, and anomaly detection in surveys', importance: 'Critical' },
  { id: 'sk-20', name: 'Cloud Computing', category: 'Technical', description: 'Government MeghRaj cloud, API ingestion, and scalable computing', importance: 'High' },
  { id: 'sk-21', name: 'APIs', category: 'Technical', description: 'RESTful open data pipelines, NDAP integration, and data feeds', importance: 'Medium' },
  { id: 'sk-22', name: 'Open Data', category: 'Technical', description: 'National Data and Analytics Platform (NDAP) publishing and curation', importance: 'High' },

  { id: 'sk-23', name: 'Cybersecurity', category: 'Digital Governance', description: 'Information security guidelines, CERT-In protocols, threat awareness', importance: 'Critical' },
  { id: 'sk-24', name: 'Data Privacy', category: 'Digital Governance', description: 'DPDP Act 2023 compliance, statistical confidentiality, and anonymization', importance: 'Critical' },
  { id: 'sk-25', name: 'Digital Signatures', category: 'Digital Governance', description: 'e-Office, PKI authentication, secure document dissemination', importance: 'Medium' },
  { id: 'sk-26', name: 'Government Cloud', category: 'Digital Governance', description: 'NIC MeghRaj architecture, data sovereignty, security standards', importance: 'High' },
  { id: 'sk-27', name: 'Digital Public Infrastructure', category: 'Digital Governance', description: 'Aadhaar, DigiLocker, UPI principles in statistical registers', importance: 'High' },

  { id: 'sk-28', name: 'Leadership', category: 'Behavioural & Managerial', description: 'Cadre leadership, field team motivation, and statistical governance', importance: 'High' },
  { id: 'sk-29', name: 'Communication', category: 'Behavioural & Managerial', description: 'Communicating statistical insights to policymakers and public', importance: 'Critical' },
  { id: 'sk-30', name: 'Project Management', category: 'Behavioural & Managerial', description: 'Managing survey lifecycles, milestone tracking, resource allocation', importance: 'High' },
  { id: 'sk-31', name: 'Ethics', category: 'Behavioural & Managerial', description: 'UN Fundamental Principles of Official Statistics and public integrity', importance: 'Critical' },
  { id: 'sk-32', name: 'Decision Making', category: 'Behavioural & Managerial', description: 'Evidence-based policy formulation and quantitative risk analysis', importance: 'High' },
  { id: 'sk-33', name: 'Change Management', category: 'Behavioural & Managerial', description: 'Facilitating transition from paper to CAPI/CATI digital modes', importance: 'Medium' }
];
export const seedUserSkills: UserSkill[] = [
  { userId: 'u-1', skillId: 'sk-1', skillName: 'Survey Design', category: 'Statistical', competencyScore: 88, initialScore: 72, competencyLevel: 'Advanced', lastAssessed: '2026-08-15' },
  { userId: 'u-1', skillId: 'sk-2', skillName: 'Sampling', category: 'Statistical', competencyScore: 85, initialScore: 68, competencyLevel: 'Advanced', lastAssessed: '2026-08-15' },
  { userId: 'u-1', skillId: 'sk-3', skillName: 'National Accounts', category: 'Statistical', competencyScore: 82, initialScore: 65, competencyLevel: 'Advanced', lastAssessed: '2026-07-20' },
  { userId: 'u-1', skillId: 'sk-4', skillName: 'Price Statistics', category: 'Statistical', competencyScore: 78, initialScore: 60, competencyLevel: 'Intermediate', lastAssessed: '2026-06-10' },
  { userId: 'u-1', skillId: 'sk-8', skillName: 'SDG Indicators', category: 'Statistical', competencyScore: 80, initialScore: 64, competencyLevel: 'Advanced', lastAssessed: '2026-08-01' },
  { userId: 'u-1', skillId: 'sk-11', skillName: 'Python', category: 'Technical', competencyScore: 42, initialScore: 30, competencyLevel: 'Beginner', lastAssessed: '2026-08-20' },
  { userId: 'u-1', skillId: 'sk-12', skillName: 'R', category: 'Technical', competencyScore: 68, initialScore: 50, competencyLevel: 'Intermediate', lastAssessed: '2026-07-15' },
  { userId: 'u-1', skillId: 'sk-13', skillName: 'SQL', category: 'Technical', competencyScore: 73, initialScore: 55, competencyLevel: 'Intermediate', lastAssessed: '2026-08-18' },
  { userId: 'u-1', skillId: 'sk-17', skillName: 'GIS', category: 'Technical', competencyScore: 48, initialScore: 35, competencyLevel: 'Beginner', lastAssessed: '2026-08-10' },
  { userId: 'u-1', skillId: 'sk-18', skillName: 'Data Visualization', category: 'Technical', competencyScore: 55, initialScore: 40, competencyLevel: 'Intermediate', lastAssessed: '2026-08-12' },
  { userId: 'u-1', skillId: 'sk-19', skillName: 'AI/ML', category: 'Technical', competencyScore: 35, initialScore: 25, competencyLevel: 'Beginner', lastAssessed: '2026-08-25' },
  { userId: 'u-1', skillId: 'sk-20', skillName: 'Cloud Computing', category: 'Technical', competencyScore: 25, initialScore: 18, competencyLevel: 'Beginner', lastAssessed: '2026-08-05' },
  { userId: 'u-1', skillId: 'sk-23', skillName: 'Cybersecurity', category: 'Digital Governance', competencyScore: 55, initialScore: 45, competencyLevel: 'Intermediate', lastAssessed: '2026-07-28' },
  { userId: 'u-1', skillId: 'sk-24', skillName: 'Data Privacy', category: 'Digital Governance', competencyScore: 62, initialScore: 48, competencyLevel: 'Intermediate', lastAssessed: '2026-08-02' },
  { userId: 'u-1', skillId: 'sk-29', skillName: 'Communication', category: 'Behavioural & Managerial', competencyScore: 78, initialScore: 65, competencyLevel: 'Intermediate', lastAssessed: '2026-06-25' },
  { userId: 'u-1', skillId: 'sk-31', skillName: 'Ethics', category: 'Behavioural & Managerial', competencyScore: 92, initialScore: 80, competencyLevel: 'Advanced', lastAssessed: '2026-05-14' }
];

export const seedRoleBenchmarks: RoleBenchmark[] = [
  {
    roleName: 'Statistical Officer (Data & Survey Division)',
    cadre: 'Junior/Senior Statistical Officer Cadre',
    requiredSkills: [
      { skillId: 'sk-1', skillName: 'Survey Design', requiredScore: 85, level: 'Advanced' },
      { skillId: 'sk-2', skillName: 'Sampling', requiredScore: 80, level: 'Advanced' },
      { skillId: 'sk-3', skillName: 'National Accounts', requiredScore: 80, level: 'Advanced' },
      { skillId: 'sk-11', skillName: 'Python', requiredScore: 75, level: 'Intermediate' },
      { skillId: 'sk-13', skillName: 'SQL', requiredScore: 80, level: 'Intermediate' },
      { skillId: 'sk-18', skillName: 'Data Visualization', requiredScore: 80, level: 'Intermediate' },
      { skillId: 'sk-19', skillName: 'AI/ML', requiredScore: 65, level: 'Intermediate' },
      { skillId: 'sk-17', skillName: 'GIS', requiredScore: 60, level: 'Intermediate' },
      { skillId: 'sk-20', skillName: 'Cloud Computing', requiredScore: 55, level: 'Beginner' },
      { skillId: 'sk-23', skillName: 'Cybersecurity', requiredScore: 65, level: 'Intermediate' },
      { skillId: 'sk-24', skillName: 'Data Privacy', requiredScore: 70, level: 'Intermediate' }
    ]
  },
  {
    roleName: 'Director (Capacity Building & Statistical Intelligence)',
    cadre: 'Indian Statistical Service (ISS) Senior Administrative Grade',
    requiredSkills: [
      { skillId: 'sk-28', skillName: 'Leadership', requiredScore: 95, level: 'Advanced' },
      { skillId: 'sk-30', skillName: 'Project Management', requiredScore: 90, level: 'Advanced' },
      { skillId: 'sk-31', skillName: 'Ethics', requiredScore: 95, level: 'Advanced' },
      { skillId: 'sk-3', skillName: 'National Accounts', requiredScore: 90, level: 'Advanced' },
      { skillId: 'sk-19', skillName: 'AI/ML', requiredScore: 70, level: 'Intermediate' },
      { skillId: 'sk-24', skillName: 'Data Privacy', requiredScore: 85, level: 'Advanced' }
    ]
  }
];

export const seedCourses: Course[] = [
  {
    id: 'c-1',
    title: 'Python for Statistical Data Analysis',
    provider: 'iGOT Karmayogi',
    skill: 'Python',
    skillCategory: 'Technical',
    difficulty: 'Intermediate',
    duration: '8 hours',
    durationHours: 8,
    rating: 4.8,
    enrolledCount: 1420,
    source: 'iGOT',
    description: 'Comprehensive Python for statistical officers covering data wrangling with Pandas, automated survey data ingestion, validation checks, and descriptive modeling.',
    syllabus: [
      'Pandas for Large-Scale Survey Microdata',
      'Handling Missing Values and Imputation in Official Statistics',
      'Automating National Account Indicators with NumPy and SciPy',
      'Exporting Standardized MoSPI Statistical Tables'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://www.kaggle.com/learn/python'
  },
  {
    id: 'c-2',
    title: 'AI & Machine Learning for Official Statistics',
    provider: 'iGOT Karmayogi',
    skill: 'AI/ML',
    skillCategory: 'Technical',
    difficulty: 'Intermediate',
    duration: '12 hours',
    durationHours: 12,
    rating: 4.9,
    enrolledCount: 980,
    source: 'iGOT',
    description: 'Practical application of machine learning in survey data imputation, outlier detection, automated text coding of economic classifications (NIC & NCO), and satellite data analysis.',
    syllabus: [
      'Machine Learning Taxonomy for National Statistical Offices',
      'Automated Industry & Occupation Coding (NIC/NCO) via NLP',
      'Anomaly and Fraud Detection in Industrial Surveys (ASI)',
      'Satellite Imagery Estimation for Agricultural Yields'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://developers.google.com/machine-learning/crash-course'
  },
  {
    id: 'c-3',
    title: 'Spatial Analytics & GIS in Government Surveys',
    provider: 'iGOT Karmayogi',
    skill: 'GIS',
    skillCategory: 'Technical',
    difficulty: 'Beginner',
    duration: '10 hours',
    durationHours: 10,
    rating: 4.7,
    enrolledCount: 1150,
    source: 'iGOT',
    description: 'Integrate geographic information systems (GIS) with household and economic surveys. Learn QGIS, boundary shapefiles, geo-tagging validation, and spatial heatmaps.',
    syllabus: [
      'GIS Fundamentals and Coordinate Reference Systems in India',
      'Geo-referencing Village & Urban Frame Survey Blocks',
      'Spatial Sampling Verification using GeoPandas',
      'Creating Thematic Statistical Maps for Policy Briefs'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://www.coursera.org/learn/gis'
  },
  {
    id: 'c-4',
    title: 'Government Cloud Infrastructure for Statisticians',
    provider: 'iGOT Karmayogi',
    skill: 'Cloud Computing',
    skillCategory: 'Technical',
    difficulty: 'Beginner',
    duration: '6 hours',
    durationHours: 6,
    rating: 4.6,
    enrolledCount: 890,
    source: 'iGOT',
    description: 'Learn secure deployment on NIC MeghRaj cloud infrastructure, S3 bucket storage for large survey microdata, and security best practices.',
    syllabus: [
      'Overview of GI Cloud (MeghRaj) Ecosystem',
      'Secure Data Storage and Encryption for Microdata',
      'Deploying Automated Data Pipelines on Gov Cloud',
      'Access Control, Audit Logging, and Zero-Trust Principles'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/'
  },
  {
    id: 'c-5',
    title: 'Advanced SQL for National Statistical Registers',
    provider: 'iGOT Karmayogi',
    skill: 'SQL',
    skillCategory: 'Technical',
    difficulty: 'Advanced',
    duration: '9 hours',
    durationHours: 9,
    rating: 4.8,
    enrolledCount: 2100,
    source: 'iGOT',
    description: 'Master complex queries, indexing strategies, analytical window functions, and query optimization for billion-row administrative and survey datasets.',
    syllabus: [
      'Partitioning and Indexing Billion-Row Census Tables',
      'Window Functions for Economic Time-Series',
      'Data Cleansing Stored Procedures for Field Surveys',
      'Connecting Relational Databases to Python/R Analytics'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://www.kaggle.com/learn/intro-to-sql'
  },
  {
    id: 'c-6',
    title: 'Modern Data Visualization with PowerBI for Public Policy',
    provider: 'iGOT Karmayogi',
    skill: 'Data Visualization',
    skillCategory: 'Technical',
    difficulty: 'Intermediate',
    duration: '7 hours',
    durationHours: 7,
    rating: 4.7,
    enrolledCount: 3200,
    source: 'iGOT',
    description: 'Transform complex statistical tables into executive dashboards for Cabinet ministers, parliamentary committees, and public open data portals.',
    syllabus: [
      'DAX Calculations for Year-over-Year Inflation and Growth',
      'Designing Accessible Dashboards adhering to GIGW Guidelines',
      'Interactive State and District Level Drill-down Views',
      'Automated Scheduled Refresh and PDF Report Generation'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/'
  },
  {
    id: 'c-7',
    title: 'Data Privacy & The Digital Personal Data Protection Act 2023',
    provider: 'iGOT Karmayogi',
    skill: 'Data Privacy',
    skillCategory: 'Digital Governance',
    difficulty: 'Intermediate',
    duration: '5 hours',
    durationHours: 5,
    rating: 4.9,
    enrolledCount: 4100,
    source: 'iGOT',
    description: 'Detailed analysis of DPDP Act 2023 provisions for statistical agencies, statistical confidentiality, differential privacy algorithms, and anonymization frameworks.',
    syllabus: [
      'Key Provisions of DPDP Act 2023 for Statistical Agencies',
      'Microdata Anonymization, Top-Coding and Perturbation',
      'Differential Privacy in Census & Survey Data Releases',
      'Legal Penalties and Data Breach Protocols'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://www.meity.gov.in/content/digital-personal-data-protection-act-2023'
  },
  {
    id: 'c-8',
    title: 'System of National Accounts (SNA 2008) & SUT Compilation',
    provider: 'iGOT Karmayogi',
    skill: 'National Accounts',
    skillCategory: 'Statistical',
    difficulty: 'Advanced',
    duration: '14 hours',
    durationHours: 14,
    rating: 4.9,
    enrolledCount: 750,
    source: 'iGOT',
    description: 'Comprehensive course on compiling GDP, Gross Value Added (GVA), Supply-Use Tables (SUT), and balancing input-output tables according to UN SNA 2008 standards.',
    syllabus: [
      'Production, Income, and Expenditure Approaches to GDP',
      'Compilation of Institutional Sector Accounts',
      'Supply and Use Tables Balancing Principles',
      'Base Year Revisions and Deflator Methodologies'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    externalUrl: 'https://unstats.un.org/unsd/nationalaccount/sna.asp'
  }
];

export const seedEnrollments: UserEnrollment[] = [
  { id: 'en-1', userId: 'u-1', courseId: 'c-5', progress: 100, status: 'completed', enrolledAt: '2026-07-01' },
  { id: 'en-2', userId: 'u-1', courseId: 'c-6', progress: 100, status: 'completed', enrolledAt: '2026-07-15' },
  { id: 'en-3', userId: 'u-1', courseId: 'c-1', progress: 45, status: 'in_progress', enrolledAt: '2026-08-10' },
  { id: 'en-4', userId: 'u-1', courseId: 'c-3', progress: 20, status: 'in_progress', enrolledAt: '2026-08-18' }
];
export const seedNSSTAProgrammes: NSSTAProgramme[] = [
  {
    id: 'nssta-1',
    title: 'Executive Masterclass: AI & Big Data Integration in Official Statistics',
    domain: 'Data Science & Modernization',
    targetRole: 'Statistical Officers, Senior Statistical Officers, Assistant Directors',
    duration: '5 Days (Residential)',
    mode: 'Residential',
    location: 'NSSTA Campus, Greater Noida (UP)',
    recommendedSkill: 'AI/ML',
    eligibility: 'Minimum 2 years experience in MoSPI / State DES / CSO',
    batchDate: '15 Sep 2026 - 20 Sep 2026',
    recommendationScore: 96,
    seatsTotal: 40,
    seatsAvailable: 8,
    curriculumHighlights: [
      'Hands-on Lab: LLM-Assisted Survey Classification (NIC/NCO)',
      'Satellite Night-Lights & Earth Observation Data Analysis with Python',
      'Synthetic Data Generation for Privacy-Preserving Public Releases',
      'Case Study: Modernizing Price Collection using Web-Scraping APIs'
    ]
  },
  {
    id: 'nssta-2',
    title: 'Advanced Sampling Techniques & Small Area Estimation (SAE)',
    domain: 'Statistical Methodologies',
    targetRole: 'Survey Design Specialists & State Statistical Cadres',
    duration: '10 Days (Residential)',
    mode: 'Residential',
    location: 'NSSTA Campus, Greater Noida (UP)',
    recommendedSkill: 'Sampling',
    eligibility: 'Working knowledge of sampling theory and R / Stata',
    batchDate: '01 Oct 2026 - 11 Oct 2026',
    recommendationScore: 92,
    seatsTotal: 35,
    seatsAvailable: 12,
    curriculumHighlights: [
      'Fay-Herriot and Unit-Level Small Area Models',
      'Calibration Estimators and Non-Response Weight Adjustments',
      'Sample Size Optimization for District-Level Disaggregated Indicators',
      'Practical Field Simulation with National Sample Survey (NSS) Datasets'
    ]
  },
  {
    id: 'nssta-3',
    title: 'GIS Mapping & Spatial Data Infrastructure for Statistical Operations',
    domain: 'Geospatial Statistics',
    targetRole: 'Field Officers, JSO, SSO, State DES Officers',
    duration: '1 Week (Hybrid)',
    mode: 'Hybrid',
    location: 'NSSTA Greater Noida & Virtual Lab',
    recommendedSkill: 'GIS',
    eligibility: 'Any statistical officer involved in field mapping or CAPI surveys',
    batchDate: '20 Oct 2026 - 27 Oct 2026',
    recommendationScore: 90,
    seatsTotal: 50,
    seatsAvailable: 19,
    curriculumHighlights: [
      'Integration of Bhuvan GIS & OpenStreetMap with Survey Frames',
      'Automated Geo-tagging Verification for Household Surveys',
      'Spatial Autocorrelation (Moran I) for Economic Indicators',
      'Publishing WMS/WFS Map Services on India Data Portals'
    ]
  },
  {
    id: 'nssta-4',
    title: 'National Accounts & Supply-Use Tables (SUT) Advanced Workshop',
    domain: 'Macro-Economic Statistics',
    targetRole: 'Officers in Central & State Accounts Divisions',
    duration: '2 Weeks (Residential)',
    mode: 'Residential',
    location: 'NSSTA Campus, Greater Noida (UP)',
    recommendedSkill: 'National Accounts',
    eligibility: 'Involved in State Income (GSDP) or National Income compilation',
    batchDate: '05 Nov 2026 - 18 Nov 2026',
    recommendationScore: 88,
    seatsTotal: 30,
    seatsAvailable: 5,
    curriculumHighlights: [
      'Compilation of Financial Intermediation Services (FISIM)',
      'Balancing Complex Commodity Flows in Supply-Use Matrices',
      'Deflator Selection and Double Deflation Methodology',
      'Aligning with 2025 SNA Updates and Digital Economy'
    ]
  },
  {
    id: 'nssta-5',
    title: 'Cloud Computing & Cyber Defense in Official Statistical Systems',
    domain: 'Digital Governance & Infrastructure',
    targetRole: 'Data Management Officers & IT Co-ordinators',
    duration: '3 Days (Online Interactive)',
    mode: 'Online',
    location: 'NSSTA Virtual Academy (Webex)',
    recommendedSkill: 'Cloud Computing',
    eligibility: 'Open to all Statistical Officers with computer operations role',
    batchDate: '12 Nov 2026 - 15 Nov 2026',
    recommendationScore: 91,
    seatsTotal: 100,
    seatsAvailable: 44,
    curriculumHighlights: [
      'NIC MeghRaj Cloud Storage & Containerized Processing',
      'CERT-In Cyber Crisis Management Plan for Statistical Databases',
      'Hardening CAPI Tablet Devices for Field Survey Security',
      'Role-based API Token Management and Database Encryption'
    ]
  }
];

export const seedAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q-1',
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'What is the primary objective of stratified random sampling over simple random sampling?',
    options: [
      'To ensure representative subgroup representation and decrease sampling variance across heterogeneous populations',
      'To reduce the total number of survey respondents to minimize cost',
      'To completely eliminate non-sampling and measurement errors in field operations',
      'To replace probability sampling when a sampling frame is unavailable'
    ],
    correctAnswer: 0,
    explanation: 'Stratified sampling partitions a heterogeneous population into mutually exclusive, homogeneous subgroups (strata) and samples from each, thereby decreasing sampling variance and guaranteeing representation of minority domains.',
    sourceRef: 'UN Handbook on Household Sample Surveys & MoSPI NSS Methodology'
  },
  {
    id: 'q-2',
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In Python (Pandas), which method is the most vectorized and memory-efficient way to replace missing survey weights with stratum median weights?',
    options: [
      'Using a Python for loop: for index, row in df.iterrows(): ...',
      'df["weight"].apply(lambda x: median(x)) without grouping',
      'df["weight"] = df.groupby("stratum")["weight"].transform(lambda x: x.fillna(x.median()))',
      'df.dropna(subset=["weight"]) directly'
    ],
    correctAnswer: 2,
    explanation: 'Using groupby().transform() with fillna() is fully vectorized, executing in C underlying arrays without Python-level iteration overhead, making it ideal for large official survey microdata.',
    sourceRef: 'Python Data Science for Official Statistics Manual'
  },
  {
    id: 'q-3',
    skill: 'National Accounts',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Under SNA 2008, how is Research and Development (R&D) expenditure treated in GDP compilation?',
    options: [
      'Treated exclusively as intermediate consumption of the producing establishment',
      'Treated as Gross Fixed Capital Formation (GFCF) if it delivers future economic benefit',
      'Deducted directly from Gross Operating Surplus without asset creation',
      'Omitted from national accounts as an intangible asset without market valuation'
    ],
    correctAnswer: 1,
    explanation: 'SNA 2008 recognized R&D as Gross Fixed Capital Formation (intellectual property asset), whereas the previous 1993 SNA treated R&D as intermediate consumption.',
    sourceRef: 'System of National Accounts 2008 (UN, OECD, IMF, World Bank)'
  },
  {
    id: 'q-4',
    skill: 'AI/ML',
    category: 'Technical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'When deploying a Machine Learning model for automated National Industrial Classification (NIC) text coding from survey descriptions, what metric is most critical to avoid minority sector misclassification?',
    options: [
      'Raw Overall Accuracy without class weighting',
      'Mean Squared Error (MSE) on continuous features',
      'R-Squared Variance between code IDs',
      'Stratified Macro-Averaged F1-Score & Precision-Recall curves per code class'
    ],
    correctAnswer: 3,
    explanation: 'Economic classification text in surveys is heavily imbalanced (e.g. retail trade has millions of entries while specialized heavy industries have few). Macro F1-score treats all classes equally regardless of frequency.',
    sourceRef: 'UNECE Machine Learning for Official Statistics Guidelines'
  },
  {
    id: 'q-5',
    skill: 'GIS',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In spatial sampling validation for urban frame surveys, what does the Moran I statistic measure?',
    options: [
      'The average travel time for field enumerators',
      'The geometric distortion introduced by the UTM projection',
      'The degree of spatial autocorrelation (clustering vs dispersion) of socioeconomic variables across geographic enumeration blocks',
      'The boundary error of cadastral maps'
    ],
    correctAnswer: 2,
    explanation: 'Moran I evaluates spatial autocorrelation. Positive Moran I indicates spatial clustering of similar values, which is essential for designing cluster sample designs and spatial stratification.',
    sourceRef: 'Spatial Statistics & Geo-processing for Public Policy'
  },
  {
    id: 'q-6',
    skill: 'Data Privacy',
    category: 'Digital Governance',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'Under the Digital Personal Data Protection (DPDP) Act 2023 and statistical confidentiality norms, what technique mathematically guarantees that individual respondent identity cannot be re-identified regardless of auxiliary external datasets?',
    options: [
      'Epsilon-Differential Privacy with calibrated Laplace or Gaussian noise injection',
      'Simple hashing of the Name and Aadhaar columns',
      'Removing only the first 5 digits of the telephone number',
      'Storing data in a password-protected zip file'
    ],
    correctAnswer: 0,
    explanation: 'Differential Privacy provides mathematically provable privacy guarantees against arbitrary external background knowledge by bounding the maximum information leakage from any single individual record.',
    sourceRef: 'DPDP Act 2023 & United Nations Statistical Commission Confidentiality Guidelines'
  },
  {
    id: 'q-7',
    skill: 'Survey Design',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In computer-assisted personal interviewing (CAPI), what is the main purpose of automated real-time validation checks during field questionnaire administration?',
    options: [
      'To prevent enumerators from taking rest breaks during field hours',
      'To catch out-of-range values, logical inconsistencies, and skip-pattern violations at the point of data capture',
      'To automatically submit reports directly to the Prime Minister Office',
      'To eliminate the need for primary sample selection'
    ],
    correctAnswer: 1,
    explanation: 'Real-time validation checks in CAPI identify inconsistencies and range errors while the enumerator is still in the respondent household, radically reducing subsequent data cleaning cycles.',
    sourceRef: 'MoSPI CAPI / Computer-Assisted Survey Administration Standard Operating Procedures'
  },
  {
    id: 'q-8',
    skill: 'Cloud Computing',
    category: 'Technical',
    difficulty: 'Easy',
    type: 'MCQ',
    question: 'What is the primary government cloud initiative in India that provides secure hosting and computing infrastructure for Central & State government departments?',
    options: [
      'AWS GovCloud USA',
      'Digital Ocean Public Droplets',
      'Alibaba Cloud Sovereign Nodes',
      'MeghRaj (GI Cloud) managed by National Informatics Centre (NIC)'
    ],
    correctAnswer: 3,
    explanation: 'MeghRaj is the Government of India initiative by MeitY and NIC to provide secure cloud computing infrastructure to government departments and agencies.',
    sourceRef: 'MeitY Cloud First Policy & Guidelines'
  }
];

export const seedFutureSkillPredictions = [
  {
    skillName: 'AI & Machine Learning for Statistics',
    category: 'Technical',
    currentDemandIndex: 45,
    predictedDemand2027: 78,
    predictedDemand2030: 95,
    growthRate: '+111%',
    status: 'High Surge',
    color: '#3b82f6',
    reasoning: 'MoSPI and State DES are rapidly shifting towards automated text classification (NIC/NCO codes), synthetic data generation, and satellite-based crop yield forecasting, necessitating AI/ML competency across 65% of statistical officers.',
    strategicPriority: 'High'
  },
  {
    skillName: 'Cloud-Native Statistical Engineering',
    category: 'Technical',
    currentDemandIndex: 38,
    predictedDemand2027: 68,
    predictedDemand2030: 89,
    growthRate: '+134%',
    status: 'Critical Surge',
    color: '#8b5cf6',
    reasoning: 'Transition from isolated offline desktop processing to cloud-hosted real-time CAPI data pipelines (MeghRaj Cloud & NDAP APIs) requires cloud engineering and secure ETL pipelines.',
    strategicPriority: 'Critical'
  },
  {
    skillName: 'Geospatial & Remote Sensing Analytics',
    category: 'Technical',
    currentDemandIndex: 42,
    predictedDemand2027: 72,
    predictedDemand2030: 86,
    growthRate: '+105%',
    status: 'High Surge',
    color: '#10b981',
    reasoning: 'Integration of ISRO Bhuvan geospatial layers with National Sample Survey frames and socio-economic Census data makes GIS and spatial autocorrelation modeling indispensable.',
    strategicPriority: 'High'
  },
  {
    skillName: 'Privacy-Enhancing Technologies (PETs)',
    category: 'Digital Governance',
    currentDemandIndex: 50,
    predictedDemand2027: 82,
    predictedDemand2030: 94,
    growthRate: '+88%',
    status: 'Mandatory Compliance',
    color: '#ea580c',
    reasoning: 'Implementation of the DPDP Act 2023 mandates differential privacy, homomorphic computation, and robust anonymization frameworks for all public statistical microdata releases.',
    strategicPriority: 'Critical'
  },
  {
    skillName: 'Interactive Public Data Visualization',
    category: 'Technical',
    currentDemandIndex: 60,
    predictedDemand2027: 84,
    predictedDemand2030: 91,
    growthRate: '+52%',
    status: 'Steady Growth',
    color: '#f59e0b',
    reasoning: 'High-level policy stakeholders demand real-time executive dashboards, district disaggregation maps, and accessible public microdata visualization rather than static PDF reports.',
    strategicPriority: 'Medium'
  }
];

export const seedDepartmentAnalytics = [
  {
    id: 'dept-1',
    name: 'Ministry of Statistics and Programme Implementation (MoSPI Central)',
    officialsCount: 3850,
    avgCompetencyScore: 74,
    trainingCompletionRate: 88,
    topGapSkill: 'AI/ML for Statistics',
    riskLevel: 'Low'
  },
  {
    id: 'dept-2',
    name: 'National Statistical Office (NSO - Survey Design & Research Division)',
    officialsCount: 2420,
    avgCompetencyScore: 78,
    trainingCompletionRate: 92,
    topGapSkill: 'Python & Automated Imputation',
    riskLevel: 'Low'
  },
  {
    id: 'dept-3',
    name: 'National Statistical Office (NSO - Field Operations Division)',
    officialsCount: 4100,
    avgCompetencyScore: 61,
    trainingCompletionRate: 64,
    topGapSkill: 'GIS & Geo-tagging Validation',
    riskLevel: 'High'
  },
  {
    id: 'dept-4',
    name: 'Directorate of Economics & Statistics (DES Maharashtra)',
    officialsCount: 1180,
    avgCompetencyScore: 65,
    trainingCompletionRate: 71,
    topGapSkill: 'Cloud Computing & DPDP Act',
    riskLevel: 'Medium'
  },
  {
    id: 'dept-5',
    name: 'Central Statistics Office (CSO - National Accounts Division)',
    officialsCount: 900,
    avgCompetencyScore: 82,
    trainingCompletionRate: 95,
    topGapSkill: 'Machine Learning Deflators',
    riskLevel: 'Low'
  }
];

export const seedTrainingEffectiveness = [
  { skill: 'Python for Statistical Analysis', beforeScore: 42, afterScore: 71, improvement: '+29%', completionRate: 94, dropOffRate: 6, totalParticipants: 1420 },
  { skill: 'Data Privacy & DPDP Act 2023', beforeScore: 51, afterScore: 84, improvement: '+33%', completionRate: 97, dropOffRate: 3, totalParticipants: 4100 },
  { skill: 'Advanced SQL Queries', beforeScore: 58, afterScore: 82, improvement: '+24%', completionRate: 91, dropOffRate: 9, totalParticipants: 2100 },
  { skill: 'GIS in Survey Operations', beforeScore: 39, afterScore: 68, improvement: '+29%', completionRate: 88, dropOffRate: 12, totalParticipants: 1150 },
  { skill: 'AI/ML in Official Statistics', beforeScore: 32, afterScore: 65, improvement: '+33%', completionRate: 86, dropOffRate: 14, totalParticipants: 980 }
];

export const seedNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'u-1',
    title: 'New High-Priority Course Recommendation',
    message: 'AI has matched "Python for Statistical Data Analysis" (94% match) to address your primary skill gap.',
    type: 'course',
    timestamp: '10 mins ago',
    read: false,
    actionUrl: '/courses'
  },
  {
    id: 'notif-2',
    userId: 'u-1',
    title: 'NSSTA Executive Training Announced',
    message: 'Registrations open for "AI & Big Data Integration in Official Statistics" residential masterclass.',
    type: 'nssta',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/nssta'
  },
  {
    id: 'notif-3',
    userId: 'u-1',
    title: 'Competency Milestone Achieved',
    message: 'Your overall competency index has reached 72% (+4% this month).',
    type: 'competency',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/skill-gaps'
  },
  {
    id: 'notif-4',
    userId: 'u-1',
    title: 'Assessment Evaluation Ready',
    message: 'Review your detailed AI evaluation report for the Sample Survey Design assessment.',
    type: 'assessment',
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/assessment'
  }
];

export const seedQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Statistical Sampling & Survey Methodology Certification Quiz',
    description: 'Official self-assessment module evaluating understanding of stratified sampling, sampling errors, weight adjustments, and NSS protocols.',
    targetSkill: 'Sampling',
    domain: 'Statistical Competencies',
    topic: 'Sampling & Survey Methodology',
    difficulty: 'Mixed',
    sourceMaterialName: 'MoSPI National Sample Survey Handbook 2025.pdf',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-20',
    status: 'published',
    timeLimitMinutes: 15,
    passingScorePercentage: 60,
    startAt: '2026-08-20T09:00:00.000Z',
    endAt: '2026-09-10T23:59:59.000Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    targetDepartments: ['All'],
    participantsCount: 245,
    averageScore: 74,
    questions: [
      seedAssessmentQuestions[0],
      seedAssessmentQuestions[1],
      seedAssessmentQuestions[6],
      seedAssessmentQuestions[4]
    ]
  },
  {
    id: 'quiz-2',
    title: 'AI & Data Modernization Readiness Assessment',
    description: 'Assessment on machine learning applications, DPDP 2023 compliance, and Cloud for Official Statistics.',
    targetSkill: 'AI/ML',
    domain: 'AI & Emerging Tech',
    topic: 'AI & Data Modernization',
    difficulty: 'Hard',
    sourceMaterialName: 'Modernizing Official Statistics with AI & Cloud Architecture.pptx',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-25',
    status: 'published',
    timeLimitMinutes: 20,
    passingScorePercentage: 70,
    startAt: '2026-08-25T09:00:00.000Z',
    endAt: '2026-09-15T23:59:59.000Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    targetDepartments: ['All'],
    participantsCount: 180,
    averageScore: 68,
    questions: [
      seedAssessmentQuestions[3],
      seedAssessmentQuestions[5],
      seedAssessmentQuestions[7],
      seedAssessmentQuestions[2]
    ]
  },
  {
    id: 'quiz-3',
    title: 'National Accounts & SNA 2008 Advanced Evaluation',
    description: 'Comprehensive assessment on GFCF compilation, SUT balancing, double deflation, and FISIM estimation in macroeconomic accounts.',
    targetSkill: 'National Accounts',
    domain: 'Macro-Economic Statistics',
    topic: 'National Accounts & SNA 2008',
    difficulty: 'Hard',
    sourceMaterialName: 'SNA 2008 Guidelines & CSO NAD Compendium.pdf',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-28',
    status: 'published',
    timeLimitMinutes: 25,
    passingScorePercentage: 65,
    startAt: '2026-09-05T09:00:00.000Z',
    endAt: '2026-09-25T23:59:59.000Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    targetDepartments: ['All'],
    participantsCount: 0,
    averageScore: 0,
    questions: [
      seedAssessmentQuestions[2],
      seedAssessmentQuestions[0],
      seedAssessmentQuestions[3],
      seedAssessmentQuestions[6]
    ]
  },
  {
    id: 'quiz-4',
    title: 'Cloud Infrastructure & Cyber Defense in Statistical Systems',
    description: 'Evaluation of MeghRaj cloud deployment, containerized microservices, role-based API tokens, and DPDP Act 2023 compliance.',
    targetSkill: 'Cloud Computing',
    domain: 'Digital Governance',
    topic: 'Cloud Infrastructure & Cyber Defense',
    difficulty: 'Medium',
    sourceMaterialName: 'MeitY MeghRaj & CERT-In Statistical Guidelines.pdf',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-01',
    status: 'published',
    timeLimitMinutes: 15,
    passingScorePercentage: 60,
    startAt: '2026-08-01T09:00:00.000Z',
    endAt: '2026-08-20T23:59:59.000Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    targetDepartments: ['All'],
    participantsCount: 312,
    averageScore: 81,
    questions: [
      seedAssessmentQuestions[7],
      seedAssessmentQuestions[5],
      seedAssessmentQuestions[1],
      seedAssessmentQuestions[3]
    ]
  },
  {
    id: 'quiz-5',
    title: 'CAPI Field Validation & Real-Time Data Auditing (Draft)',
    description: 'Draft training quiz evaluating enumerator supervision, CAPI tablet error handling, skip-pattern auditing, and geo-tracking.',
    targetSkill: 'Survey Design',
    domain: 'Survey Design & Field Operations',
    topic: 'CAPI Validation & Quality Checks',
    difficulty: 'Medium',
    sourceMaterialName: 'MoSPI CAPI Survey Administration Manual.docx',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-29',
    status: 'draft',
    timeLimitMinutes: 20,
    passingScorePercentage: 60,
    startAt: '2026-09-10T09:00:00.000Z',
    endAt: '2026-09-30T23:59:59.000Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['Statistical Officer', 'Junior Statistical Officer'],
    targetDepartments: ['All'],
    participantsCount: 0,
    averageScore: 0,
    questions: [
      seedAssessmentQuestions[6],
      seedAssessmentQuestions[0],
      seedAssessmentQuestions[1],
      seedAssessmentQuestions[4]
    ]
  }
];

export const seedPracticeQuestions: PracticeQuestion[] = [
  // Python Practice Questions
  {
    id: 'pq-py-1',
    skill: 'Python',
    question: 'In Pandas, which method is the most memory-efficient way to filter rows in a large 10-million row survey DataFrame?',
    options: ['df[df["state"] == "Delhi"]', 'df.query("state == \'Delhi\'")', 'df.apply(lambda r: r["state"] == "Delhi")', 'for index, row in df.iterrows():'],
    correctAnswer: 1,
    explanation: '`df.query()` evaluates expressions using numexpr under the hood and avoids allocating large intermediate boolean masks in memory.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-py-2',
    skill: 'Python',
    question: 'Which NumPy function should an official statistician use to compute sample weighted variance?',
    options: ['np.var(data, weights=weights)', 'np.cov(data, aweights=weights)', 'np.average(data, weights=weights)', 'np.std(data, ddof=1)'],
    correctAnswer: 1,
    explanation: '`np.cov` supports frequency weights (`fweights`) and reliability weights (`aweights`) to compute unbiased weighted variance for survey weights.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-py-3',
    skill: 'Python',
    question: 'How do you convert a string column "survey_date" formatted as "DD/MM/YYYY" to datetime in Pandas?',
    options: ['pd.to_datetime(df["survey_date"], format="%d/%m/%Y")', 'df["survey_date"].astype("datetime64")', 'pd.date_range(df["survey_date"])', 'df["survey_date"].to_timestamp()'],
    correctAnswer: 0,
    explanation: '`pd.to_datetime(..., format="%d/%m/%Y")` parses explicit day-first dates without ambiguous inference.',
    difficulty: 'Easy'
  },
  {
    id: 'pq-py-4',
    skill: 'Python',
    question: 'When imputing missing values in industrial survey returns (ASI), which SciPy/Scikit-learn technique preserves multi-variable correlations best?',
    options: ['SimpleImputer(strategy="mean")', 'IterativeImputer (MICE)', 'df.fillna(0)', 'df.dropna()'],
    correctAnswer: 1,
    explanation: 'IterativeImputer (Multivariate Imputation by Chained Equations) models each variable as a function of others, preserving inter-variable dependencies.',
    difficulty: 'Hard'
  },
  {
    id: 'pq-py-5',
    skill: 'Python',
    question: 'Which library is officially recommended for high-performance tabular aggregations over partitioned Parquet census registers?',
    options: ['Polars / PyArrow', 'csv', 'urllib', 'pickle'],
    correctAnswer: 0,
    explanation: 'Polars and PyArrow leverage multi-threaded Rust execution and Apache Arrow column formats for billion-row registers.',
    difficulty: 'Medium'
  },

  // Cloud Computing Practice Questions
  {
    id: 'pq-cloud-1',
    skill: 'Cloud Computing',
    question: 'What is the primary sovereign government cloud initiative under MeitY for hosting national statistical workloads?',
    options: ['GI Cloud (MeghRaj)', 'AWS GovCloud US', 'Alibaba Cloud', 'Public Dropbox'],
    correctAnswer: 0,
    explanation: 'GI Cloud (MeghRaj) is the Government of India cloud computing initiative managed by NIC to optimize ICT spending and accelerate digital governance.',
    difficulty: 'Easy'
  },
  {
    id: 'pq-cloud-2',
    skill: 'Cloud Computing',
    question: 'Which cloud storage tier is most cost-effective for archiving immutable historical census microdata accessed less than once a year?',
    options: ['Hot / Standard Tier', 'Cold / Archive Tier (Glacier/Blob Archive)', 'Local RAM Cache', 'SSD Premium Block Storage'],
    correctAnswer: 1,
    explanation: 'Archive / Glacier tiers provide the lowest per-gigabyte monthly cost for permanent compliance storage with retrieval latency of hours.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-cloud-3',
    skill: 'Cloud Computing',
    question: 'In a Zero-Trust statistical architecture, how should access between survey microservices be authenticated?',
    options: ['Hardcoded plaintext passwords', 'mTLS (mutual TLS) and short-lived scoped JWT tokens', 'IP whitelisting only', 'Open public API gateways'],
    correctAnswer: 1,
    explanation: 'Zero-Trust requires explicit verification, mutual TLS encryption, and least-privilege short-lived tokens for every service-to-service call.',
    difficulty: 'Hard'
  },
  {
    id: 'pq-cloud-4',
    skill: 'Cloud Computing',
    question: 'What mechanism provides automatic scaling of CAPI data collection API servers during high-traffic evening survey synchronization periods?',
    options: ['Auto-scaling groups with horizontal pod autoscalers (HPA)', 'Manual server rebooting', 'Fixed single-node VPS', 'Scheduled cron job restart'],
    correctAnswer: 0,
    explanation: 'Horizontal Pod Autoscalers dynamically add container replicas based on CPU/memory utilization and incoming request metrics.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-cloud-5',
    skill: 'Cloud Computing',
    question: 'Under Indian Data Protection norms, where must primary copies of citizen survey microdata reside?',
    options: ['Within Indian territory / Sovereign Data Centers', 'Any overseas public cloud', 'Unencrypted on third-party servers', 'Public GitHub repos'],
    correctAnswer: 0,
    explanation: 'Critical government and citizen data must adhere to data localization mandates and reside within domestic Tier-III/IV sovereign data centers.',
    difficulty: 'Easy'
  },

  // AI/ML Practice Questions
  {
    id: 'pq-aiml-1',
    skill: 'AI/ML',
    question: 'Which machine learning approach is best suited for automatically classifying open-ended survey job titles into 5-digit National Classification of Occupations (NCO) codes?',
    options: ['Fine-tuned Transformer NLP model (BERT/RoBERTa)', 'Linear Regression', 'K-Means with 2 clusters', 'Simple Bubble Sort'],
    correctAnswer: 0,
    explanation: 'Pretrained transformer language models capture semantic variations in free-text job titles and map them accurately to multi-class taxonomic codes.',
    difficulty: 'Hard'
  },
  {
    id: 'pq-aiml-2',
    skill: 'AI/ML',
    question: 'When training an anomaly detection model on Annual Survey of Industries (ASI) data, what algorithm effectively identifies fraudulent output-to-electricity ratios?',
    options: ['Isolation Forest / One-Class SVM', 'Simple Moving Average', 'Naive Bayes Spam Filter', 'K-Nearest Neighbor with K=1'],
    correctAnswer: 0,
    explanation: 'Isolation Forest isolates anomalies by randomly selecting a feature and splitting value, performing exceptionally well on high-dimensional tabular economic data.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-aiml-3',
    skill: 'AI/ML',
    question: 'What is the main danger of using unweighted training sets when predicting household poverty indicators with machine learning?',
    options: ['Over-representation of urban clusters and skewed policy inference (Sampling Bias)', 'Faster GPU training', 'Smaller disk space', 'Loss of Python syntax'],
    correctAnswer: 0,
    explanation: 'Standard ML algorithms assume IID (Independent and Identically Distributed) data. Failing to incorporate survey sample weights causes systemic bias.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-aiml-4',
    skill: 'AI/ML',
    question: 'Which metric is most appropriate for evaluating an AI classification model with highly imbalanced class distributions (e.g. rare agricultural diseases)?',
    options: ['F1-Score / PR-AUC', 'Raw Accuracy', 'Mean Squared Error', 'R-Squared'],
    correctAnswer: 0,
    explanation: 'Raw accuracy is misleading when 99% of samples belong to the majority class. Precision-Recall AUC and F1-Score measure performance on rare positive classes.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-aiml-5',
    skill: 'AI/ML',
    question: 'What technique uses Earth Observation satellite imagery and deep convolutional neural networks to estimate district-level crop yields before harvest?',
    options: ['Remote Sensing Computer Vision (NDVI / Multispectral CNNs)', 'Basic Bar Charts', 'Rule-based Regex', 'Spreadsheet VLOOKUP'],
    correctAnswer: 0,
    explanation: 'CNNs process Sentinel-2 and Landsat optical/SAR bands alongside vegetation indices (NDVI) to forecast crop acreage and yield benchmarks.',
    difficulty: 'Hard'
  },

  // Sampling & Statistics Practice Questions
  {
    id: 'pq-stat-1',
    skill: 'Sampling',
    question: 'What is the primary benefit of Stratified Random Sampling over Simple Random Sampling in nationwide household surveys?',
    options: ['Guarantees representation across sub-populations and reduces overall standard error', 'Reduces survey cost to zero', 'Eliminates need for sample weights', 'Removes enumerator training requirement'],
    correctAnswer: 0,
    explanation: 'Stratification divides heterogeneous populations into homogeneous strata (e.g. Rural/Urban, District), ensuring precise estimates for key subgroups.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-stat-2',
    skill: 'Sampling',
    question: 'In NSS surveys, what does the Multiplier (Sample Weight) represent for an individual sample household?',
    options: ['The inverse probability of selection ($\frac{1}{p_i}$), representing the number of population units it represents', 'The household monthly income', 'The enumerator badge number', 'The survey error percentage'],
    correctAnswer: 0,
    explanation: 'The sample weight is the reciprocal of the unit selection probability, inflating sample counts to unbiased population totals.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-stat-3',
    skill: 'Sampling',
    question: 'What occurs when an unrepresentative subset of respondents systematically declines to participate in a labor force survey?',
    options: ['Non-Response Bias', 'Sampling Variance Reduction', 'Zero Standard Error', 'Perfect Multiplier Alignment'],
    correctAnswer: 0,
    explanation: 'Unit and item non-response can distort estimates if non-respondents systematically differ from respondents (e.g. high-income earners refusing interviews).',
    difficulty: 'Easy'
  },
  {
    id: 'pq-stat-4',
    skill: 'Sampling',
    question: 'Why is Cluster Sampling often preferred for in-person field surveys despite having a higher design effect (DEFF > 1)?',
    options: ['Logistical efficiency and reduced enumerator travel costs between neighboring households', 'Higher statistical precision than SRS', 'No need for a sampling frame', 'Guaranteed zero variance'],
    correctAnswer: 0,
    explanation: 'Selecting geographic clusters (Villages / Urban Census Blocks) drastically reduces travel time and operational field budgets.',
    difficulty: 'Medium'
  },
  {
    id: 'pq-stat-5',
    skill: 'Sampling',
    question: 'Which formula calculates the Margin of Error ($E$) for a 95% confidence interval of a population proportion $p$ with sample size $n$?',
    options: ['$1.96 \\times \\sqrt{\\frac{p(1-p)}{n}}$', '$p \\times n$', '$\\frac{n}{1.96}$', '$\\sqrt{n \\times p}$'],
    correctAnswer: 0,
    explanation: '$E = z_{\\alpha/2} \\times \\sqrt{\\frac{p(1-p)}{n}}$, where $z_{0.025} = 1.96$ for a 95% two-tailed confidence level.',
    difficulty: 'Medium'
  }
];

