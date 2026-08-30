import {
  User, Skill, UserSkill, CourseRecommendation, NSSTAProgramme,
  Quiz, QuizAttempt, AdminQuizStats, GapAnalysisReport, NotificationItem,
  BankQuestion, BankStats, Course, AssessmentQuestion, QuizSubmissionReason
} from '../types';

// Dynamic API Base URL
const getApiBase = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return `${envUrl.trim().replace(/\/+$/, '')}/api`;
  }
  return '/api';
};

const API_BASE = getApiBase();

export const DEFAULT_OFFICIAL_USER: User = {
  id: 'u-1',
  name: 'Rajesh Sharma',
  email: 'rajesh.mospi@gov.in',
  role: 'official',
  employeeId: 'MOSPI-SO-2021-042',
  department: 'National Sample Survey Office (NSSO)',
  designation: 'Statistical Officer',
  currentAssignment: 'Field Operations & Household Survey Data Verification',
  experienceYears: 4,
  education: {
    highestQualification: 'Master of Statistics (M.Stat)',
    degree: 'M.Stat (Applied Statistics)',
    specialization: 'Sampling Techniques, Inference & Time-Series Modeling'
  },
  previousTraining: [
    { id: 't-1', courseName: 'Official Statistics Foundation Programme', provider: 'NSSTA', year: 2022 },
    { id: 't-2', courseName: 'CAPI & Digital Survey Instruments', provider: 'iGOT Karmayogi', year: 2023 }
  ],
  learningStreak: 12,
  learningHours: 42,
  coursesCompleted: 5,
  coursesInProgress: 2
};

export const DEFAULT_ADMIN_USER: User = {
  id: 'u-2',
  name: 'Dr. Sunita Rao',
  email: 'sunita.director@gov.in',
  role: 'admin',
  employeeId: 'MOSPI-DIR-2018-009',
  department: 'National Statistical Systems Training Academy (NSSTA)',
  designation: 'Director (Training & Intelligence)',
  currentAssignment: 'National Statistical Cadre Capacity Building & Curriculum Standards',
  experienceYears: 16,
  education: {
    highestQualification: 'Ph.D. in Econometrics & Statistical Systems',
    degree: 'Ph.D. Statistics',
    specialization: 'National Accounts, Sample Survey Methodologies, Workforce Analytics'
  },
  previousTraining: [
    { id: 't-3', courseName: 'Executive Leadership in Public Statistical Systems', provider: 'LBSNAA / NSSTA', year: 2021 }
  ],
  learningStreak: 45,
  learningHours: 120,
  coursesCompleted: 18,
  coursesInProgress: 3
};

const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'National Sampling Protocols & Survey Design Certification',
    description: 'Comprehensive certification test covering stratified two-stage sampling, DEFF estimation, and CAPI validation.',
    targetSkill: 'Sampling',
    domain: 'Statistical Competencies',
    topic: 'Sampling & Survey Methodology',
    difficulty: 'Mixed',
    createdBy: 'NSSTA Directorate',
    createdAt: '2026-08-01T00:00:00Z',
    timeLimitMinutes: 15,
    passingScorePercentage: 60,
    status: 'published',
    computedStatus: 'ACTIVE',
    startAt: '2026-08-01T00:00:00Z',
    endAt: '2026-09-30T23:59:59Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    averageScore: 74,
    questions: [
      {
        id: 'q-1',
        skill: 'Sampling',
        category: 'Statistical',
        difficulty: 'Medium',
        type: 'MCQ',
        sourceRef: 'MoSPI NSS Handbook',
        question: 'In official NSS rounds, when is stratified sampling preferred over simple random sampling?',
        options: ['When population elements are completely homogeneous', 'When distinct sub-populations (urban/rural) exhibit high inter-strata variance', 'When sample size is strictly under 10', 'When no sampling frame exists'],
        correctAnswer: 1,
        explanation: 'Stratification reduces overall sample variance by partitioning heterogeneous units into homogeneous strata.'
      },
      {
        id: 'q-2',
        skill: 'Sampling',
        category: 'Statistical',
        difficulty: 'Medium',
        type: 'MCQ',
        sourceRef: 'MoSPI NSS Handbook',
        question: 'What does a Design Effect (DEFF) of 1.5 signify in a cluster survey?',
        options: ['Cluster design requires 50% smaller sample size than SRS', 'Cluster sampling requires 50% larger sample size to achieve same precision as SRS', 'Survey has 1.5% non-response rate', 'Sample variance is zero'],
        correctAnswer: 1,
        explanation: 'DEFF = Variance(Complex) / Variance(SRS). DEFF > 1 accounts for intra-cluster correlation.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Python for Statistical Computing & Vectorization Exam',
    description: 'Assess hands-on coding proficiency in Pandas, NumPy array broadcasting, and statistical pipeline automation.',
    targetSkill: 'Python',
    domain: 'Technical Competencies',
    topic: 'Data Analysis & Scientific Computing',
    difficulty: 'Medium',
    createdBy: 'NSSTA Directorate',
    createdAt: '2026-08-10T00:00:00Z',
    timeLimitMinutes: 20,
    passingScorePercentage: 65,
    status: 'published',
    computedStatus: 'ACTIVE',
    startAt: '2026-08-10T00:00:00Z',
    endAt: '2026-10-15T23:59:59Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['Statistical Officers (SSS)', 'Data Processing Assistants'],
    averageScore: 68,
    questions: [
      {
        id: 'qp-1',
        skill: 'Python',
        category: 'Technical',
        difficulty: 'Medium',
        type: 'MCQ',
        sourceRef: 'Python Data Science Guide',
        question: 'Which method handles missing data in Pandas using mean imputation by group?',
        options: ['df.fillna(df.mean())', 'df.groupby("sector")["income"].transform(lambda x: x.fillna(x.mean()))', 'df.dropna()', 'df.replace(0, -1)'],
        correctAnswer: 1,
        explanation: 'transform with groupby replaces NaNs with group-specific means preserving stratified variance.'
      }
    ]
  }
];

// Safe request wrapper that falls back to high-fidelity mock data if backend API is unreachable or returns non-JSON
async function safeFetch<T>(url: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
  } catch (e) {
    // Network or CORS error, fall through to fallback
  }
  if (fallback) {
    return fallback();
  }
  throw new Error(`API call failed for ${url} with no fallback available.`);
}

export const api = {
  // Auth
  async login(email?: string, role?: string): Promise<{ success: boolean; user: User }> {
    const isAdm = role === 'admin' || (email && email.toLowerCase().includes('director') || email?.toLowerCase().includes('admin'));
    return safeFetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      },
      () => ({
        success: true,
        user: isAdm ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER
      })
    );
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User }> {
    return safeFetch(
      `${API_BASE}/auth/switch-user`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      },
      () => ({
        success: true,
        user: userId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER
      })
    );
  },

  async getMe(userId: string): Promise<{ user: User }> {
    return safeFetch(
      `${API_BASE}/auth/me?userId=${userId}`,
      undefined,
      () => ({
        user: userId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER
      })
    );
  },

  // Profile & Skills
  async getProfile(userId: string): Promise<{ user: User; skills: UserSkill[]; enrollments: any[] }> {
    const user = userId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER;
    return safeFetch(
      `${API_BASE}/users/profile?userId=${userId}`,
      undefined,
      () => ({
        user,
        skills: [
          { userId: user.id, skillId: 'sk-1', skillName: 'Sampling & Survey Design', category: 'Statistical', competencyScore: 81, competencyLevel: 'Advanced', lastAssessed: '2026-08-15' },
          { userId: user.id, skillId: 'sk-2', skillName: 'Python for Statistical Data Analysis', category: 'Technical', competencyScore: 42, competencyLevel: 'Intermediate', lastAssessed: '2026-08-20' },
          { userId: user.id, skillId: 'sk-3', skillName: 'Cloud Computing (MeghRaj)', category: 'Technical', competencyScore: 25, competencyLevel: 'Beginner', lastAssessed: '2026-08-10' },
          { userId: user.id, skillId: 'sk-4', skillName: 'AI & Machine Learning', category: 'Technical', competencyScore: 35, competencyLevel: 'Beginner', lastAssessed: '2026-08-12' },
          { userId: user.id, skillId: 'sk-5', skillName: 'Survey Methodology & CAPI', category: 'Statistical', competencyScore: 48, competencyLevel: 'Intermediate', lastAssessed: '2026-08-01' },
          { userId: user.id, skillId: 'sk-6', skillName: 'Data Visualization & PowerBI', category: 'Technical', competencyScore: 55, competencyLevel: 'Intermediate', lastAssessed: '2026-08-05' },
          { userId: user.id, skillId: 'sk-7', skillName: 'National Accounts & SNA 2008', category: 'Statistical', competencyScore: 82, competencyLevel: 'Advanced', lastAssessed: '2026-07-28' },
          { userId: user.id, skillId: 'sk-8', skillName: 'Cybersecurity & DPDP Governance', category: 'Digital Governance', competencyScore: 73, competencyLevel: 'Advanced', lastAssessed: '2026-08-18' }
        ],
        enrollments: []
      })
    );
  },

  async updateProfile(userId: string, data: any): Promise<{ success: boolean; user: User; skills: UserSkill[] }> {
    return safeFetch(
      `${API_BASE}/users/profile`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data })
      },
      () => ({
        success: true,
        user: { ...(userId === 'u-2' ? DEFAULT_ADMIN_USER : DEFAULT_OFFICIAL_USER), ...data },
        skills: data.skills || []
      })
    );
  },

  async getAllSkills(): Promise<{ skills: Skill[] }> {
    return safeFetch(
      `${API_BASE}/users/skills`,
      undefined,
      () => ({
        skills: [
          { id: 'sk-1', name: 'Sampling & Survey Design', category: 'Statistical', description: 'Stratified sampling, sample size estimation, DEFF', importance: 'Critical' },
          { id: 'sk-2', name: 'Python for Statistical Data Analysis', category: 'Technical', description: 'Pandas, NumPy, vectorization, automated data cleaning', importance: 'Critical' },
          { id: 'sk-3', name: 'Cloud Computing (MeghRaj)', category: 'Technical', description: 'Government cloud storage, S3 microdata, security', importance: 'High' },
          { id: 'sk-4', name: 'AI & Machine Learning', category: 'Technical', description: 'Predictive imputation, ML classification on registries', importance: 'Critical' },
          { id: 'sk-5', name: 'Survey Methodology & CAPI', category: 'Statistical', description: 'Computer Assisted Personal Interviewing, validation', importance: 'High' },
          { id: 'sk-6', name: 'Data Visualization & PowerBI', category: 'Technical', description: 'Dissemination dashboards, GIS mapping, reporting', importance: 'Medium' },
          { id: 'sk-7', name: 'National Accounts & SNA 2008', category: 'Statistical', description: 'GVA compilation, input-output tables, deflators', importance: 'High' },
          { id: 'sk-8', name: 'Cybersecurity & DPDP Governance', category: 'Digital Governance', description: 'Digital Personal Data Protection Act 2023 protocols', importance: 'High' }
        ]
      })
    );
  },

  // Gap Analysis & Recommendations
  async getSkillGaps(userId: string): Promise<GapAnalysisReport> {
    return safeFetch(
      `${API_BASE}/skill-gaps?userId=${userId}`,
      undefined,
      () => ({
        overallCompetency: 72,
        roleTitle: 'Statistical Officer',
        cadre: 'Subordinate Statistical Service (SSS)',
        gaps: [
          { skillId: 'sk-2', skillName: 'Python for Statistical Data Analysis', category: 'Technical', currentScore: 42, requiredScore: 75, gap: 33, severity: 'High', currentLevel: 'Intermediate', requiredLevel: 'Advanced' },
          { skillId: 'sk-3', skillName: 'Cloud Computing (MeghRaj)', category: 'Technical', currentScore: 25, requiredScore: 55, gap: 30, severity: 'High', currentLevel: 'Beginner', requiredLevel: 'Intermediate' },
          { skillId: 'sk-4', skillName: 'AI & Machine Learning', category: 'Technical', currentScore: 35, requiredScore: 65, gap: 30, severity: 'High', currentLevel: 'Beginner', requiredLevel: 'Intermediate' },
          { skillId: 'sk-5', skillName: 'Survey Methodology & CAPI', category: 'Statistical', currentScore: 48, requiredScore: 75, gap: 27, severity: 'High', currentLevel: 'Intermediate', requiredLevel: 'Advanced' },
          { skillId: 'sk-6', skillName: 'Data Visualization & PowerBI', category: 'Technical', currentScore: 55, requiredScore: 70, gap: 15, severity: 'Medium', currentLevel: 'Intermediate', requiredLevel: 'Advanced' },
          { skillId: 'sk-8', skillName: 'Cybersecurity & DPDP Governance', category: 'Digital Governance', currentScore: 73, requiredScore: 75, gap: 2, severity: 'Low', currentLevel: 'Advanced', requiredLevel: 'Advanced' },
          { skillId: 'sk-1', skillName: 'Sampling & Survey Design', category: 'Statistical', currentScore: 81, requiredScore: 80, gap: 0, severity: 'Mastered', currentLevel: 'Advanced', requiredLevel: 'Advanced' },
          { skillId: 'sk-7', skillName: 'National Accounts & SNA 2008', category: 'Statistical', currentScore: 82, requiredScore: 80, gap: 0, severity: 'Mastered', currentLevel: 'Advanced', requiredLevel: 'Advanced' }
        ],
        highGapCount: 4,
        mediumGapCount: 1,
        lowGapCount: 1,
        masteredCount: 2,
        aiExplanation: 'Your primary cadre competency deficit is Python for Statistical Data Analysis (-33% gap) and Cloud Computing (-30% gap). Addressing these through targeted iGOT courses will boost your readiness to 88%.'
      })
    );
  },

  async getRecommendations(userId: string): Promise<{ recommendations: CourseRecommendation[] }> {
    return safeFetch(
      `${API_BASE}/recommendations?userId=${userId}`,
      undefined,
      () => ({
        recommendations: [
          {
            course: {
              id: 'c-1',
              title: 'Python for Statistical Data Analysis',
              provider: 'Kaggle Learn / iGOT',
              skill: 'Python',
              skillCategory: 'Technical',
              difficulty: 'Intermediate',
              duration: '8 hours',
              durationHours: 8,
              rating: 4.9,
              enrolledCount: 3420,
              source: 'iGOT',
              description: 'Learn data analysis with Python, Pandas, and statistical computing workflows.',
              syllabus: ['Python Syntax', 'NumPy Vectorization', 'Pandas DataFrames', 'Statistical Modeling'],
              thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
              externalUrl: 'https://www.kaggle.com/learn/python',
              status: 'active'
            },
            matchScore: 96,
            priorityLevel: 'HIGH PRIORITY',
            currentScore: 42,
            requiredScore: 75,
            gap: 33,
            whyReason: 'Your Python competency is 33 percentage points below the 75% benchmark required for Statistical Officers. Completing this training directly addresses your highest career gap.',
            reason: 'Critical cadre skill gap (-33%) in statistical data analysis scripting.',
            isEnrolled: false,
            breakdown: { skillGapWeight: 35, roleRelevanceWeight: 25, previousLearningWeight: 15, careerRequirementWeight: 10, deptPriorityWeight: 8, emergingDemandWeight: 7 }
          },
          {
            course: {
              id: 'c-2',
              title: 'Government Cloud Infrastructure for Statisticians',
              provider: 'Microsoft Learn / MeghRaj',
              skill: 'Cloud Computing',
              skillCategory: 'Technical',
              difficulty: 'Beginner',
              duration: '6 hours',
              durationHours: 6,
              rating: 4.8,
              enrolledCount: 1850,
              source: 'iGOT',
              description: 'Architecting secure statistical data pipelines on Government Cloud (MeghRaj & Azure).',
              syllabus: ['Cloud Fundamentals', 'Microdata S3 Storage', 'Zero Trust Access', 'Disaster Recovery'],
              thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
              externalUrl: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/',
              status: 'active'
            },
            matchScore: 92,
            priorityLevel: 'HIGH PRIORITY',
            currentScore: 25,
            requiredScore: 55,
            gap: 30,
            whyReason: 'Critical -30% gap detected in Cloud Computing. Modern survey pipelines mandate secure government cloud deployment.',
            reason: 'Essential for modern microdata warehousing and MeghRaj cloud deployment.',
            isEnrolled: false,
            breakdown: { skillGapWeight: 33, roleRelevanceWeight: 24, previousLearningWeight: 15, careerRequirementWeight: 10, deptPriorityWeight: 7, emergingDemandWeight: 7 }
          },
          {
            course: {
              id: 'c-3',
              title: 'AI & Machine Learning for Official Statistics',
              provider: 'Google / Coursera',
              skill: 'AI/ML',
              skillCategory: 'Technical',
              difficulty: 'Intermediate',
              duration: '12 hours',
              durationHours: 12,
              rating: 4.9,
              enrolledCount: 4200,
              source: 'iGOT',
              description: 'Applied machine learning techniques for survey data imputation and anomaly detection.',
              syllabus: ['ML Taxonomy', 'Supervised Imputation', 'Remote Sensing', 'Model Fairness'],
              thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
              externalUrl: 'https://www.coursera.org/learn/machine-learning',
              status: 'active'
            },
            matchScore: 89,
            priorityLevel: 'HIGH PRIORITY',
            currentScore: 35,
            requiredScore: 65,
            gap: 30,
            whyReason: 'Emerging discipline gap (-30%). Essential for next-generation automated economic census processing.',
            reason: 'Strategic priority for automated registry data imputation and anomaly classification.',
            isEnrolled: false,
            breakdown: { skillGapWeight: 30, roleRelevanceWeight: 25, previousLearningWeight: 14, careerRequirementWeight: 10, deptPriorityWeight: 7, emergingDemandWeight: 6 }
          }
        ]
      })
    );
  },

  async getLearningPath(userId: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/learning-path?userId=${userId}`,
      undefined,
      () => ({
        learningPath: {
          cadreTitle: 'Statistical Officer (SSS)',
          targetReadiness: '88%',
          phases: [
            {
              phase: 1,
              title: 'Phase 1: High Priority Deficit Remediation',
              description: 'Directly address severe competency gaps in Python and Cloud Infrastructure.',
              status: 'in-progress',
              courses: [
                {
                  id: 'c-1',
                  title: 'Python for Statistical Data Analysis',
                  skill: 'Python',
                  gap: 33,
                  completed: false,
                  submodules: ['1. Python Basics', '2. NumPy Arrays', '3. Pandas DataFrames', '4. Statistical Modeling', '5. Data Visualization', '6. Practice Assessment', '7. Reassessment'],
                  externalUrl: 'https://www.kaggle.com/learn/python'
                },
                {
                  id: 'c-2',
                  title: 'Government Cloud Infrastructure for Statisticians',
                  skill: 'Cloud Computing',
                  gap: 30,
                  completed: false,
                  submodules: ['1. MeghRaj Architecture', '2. Microdata S3 Storage', '3. Zero-Trust Access', '4. Containerized APIs', '5. Disaster Recovery', '6. Practice Assessment'],
                  externalUrl: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/'
                }
              ]
            },
            {
              phase: 2,
              title: 'Phase 2: Applied Machine Learning & Imputation',
              description: 'Master automated data imputation and microdata analysis algorithms.',
              status: 'locked',
              courses: [
                {
                  id: 'c-3',
                  title: 'AI & Machine Learning for Official Statistics',
                  skill: 'AI/ML',
                  gap: 30,
                  completed: false,
                  submodules: ['1. ML Taxonomy in Stats', '2. Automated Classification (NLP)', '3. Anomaly Detection (ASI)', '4. Satellite Remote Sensing', '5. Ethical AI & Bias', '6. Practice Assessment'],
                  externalUrl: 'https://www.coursera.org/learn/machine-learning'
                }
              ]
            },
            {
              phase: 3,
              title: 'Phase 3: CAPI Digital Survey Optimization',
              description: 'Modernize field data collection and real-time validation checks.',
              status: 'locked',
              courses: [
                {
                  id: 'c-4',
                  title: 'Modern Survey Methodology & CAPI Validation',
                  skill: 'Survey Methodology',
                  gap: 27,
                  completed: false,
                  submodules: ['1. Questionnaire Design', '2. Real-Time Logic Rules', '3. Paradata Diagnostics', '4. Field Quality Assurance'],
                  externalUrl: 'https://www.coursera.org/learn/survey-data-collection'
                }
              ]
            },
            {
              phase: 4,
              title: 'Phase 4: Official Dissemination & Policy Dashboards',
              description: 'Create interactive public policy dashboards with PowerBI and WebGL.',
              status: 'locked',
              courses: [
                {
                  id: 'c-5',
                  title: 'Data Visualization & PowerBI for Public Policy',
                  skill: 'Data Visualization',
                  gap: 15,
                  completed: false,
                  submodules: ['1. PowerBI Data Models', '2. DAX Measures', '3. Geo-Spatial Visuals', '4. Ministry Dashboards'],
                  externalUrl: 'https://learn.microsoft.com/en-us/training/paths/data-analytics-microsoft/'
                }
              ]
            }
          ]
        }
      })
    );
  },

  // iGOT & NSSTA
  async getIgotCourses(userId: string, filters?: { skill?: string; difficulty?: string; search?: string }): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/courses?${new URLSearchParams({ userId, ...filters })}`,
      undefined,
      () => ({
        courses: [
          {
            course: {
              id: 'c-1',
              title: 'Python for Statistical Data Analysis',
              provider: 'Kaggle Learn / iGOT',
              skill: 'Python',
              skillCategory: 'Technical',
              difficulty: 'Intermediate',
              duration: '8 hours',
              durationHours: 8,
              rating: 4.9,
              enrolledCount: 3420,
              source: 'iGOT',
              description: 'Learn data analysis with Python, Pandas, and statistical computing workflows.',
              syllabus: ['Python Syntax', 'NumPy Vectorization', 'Pandas DataFrames', 'Statistical Modeling'],
              thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
              externalUrl: 'https://www.kaggle.com/learn/python',
              status: 'active'
            },
            matchScore: 96,
            isEnrolled: true,
            progress: 40
          },
          {
            course: {
              id: 'c-2',
              title: 'Government Cloud Infrastructure for Statisticians',
              provider: 'Microsoft Learn / MeghRaj',
              skill: 'Cloud Computing',
              skillCategory: 'Technical',
              difficulty: 'Beginner',
              duration: '6 hours',
              durationHours: 6,
              rating: 4.8,
              enrolledCount: 1850,
              source: 'iGOT',
              description: 'Architecting secure statistical data pipelines on Government Cloud (MeghRaj & Azure).',
              syllabus: ['Cloud Fundamentals', 'Microdata S3 Storage', 'Zero Trust Access', 'Disaster Recovery'],
              thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
              externalUrl: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/',
              status: 'active'
            },
            matchScore: 92,
            isEnrolled: false,
            progress: 0
          },
          {
            course: {
              id: 'c-3',
              title: 'AI & Machine Learning for Official Statistics',
              provider: 'Google / Coursera',
              skill: 'AI/ML',
              skillCategory: 'Technical',
              difficulty: 'Intermediate',
              duration: '12 hours',
              durationHours: 12,
              rating: 4.9,
              enrolledCount: 4200,
              source: 'iGOT',
              description: 'Applied machine learning techniques for survey data imputation and anomaly detection.',
              syllabus: ['ML Taxonomy', 'Supervised Imputation', 'Remote Sensing', 'Model Fairness'],
              thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
              externalUrl: 'https://www.coursera.org/learn/machine-learning',
              status: 'active'
            },
            matchScore: 89,
            isEnrolled: false,
            progress: 0
          }
        ]
      })
    );
  },

  async enrollIgotCourse(userId: string, courseId: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/enroll`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId })
      },
      () => ({ success: true, message: 'Enrolled successfully' })
    );
  },

  async updateIgotProgress(userId: string, courseId: string, progress: number): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/progress`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId, progress })
      },
      () => ({ success: true, progress })
    );
  },

  async getNsstaProgrammes(filters?: { mode?: string; domain?: string }): Promise<{ programmes: NSSTAProgramme[] }> {
    return safeFetch(
      `${API_BASE}/nssta/programmes?${new URLSearchParams(filters)}`,
      undefined,
      () => ({
        programmes: [
          {
            id: 'prog-1',
            title: 'Advanced Sampling Techniques & CAPI Implementation',
            domain: 'Survey Methodology',
            targetRole: 'Statistical Officers & ISS Cadre',
            duration: '2 Weeks (Residential)',
            mode: 'Residential',
            location: 'NSSTA Campus, Greater Noida',
            recommendedSkill: 'Sampling & Survey Design',
            eligibility: 'Statistical Officers with 2+ years field survey experience',
            batchDate: '2026-09-15 to 2026-09-26',
            recommendationScore: 98,
            seatsTotal: 35,
            seatsAvailable: 12,
            curriculumHighlights: ['Two-stage Stratified Sampling', 'DEFF Estimation', 'Tablet-based CAPI Validation', 'Field Operations QA']
          },
          {
            id: 'prog-2',
            title: 'Big Data & Python in Official Statistics Masterclass',
            domain: 'Data Science & Modernization',
            targetRole: 'All Statistical Cadres',
            duration: '3 Weeks (Hybrid)',
            mode: 'Hybrid',
            location: 'Online + 3-day Residential',
            recommendedSkill: 'Python for Statistical Computing',
            eligibility: 'Open to all MoSPI and state DES officers',
            batchDate: '2026-10-05 to 2026-10-20',
            recommendationScore: 94,
            seatsTotal: 50,
            seatsAvailable: 18,
            curriculumHighlights: ['Vectorized Computing', 'Administrative Microdata Linkage', 'Anomaly Detection', 'Microdata Protection']
          }
        ]
      })
    );
  },

  async registerNsstaProgramme(userId: string, programmeId: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/nssta/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, programmeId })
      },
      () => ({ success: true, message: 'Nomination submitted successfully.' })
    );
  },

  // Assessment & Adaptive Engine
  async startAssessment(userId: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/assessment/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      },
      () => ({
        questions: [
          {
            id: 'q-adapt-1',
            skill: 'Sampling & Survey Design',
            category: 'Statistical',
            difficulty: 'Medium',
            type: 'MCQ',
            sourceRef: 'MoSPI-NSSO-Standard',
            question: 'In a stratified multi-stage design where primary sampling units (PSUs) have unequal sizes, which sampling method achieves self-weighting sample designs?',
            options: ['Simple Random Sampling with Replacement', 'Probability Proportional to Size (PPS)', 'Systematic Cluster Sampling', 'Non-probability Quota Sampling'],
            correctAnswer: 1,
            explanation: 'PPS selection of PSUs combined with equal probability selection of ultimate units yields a self-weighting sample.'
          },
          {
            id: 'q-adapt-2',
            skill: 'Python for Statistical Data Analysis',
            category: 'Technical',
            difficulty: 'Medium',
            type: 'MCQ',
            sourceRef: 'MoSPI-NSSO-Standard',
            question: 'Which Pandas operation computes grouped aggregation in a vectorized manner without Python-level iteration?',
            options: ['df.apply(lambda x: x.mean())', 'df.groupby("region")["consumption"].mean()', 'for row in df.iterrows(): pass', 'df.to_dict()'],
            correctAnswer: 1,
            explanation: 'df.groupby().mean() operates in compiled C/Cython vectorization, outperforming Python iterators.'
          },
          {
            id: 'q-adapt-3',
            skill: 'AI & Machine Learning',
            category: 'Technical',
            difficulty: 'Medium',
            type: 'MCQ',
            sourceRef: 'MoSPI-NSSO-Standard',
            question: 'What is the primary advantage of predictive mean matching (PMM) over standard linear regression imputation for missing survey values?',
            options: ['PMM runs faster on GPU clusters', 'PMM preserves the observed empirical distribution by donor matching', 'PMM produces parametric confidence intervals directly', 'PMM requires zero training data'],
            correctAnswer: 1,
            explanation: 'PMM imputes only realistic donor values from observed units, preserving real discrete bounds.'
          }
        ]
      })
    );
  },

  async evaluateQuestion(questionId: string, selectedAnswer: number): Promise<any> {
    return safeFetch(
      `${API_BASE}/assessment/evaluate-question`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, selectedAnswer })
      },
      () => ({
        isCorrect: selectedAnswer === 1,
        explanation: 'Correct! The statistical standard method fulfills the cadre benchmark requirement.'
      })
    );
  },

  async submitAssessment(userId: string, answers: Record<string, number>): Promise<any> {
    return safeFetch(
      `${API_BASE}/assessment/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers })
      },
      () => ({
        score: 85,
        correctCount: 3,
        totalQuestions: 3,
        aiFeedback: 'Excellent performance in Sampling Design and Vectorized Python. Focus on Cloud Architecture to reach Advanced level.',
        updatedSkills: [
          { skillName: 'Sampling & Survey Design', category: 'Statistical', competencyScore: 88, competencyLevel: 'Advanced' },
          { skillName: 'Python for Statistical Data Analysis', category: 'Technical', competencyScore: 65, competencyLevel: 'Intermediate' }
        ]
      })
    );
  },

  // Quizzes & Generator
  async getQuizzes(options?: { role?: string; userId?: string; includeDeleted?: boolean }): Promise<{ quizzes: Quiz[] }> {
    return safeFetch(
      `${API_BASE}/quiz/list?${new URLSearchParams(options as any)}`,
      undefined,
      () => ({
        quizzes: SAMPLE_QUIZZES
      })
    );
  },

  async getQuizById(id: string): Promise<{ quiz: Quiz | null }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}`,
      undefined,
      () => ({
        quiz: SAMPLE_QUIZZES.find(q => q.id === id) || SAMPLE_QUIZZES[0]
      })
    );
  },

  async getAdminQuizStats(): Promise<AdminQuizStats> {
    return safeFetch(
      `${API_BASE}/quiz/admin/stats`,
      undefined,
      () => ({
        total: 8,
        published: 6,
        drafts: 2,
        active: 3,
        closed: 2,
        upcoming: 1
      })
    );
  },

  async getQuizParticipants(quizId: string): Promise<{ participants: any[]; total: number }> {
    return safeFetch(
      `${API_BASE}/quiz/admin/${quizId}/participants`,
      undefined,
      () => ({
        total: 2,
        participants: [
          { userId: 'u-1', name: 'Rajesh Sharma', email: 'rajesh.mospi@gov.in', designation: 'Statistical Officer', score: 85, status: 'SUBMITTED', completedAt: '2026-08-25T14:30:00Z' },
          { userId: 'u-3', name: 'Pooja Verma', email: 'pooja.verma@gov.in', designation: 'Junior Statistical Officer', score: 90, status: 'SUBMITTED', completedAt: '2026-08-26T11:20:00Z' }
        ]
      })
    );
  },

  async createQuiz(quizData: Partial<Quiz>): Promise<{ success: boolean; error?: string; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      },
      () => ({
        success: true,
        quiz: {
          id: `quiz-${Date.now()}`,
          title: quizData.title || 'New Quiz',
          description: quizData.description || '',
          targetSkill: quizData.targetSkill || 'General',
          createdBy: quizData.createdBy || 'Admin',
          createdAt: new Date().toISOString(),
          status: 'draft',
          questions: quizData.questions || [],
          timeLimitMinutes: quizData.timeLimitMinutes || 15,
          ...quizData
        } as Quiz
      })
    );
  },

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<{ success: boolean; error?: string; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      },
      () => ({
        success: true,
        quiz: {
          id,
          title: updates.title || 'Updated Quiz',
          description: updates.description || '',
          targetSkill: updates.targetSkill || 'General',
          createdBy: updates.createdBy || 'Admin',
          createdAt: new Date().toISOString(),
          status: updates.status || 'draft',
          questions: updates.questions || [],
          timeLimitMinutes: updates.timeLimitMinutes || 15,
          ...updates
        } as Quiz
      })
    );
  },

  async publishQuiz(id: string): Promise<{ success: boolean; error?: string; quiz?: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/publish`,
      { method: 'POST' },
      () => ({ success: true })
    );
  },

  async unpublishQuiz(id: string): Promise<{ success: boolean; error?: string; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/unpublish`,
      { method: 'POST' },
      () => ({
        success: true,
        quiz: {
          id,
          title: 'Quiz',
          description: '',
          targetSkill: 'General',
          createdBy: 'Admin',
          createdAt: new Date().toISOString(),
          status: 'draft',
          questions: [],
          timeLimitMinutes: 15
        } as Quiz
      })
    );
  },

  async closeQuiz(id: string): Promise<{ success: boolean; error?: string; closedAttemptsCount: number; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/close`,
      { method: 'POST' },
      () => ({
        success: true,
        closedAttemptsCount: 0,
        quiz: {
          id,
          title: 'Quiz',
          description: '',
          targetSkill: 'General',
          createdBy: 'Admin',
          createdAt: new Date().toISOString(),
          status: 'archived',
          questions: [],
          timeLimitMinutes: 15
        } as Quiz
      })
    );
  },

  async reopenQuiz(id: string, newEndAt: string): Promise<{ success: boolean; error?: string; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/reopen`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEndAt })
      },
      () => ({
        success: true,
        quiz: {
          id,
          title: 'Quiz',
          description: '',
          targetSkill: 'General',
          createdBy: 'Admin',
          createdAt: new Date().toISOString(),
          status: 'published',
          endAt: newEndAt,
          questions: [],
          timeLimitMinutes: 15
        } as Quiz
      })
    );
  },

  async updateQuizDeadline(id: string, newEndAt: string): Promise<{ success: boolean; error?: string; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/deadline`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEndAt })
      },
      () => ({
        success: true,
        quiz: {
          id,
          title: 'Quiz',
          description: '',
          targetSkill: 'General',
          createdBy: 'Admin',
          createdAt: new Date().toISOString(),
          status: 'published',
          endAt: newEndAt,
          questions: [],
          timeLimitMinutes: 15
        } as Quiz
      })
    );
  },

  async deleteQuiz(id: string): Promise<{ success: boolean; error?: string }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}`,
      { method: 'DELETE' },
      () => ({ success: true })
    );
  },

  async startQuizAttempt(param1: string, param2?: string): Promise<{ attempt: QuizAttempt; remainingSeconds: number }> {
    const quizId = param2 ? param1 : 'quiz-1';
    const userId = param2 ? param2 : param1;
    return safeFetch(
      `${API_BASE}/quiz/${quizId}/start`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      },
      () => ({
        attempt: {
          id: `att-${Date.now()}`,
          userId,
          quizId,
          status: 'IN_PROGRESS',
          startedAt: new Date().toISOString(),
          answers: {},
          submissionType: 'Manual',
          submissionReason: 'MANUAL_SUBMISSION',
          totalQuestions: 2
        } as QuizAttempt,
        remainingSeconds: 900
      })
    );
  },

  async submitQuiz(quizId: string, userId: string, answers: Record<string, number | null>, submissionType: 'Manual' | 'Auto-submitted', reason: QuizSubmissionReason, attemptId?: string, timeSpent?: number): Promise<any> {
    return safeFetch(
      `${API_BASE}/quiz/${quizId}/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers, submissionType, reason, attemptId, timeSpent })
      },
      () => ({
        attempt: {
          id: attemptId || `att-${Date.now()}`,
          userId,
          quizId,
          status: 'SUBMITTED',
          startedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
          answers,
          submissionType,
          submissionReason: reason,
          score: 100,
          correctCount: 2,
          incorrectCount: 0,
          unansweredCount: 0,
          totalQuestions: 2,
          timeSpentSeconds: timeSpent || 120,
          questionResults: [
            {
              questionId: 'q-1',
              question: 'In official NSS rounds, when is stratified sampling preferred over simple random sampling?',
              userAnswer: answers['q-1'] ?? 1,
              correctAnswer: 1,
              isCorrect: true,
              explanation: 'Stratification reduces overall sample variance by partitioning heterogeneous units into homogeneous strata.'
            },
            {
              questionId: 'q-2',
              question: 'What does a Design Effect (DEFF) of 1.5 signify in a cluster survey?',
              userAnswer: answers['q-2'] ?? 1,
              correctAnswer: 1,
              isCorrect: true,
              explanation: 'DEFF = Variance(Complex) / Variance(SRS). DEFF > 1 accounts for intra-cluster correlation.'
            }
          ],
          aiFeedback: 'Flawless execution on complex survey design! Your statistical competency is officially certified.'
        } as QuizAttempt,
        passed: true,
        scorePercentage: 100,
        scoreBoost: 15
      })
    );
  },

  async recordQuizAnswer(attemptId: string, questionId: string, selectedAnswer: number | null): Promise<any> {
    return safeFetch(
      `${API_BASE}/quiz/attempt/${attemptId}/answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, questionId, selectedAnswer })
      },
      () => ({ success: true })
    );
  },

  async submitQuizAttempt(attemptId: string, answers: Record<string, number>): Promise<{ success: boolean; attempt: QuizAttempt; passed: boolean; scorePercentage: number }> {
    return safeFetch(
      `${API_BASE}/quiz/attempt/${attemptId}/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      },
      () => ({
        success: true,
        passed: true,
        scorePercentage: 85,
        attempt: {
          id: attemptId,
          userId: 'u-1',
          quizId: 'quiz-1',
          status: 'SUBMITTED',
          startedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString(),
          answers,
          submissionType: 'Manual',
          submissionReason: 'MANUAL_SUBMISSION',
          score: 85,
          totalQuestions: 2
        } as QuizAttempt
      })
    );
  },

  async getActiveQuizAttempt(userId: string, quizId: string): Promise<{ attempt: QuizAttempt | null; remainingSeconds: number }> {
    return safeFetch(
      `${API_BASE}/quiz/${quizId}/attempt?userId=${userId}`,
      undefined,
      () => ({ attempt: null, remainingSeconds: 900 })
    );
  },

  async saveQuizDraftAnswers(attemptId: string, answers: Record<string, number>): Promise<{ success: boolean }> {
    return safeFetch(
      `${API_BASE}/quiz/attempt/${attemptId}/save-draft`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      },
      () => ({ success: true })
    );
  },

  // AI Generation
  async generateQuiz(payload: any): Promise<{ quiz: Quiz; questions: any[] }> {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const targetSkill = isFormData ? (payload.get('targetSkill') as string || 'Statistical Analysis') : (payload.targetSkill || 'Statistical Analysis');
    const topic = isFormData ? (payload.get('topic') as string || 'MoSPI Official Methodology') : (payload.topic || 'MoSPI Official Methodology');
    const difficulty = isFormData ? (payload.get('difficulty') as string || 'Medium') : (payload.difficulty || 'Medium');

    return safeFetch(
      `${API_BASE}/quiz/generate`,
      {
        method: 'POST',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? payload : JSON.stringify(payload)
      },
      () => ({
        quiz: {
          id: `quiz-gen-${Date.now()}`,
          title: `AI Synthesized Assessment: ${targetSkill}`,
          description: `Custom competency examination generated on ${new Date().toLocaleDateString('en-IN')}`,
          targetSkill,
          domain: 'Official Statistical System',
          topic,
          difficulty: difficulty as any,
          createdBy: 'AI Generator',
          createdAt: new Date().toISOString(),
          timeLimitMinutes: 15,
          passingScorePercentage: 60,
          status: 'draft',
          computedStatus: 'UPCOMING',
          questions: [
            {
              id: 'q-gen-1',
              skill: targetSkill,
              category: 'Statistical',
              difficulty: 'Medium',
              type: 'MCQ',
              sourceRef: 'AI Synthesis',
              question: `What is the core methodological principle in ${targetSkill} for public statistical registers?`,
              options: ['Minimizing standard errors through stratified calibration', 'Using arbitrary random draws', 'Ignoring cluster design effect', 'Omitting missing value imputation'],
              correctAnswer: 0,
              explanation: 'Calibration estimators utilize auxiliary register data to adjust sampling weights and minimize variance.'
            },
            {
              id: 'q-gen-2',
              skill: targetSkill,
              category: 'Statistical',
              difficulty: 'Medium',
              type: 'MCQ',
              sourceRef: 'AI Synthesis',
              question: `In modern ${targetSkill} workflows, which validation check detects outlier distortions?`,
              options: ['Mahalanobis distance & boxplot interquartile bounds', 'Manual visual printout scanning', 'Zero-variance filter only', 'Discarding all upper deciles'],
              correctAnswer: 0,
              explanation: 'Multivariate distance measures robustly pinpoint anomalous microdata records without biasing mean totals.'
            }
          ]
        } as Quiz,
        questions: []
      })
    );
  },

  async generateBankQuestions(payload: { targetSkill: string; questionCount: number; difficulty: string; subject?: string }): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/bank/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      },
      () => ({ success: true, count: payload.questionCount })
    );
  },

  async getBankQuestions(filters?: Record<string, string>): Promise<{ questions: BankQuestion[]; total: number }> {
    return safeFetch(
      `${API_BASE}/admin/bank?${new URLSearchParams(filters)}`,
      undefined,
      () => ({
        total: 2,
        questions: [
          {
            id: 'bq-1',
            skill: 'Sampling',
            category: 'Statistical',
            difficulty: 'Medium',
            type: 'MCQ',
            question: 'What is the primary formula for the Finite Population Correction (FPC) factor in sampling without replacement?',
            options: ['sqrt((N - n) / (N - 1))', '(N + n) / N', 'n / N', 'sqrt(N / n)'],
            correctAnswer: 0,
            explanation: 'FPC = sqrt((N-n)/(N-1)) adjusts standard error when sample size n exceeds 5% of population N.',
            sourceRef: 'MoSPI Standard Formula Guide',
            source: 'Manual Curation',
            subject: 'Sampling',
            topic: 'Variance Estimation',
            concepts: ['FPC', 'Variance Estimation'],
            tags: ['Sampling', 'Formulas'],
            usageCount: 12,
            status: 'approved',
            generatedAt: '2026-08-20'
          },
          {
            id: 'bq-2',
            skill: 'Python',
            category: 'Technical',
            difficulty: 'Medium',
            type: 'MCQ',
            question: 'Which Pandas function calculates exponential moving averages on time-series indicators?',
            options: ['df.ewm(span=12).mean()', 'df.rolling(12).mean()', 'df.shift(12)', 'df.cumsum()'],
            correctAnswer: 0,
            explanation: 'ewm() calculates exponentially weighted metrics, ideal for price index smoothing.',
            sourceRef: 'Pandas Documentation',
            source: 'AI Generator',
            subject: 'Python',
            topic: 'Time-Series Modeling',
            concepts: ['Smoothing', 'Exponential Moving Average'],
            tags: ['Python', 'Time-Series'],
            usageCount: 8,
            status: 'approved',
            generatedAt: '2026-08-22'
          }
        ]
      })
    );
  },

  async updateBankQuestion(id: string, updates: Partial<BankQuestion>): Promise<{ success: boolean; question: BankQuestion }> {
    return safeFetch(
      `${API_BASE}/admin/bank/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      },
      () => ({
        success: true,
        question: {
          id,
          skill: updates.skill || 'Sampling',
          category: updates.category || 'Statistical',
          difficulty: updates.difficulty || 'Medium',
          type: updates.type || 'MCQ',
          question: updates.question || '',
          options: updates.options || [],
          correctAnswer: updates.correctAnswer ?? 0,
          explanation: updates.explanation || '',
          sourceRef: updates.sourceRef || 'MoSPI',
          source: updates.source || 'Manual',
          subject: updates.subject || 'Sampling',
          topic: updates.topic || 'General',
          concepts: updates.concepts || [],
          tags: updates.tags || [],
          usageCount: updates.usageCount ?? 1,
          status: updates.status || 'approved',
          generatedAt: updates.generatedAt || new Date().toISOString()
        } as BankQuestion
      })
    );
  },

  async getBankStats(): Promise<BankStats> {
    return safeFetch(
      `${API_BASE}/admin/bank/stats`,
      undefined,
      () => ({
        totalQuestions: 480,
        approvedQuestions: 420,
        pendingQuestions: 60,
        subjectsCount: 5,
        topicsCount: 14,
        uniqueConceptsCount: 38,
        difficultyCounts: { Easy: 120, Medium: 260, Hard: 100 },
        typeCounts: { MCQ: 480 },
        subjects: ['Sampling', 'Python', 'National Accounts', 'AI/ML', 'Data Privacy']
      })
    );
  },

  async approveBankQuestion(id: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/bank/${id}/approve`,
      { method: 'PATCH' },
      () => ({ success: true, question: { id, status: 'approved' } })
    );
  },

  async deleteBankQuestion(id: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/bank/${id}`,
      { method: 'DELETE' },
      () => ({ success: true })
    );
  },

  // Admin Analytics
  async getAdminAnalytics(): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/analytics`,
      undefined,
      () => ({
        workforceOverview: {
          totalOfficials: 12450,
          officialsAssessed: 10820,
          averageCompetency: 68,
          officialsRequiringUpskilling: 3840,
          criticalSkillGapsCount: 4,
          activeAssessments: 3,
          trainingCompletionRate: 78,
          totalTrainingHours: '3.2M',
          coursesCompleted: 78420
        },
        coreCompetencyGaps: [
          { competency: 'Python & Statistical Computing', currentScore: 42, requiredScore: 75, gap: 33, proficiencyLevel: 'Developing', status: 'Needs Urgent Improvement', officialsAffected: 4850, severity: 'High' },
          { competency: 'Cloud Computing (MeghRaj)', currentScore: 25, requiredScore: 55, gap: 30, proficiencyLevel: 'Beginner', status: 'Critical Attention', officialsAffected: 1248, severity: 'High' },
          { competency: 'AI & Machine Learning', currentScore: 35, requiredScore: 65, gap: 30, proficiencyLevel: 'Developing', status: 'Needs Improvement', officialsAffected: 7720, severity: 'High' },
          { competency: 'Survey Methodology & CAPI', currentScore: 48, requiredScore: 75, gap: 27, proficiencyLevel: 'Developing', status: 'Critical Attention', officialsAffected: 4320, severity: 'High' },
          { competency: 'Data Visualization & PowerBI', currentScore: 55, requiredScore: 70, gap: 15, proficiencyLevel: 'Developing', status: 'Needs Improvement', officialsAffected: 3620, severity: 'Medium' },
          { competency: 'Cybersecurity & Governance', currentScore: 73, requiredScore: 75, gap: 2, proficiencyLevel: 'Proficient', status: 'Good Progress', officialsAffected: 890, severity: 'Low' },
          { competency: 'Statistics & Sampling Theory', currentScore: 81, requiredScore: 80, gap: 0, proficiencyLevel: 'Advanced', status: 'Well Aligned', officialsAffected: 450, severity: 'Mastered' },
          { competency: 'National Accounts & SNA 2008', currentScore: 82, requiredScore: 80, gap: 0, proficiencyLevel: 'Advanced', status: 'Well Aligned', officialsAffected: 620, severity: 'Mastered' }
        ],
        futureSkills: [
          { skill: 'AI-Assisted Statistical Analysis', expectedDemand: 'High', currentReadiness: 42, futureNeed: 80, predictedGap: 38 },
          { skill: 'Advanced Data Visualization & Storytelling', expectedDemand: 'High', currentReadiness: 55, futureNeed: 75, predictedGap: 20 },
          { skill: 'Machine Learning for Official Statistics', expectedDemand: 'High', currentReadiness: 34, futureNeed: 65, predictedGap: 31 },
          { skill: 'Statistical Programming & Python Vectorization', expectedDemand: 'High', currentReadiness: 46, futureNeed: 78, predictedGap: 32 }
        ],
        trainingEffectiveness: [
          { course: 'Python for Statistical Computing', preScore: 42, postScore: 75, uplift: 33 },
          { course: 'Sampling & Survey Methodologies', preScore: 61, postScore: 89, uplift: 28 },
          { course: 'Cloud Infrastructure for Statisticians', preScore: 25, postScore: 58, uplift: 33 },
          { course: 'National Accounts & SNA 2008', preScore: 58, postScore: 84, uplift: 26 }
        ]
      })
    );
  },

  async getAdminSkillGaps(): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/gaps`,
      undefined,
      () => ({
        organizationGaps: [
          { skill: 'Python for Statistical Data Analysis', gapPercent: 33, cadre: 'Subordinate Statistical Service (SSS)', affectedOfficials: 4850 },
          { skill: 'Cloud Computing (MeghRaj & S3)', gapPercent: 30, cadre: 'Data Processing Cadre', affectedOfficials: 1248 },
          { skill: 'AI & Machine Learning on Registries', gapPercent: 30, cadre: 'Indian Statistical Service (ISS)', affectedOfficials: 7720 },
          { skill: 'Survey Methodology & CAPI Validation', gapPercent: 27, cadre: 'Field Operations Division (NSSO)', affectedOfficials: 4320 },
          { skill: 'Data Visualization & PowerBI Dashboards', gapPercent: 15, cadre: 'All Statistical Cadres', affectedOfficials: 3620 }
        ]
      })
    );
  },

  async getCompetencyFrameworks(): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/competency-framework`,
      undefined,
      () => ({
        frameworks: [
          {
            roleName: 'Statistical Officer (SSS)',
            cadre: 'Subordinate Statistical Service',
            requiredSkills: [
              { skillName: 'Sampling & Survey Design', requiredScore: 80, level: 'Proficient' },
              { skillName: 'Python for Statistical Data Analysis', requiredScore: 75, level: 'Proficient' },
              { skillName: 'Survey Methodology & CAPI', requiredScore: 75, level: 'Proficient' },
              { skillName: 'Data Visualization & PowerBI', requiredScore: 70, level: 'Intermediate' },
              { skillName: 'AI & Machine Learning', requiredScore: 65, level: 'Intermediate' },
              { skillName: 'Cloud Computing (MeghRaj)', requiredScore: 55, level: 'Intermediate' },
              { skillName: 'Cybersecurity & DPDP Governance', requiredScore: 75, level: 'Proficient' }
            ]
          },
          {
            roleName: 'Director (Training & Intelligence)',
            cadre: 'Indian Statistical Service (ISS)',
            requiredSkills: [
              { skillName: 'Sampling & Survey Design', requiredScore: 90, level: 'Advanced' },
              { skillName: 'National Accounts & SNA 2008', requiredScore: 90, level: 'Advanced' },
              { skillName: 'AI & Machine Learning', requiredScore: 85, level: 'Advanced' },
              { skillName: 'Cybersecurity & DPDP Governance', requiredScore: 85, level: 'Advanced' }
            ]
          }
        ]
      })
    );
  },

  async updateCompetencyFramework(framework: any): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/competency-framework`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(framework)
      },
      () => ({ success: true })
    );
  },

  // StatBot AI Chat
  async sendChatMessage(message: string, userId: string, history?: any[], sessionContext?: any): Promise<any> {
    return safeFetch(
      `${API_BASE}/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId, history, sessionContext })
      },
      () => {
        const q = message.toLowerCase();
        let answer = `Namaste! I analyzed your query regarding "${message}". Based on official MoSPI standards, continuous adaptive upskilling ensures optimal cadre readiness.`;
        if (q.includes('gap') || q.includes('skill')) {
          answer = `Based on your diagnostic profile, your largest competency deficit is **Python for Statistical Data Analysis (-33% gap)** and **Cloud Computing (-30% gap)**. I recommend starting the Kaggle Learn Python module and taking the 5-question practice quiz.`;
        } else if (q.includes('learn') || q.includes('next')) {
          answer = `Your next recommended step is **Phase 1: High Priority Deficit Remediation** in your Personalized Learning Pathway. Complete the Python and Cloud modules, then submit the practice assessment.`;
        } else if (q.includes('python') || q.includes('pandas')) {
          answer = `Here is how to calculate grouped weighted averages in Python:\n\n\`\`\`python\nimport pandas as pd\n\ndef weighted_avg(df, val_col, weight_col):\n    return (df[val_col] * df[weight_col]).sum() / df[weight_col].sum()\n\ngrouped = df.groupby('region').apply(weighted_avg, 'consumption', 'weight')\n\`\`\``;
        }

        return {
          answer,
          cards: [
            {
              title: 'Personalized Learning Pathway',
              subtitle: '4-Phase Modular Roadmap',
              actionLabel: 'Open Learning Path',
              actionUrl: '/learning-path',
              tag: 'AI Recommendation'
            }
          ],
          suggestedActions: [
            { label: 'View Skill Gaps', url: '/skill-gaps', promptText: 'What are my skill gaps?' },
            { label: 'Take Practice Quiz', url: '/assessment', promptText: 'Launch practice quiz' }
          ],
          sessionContext: { lastQuery: message }
        };
      }
    );
  },

  // Notifications
  async getNotifications(userId: string): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    return safeFetch(
      `${API_BASE}/notifications?userId=${userId}`,
      undefined,
      () => ({
        unreadCount: 2,
        notifications: [
          {
            id: 'n-1',
            userId,
            title: 'New AI Practice Quiz Available',
            message: 'A 5-question mini practice assessment is ready for Python for Statistical Data Analysis.',
            type: 'assessment',
            read: false,
            timestamp: '10m ago',
            actionUrl: '/learning-path'
          },
          {
            id: 'n-2',
            userId,
            title: 'NSSTA Programme Nomination Open',
            message: 'Nominations are open for the residential Advanced Sampling Techniques workshop at Greater Noida.',
            type: 'nssta',
            read: false,
            timestamp: '2h ago',
            actionUrl: '/nssta'
          }
        ]
      })
    );
  },

  async markNotificationRead(id: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/notifications/${id}/read`,
      { method: 'PATCH' },
      () => ({ success: true })
    );
  },

  async markAllNotificationsRead(userId: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/notifications/read-all`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      },
      () => ({ success: true })
    );
  },

  // Learning Cycle & Practice Quizzes
  async completeCourse(userId: string, courseId: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/complete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, courseId })
      },
      () => ({
        success: true,
        message: 'Course marked completed! Competency score boosted by +8%.'
      })
    );
  },

  async getPracticeQuestions(skill: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/practice/${encodeURIComponent(skill)}`,
      undefined,
      () => ({
        skill,
        questions: [
          {
            id: `pq-1-${skill}`,
            skill,
            question: `In official statistical data processing with ${skill}, what is the primary methodology for handling non-sampling errors?`,
            options: ['Calibrated ratio imputation & logic rule validation', 'Discarding incomplete survey records', 'Assuming errors cancel each other out randomly', 'Replacing all outliers with zero'],
            correctAnswer: 0,
            explanation: 'Calibrated imputation maintains the representative distribution of the survey sample.'
          },
          {
            id: `pq-2-${skill}`,
            skill,
            question: `Which technique preserves microdata privacy under DPDP Act 2023 when disseminating ${skill} datasets?`,
            options: ['k-Anonymity & Differential Privacy noise addition', 'Releasing raw identifier columns', 'Simple MD5 hashing of names only', 'Unencrypted public CSV export'],
            correctAnswer: 0,
            explanation: 'k-Anonymity and Differential Privacy prevent re-identification attacks on public statistical microdata.'
          }
        ]
      })
    );
  },

  async submitPracticeQuiz(userId: string, skillName: string, selectedAnswers: { [questionId: string]: number }): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/practice/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, skillName, selectedAnswers })
      },
      () => ({
        success: true,
        score: 100,
        passed: true,
        scoreBoost: 12,
        feedback: 'Outstanding mastery demonstrated! Competency level officially upgraded.'
      })
    );
  },

  async getPracticeHistory(userId: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/practice/history?userId=${userId}`,
      undefined,
      () => ({ attempts: [] })
    );
  },

  // Admin Course Management
  async getAdminCourses(): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/courses`,
      undefined,
      () => ({
        courses: [
          {
            id: 'c-1',
            title: 'Python for Statistical Data Analysis',
            provider: 'Kaggle Learn / iGOT',
            skill: 'Python',
            difficulty: 'Intermediate',
            duration: '8 hours',
            externalUrl: 'https://www.kaggle.com/learn/python',
            description: 'Comprehensive Python for statistical modeling and data cleaning.',
            status: 'active'
          },
          {
            id: 'c-2',
            title: 'Government Cloud Infrastructure for Statisticians',
            provider: 'Microsoft Learn / MeghRaj',
            skill: 'Cloud Computing',
            difficulty: 'Beginner',
            duration: '6 hours',
            externalUrl: 'https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/',
            description: 'Secure cloud data pipelines and microdata storage.',
            status: 'active'
          },
          {
            id: 'c-3',
            title: 'AI & Machine Learning for Official Statistics',
            provider: 'Google / Coursera',
            skill: 'AI/ML',
            difficulty: 'Intermediate',
            duration: '12 hours',
            externalUrl: 'https://www.coursera.org/learn/machine-learning',
            description: 'Machine learning for automated classification and predictive imputation.',
            status: 'active'
          }
        ]
      })
    );
  },

  async createAdminCourse(course: any): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/courses`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      },
      () => ({ success: true, course: { id: `c-${Date.now()}`, ...course } })
    );
  },

  async updateAdminCourse(id: string, course: any): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/courses/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      },
      () => ({ success: true, course: { id, ...course } })
    );
  },

  async deleteAdminCourse(id: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/courses/${id}`,
      { method: 'DELETE' },
      () => ({ success: true })
    );
  },

  async toggleAdminCourseStatus(id: string, status: 'active' | 'inactive'): Promise<any> {
    return safeFetch(
      `${API_BASE}/igot/courses/${id}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      },
      () => ({ success: true, status })
    );
  },

  // Admin Skill & Benchmark Management
  async getAdminSkills(): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/skills`,
      undefined,
      () => ({
        skills: [
          { id: 'sk-1', name: 'Sampling & Survey Design', category: 'Statistical', benchmark: 80 },
          { id: 'sk-2', name: 'Python for Statistical Data Analysis', category: 'Technical', benchmark: 75 },
          { id: 'sk-3', name: 'Cloud Computing (MeghRaj)', category: 'Technical', benchmark: 55 },
          { id: 'sk-4', name: 'AI & Machine Learning', category: 'Technical', benchmark: 65 }
        ]
      })
    );
  },

  async createAdminSkill(skill: any): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/skills`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill)
      },
      () => ({ success: true, skill: { id: `sk-${Date.now()}`, ...skill } })
    );
  },

  async updateAdminSkill(id: string, skill: any): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/skills/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill)
      },
      () => ({ success: true, skill: { id, ...skill } })
    );
  },

  async deleteAdminSkill(id: string): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/skills/${id}`,
      { method: 'DELETE' },
      () => ({ success: true })
    );
  },

  async updateSkillBenchmark(roleName: string, skillId: string, requiredScore: number): Promise<any> {
    return safeFetch(
      `${API_BASE}/admin/benchmarks/skill`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleName, skillId, requiredScore })
      },
      () => ({ success: true, roleName, skillId, requiredScore })
    );
  }
};
