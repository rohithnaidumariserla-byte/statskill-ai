import {
  User, Skill, UserSkill, CourseRecommendation, NSSTAProgramme,
  Quiz, QuizAttempt, AdminQuizStats, GapAnalysisReport, NotificationItem,
  BankQuestion, BankStats, Course, AssessmentQuestion, QuizSubmissionReason,
  QuizDynamicStatus
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

// ============================================================================
// OFFICIAL COURSE CATALOGUE (12 Full Modules)
// ============================================================================
export const ALL_OFFICIAL_COURSES: CourseRecommendation[] = [
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
    isEnrolled: true,
    progress: 40,
    breakdown: { skillGapWeight: 35, roleRelevanceWeight: 25, previousLearningWeight: 15, careerRequirementWeight: 10, deptPriorityWeight: 8, emergingDemandWeight: 7 }
  },
  {
    course: {
      id: 'c-2',
      title: 'AI & Machine Learning for Official Statistics',
      provider: 'Google / Coursera / iGOT',
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
      externalUrl: 'https://developers.google.com/machine-learning/crash-course',
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
    progress: 0,
    breakdown: { skillGapWeight: 30, roleRelevanceWeight: 25, previousLearningWeight: 14, careerRequirementWeight: 10, deptPriorityWeight: 7, emergingDemandWeight: 6 }
  },
  {
    course: {
      id: 'c-3',
      title: 'Spatial Analytics & GIS in Government Surveys',
      provider: 'Coursera / iGOT',
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
      externalUrl: 'https://www.coursera.org/learn/gis',
      status: 'active'
    },
    matchScore: 88,
    priorityLevel: 'MEDIUM PRIORITY',
    currentScore: 48,
    requiredScore: 60,
    gap: 12,
    whyReason: 'Cadre requirement for digital field survey validation and village-level GIS stratification.',
    reason: 'Supports spatial microdata verification and Urban Frame Survey (UFS) modernization.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 25, roleRelevanceWeight: 25, previousLearningWeight: 15, careerRequirementWeight: 10, deptPriorityWeight: 8, emergingDemandWeight: 5 }
  },
  {
    course: {
      id: 'c-4',
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
      description: 'Architecting secure statistical data pipelines on Government Cloud (MeghRaj & Azure), S3 microdata storage, and Zero Trust access control.',
      syllabus: [
        'Overview of GI Cloud (MeghRaj) Ecosystem',
        'Secure Data Storage and Encryption for Microdata',
        'Deploying Automated Data Pipelines on Gov Cloud',
        'Access Control, Audit Logging, and Zero-Trust Principles'
      ],
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
    progress: 0,
    breakdown: { skillGapWeight: 33, roleRelevanceWeight: 24, previousLearningWeight: 15, careerRequirementWeight: 10, deptPriorityWeight: 7, emergingDemandWeight: 7 }
  },
  {
    course: {
      id: 'c-5',
      title: 'Advanced SQL for National Statistical Registers',
      provider: 'Kaggle Learn / iGOT',
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
      externalUrl: 'https://www.kaggle.com/learn/intro-to-sql',
      status: 'active'
    },
    matchScore: 85,
    priorityLevel: 'MEDIUM PRIORITY',
    currentScore: 73,
    requiredScore: 80,
    gap: 7,
    whyReason: 'High-speed administrative register linkage and SQL data warehousing for census verification.',
    reason: 'Strengthens complex analytical SQL queries for national database registers.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 20, roleRelevanceWeight: 25, previousLearningWeight: 18, careerRequirementWeight: 10, deptPriorityWeight: 8, emergingDemandWeight: 4 }
  },
  {
    course: {
      id: 'c-6',
      title: 'Modern Data Visualization with PowerBI for Public Policy',
      provider: 'Microsoft Learn / iGOT',
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
      externalUrl: 'https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/',
      status: 'active'
    },
    matchScore: 84,
    priorityLevel: 'MEDIUM PRIORITY',
    currentScore: 55,
    requiredScore: 70,
    gap: 15,
    whyReason: 'Key dissemination skill gap (-15%) for public policy briefs and ministry dashboards.',
    reason: 'Enables high-impact visual communication of official macroeconomic and survey metrics.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 22, roleRelevanceWeight: 24, previousLearningWeight: 16, careerRequirementWeight: 10, deptPriorityWeight: 8, emergingDemandWeight: 4 }
  },
  {
    course: {
      id: 'c-7',
      title: 'Data Privacy & The Digital Personal Data Protection Act 2023',
      provider: 'MeitY / iGOT',
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
        'DPDP Act 2023: Rights, Obligations, and Government Exemptions',
        'Statistical Confidentiality vs Public Dissemination',
        'Mathematical Anonymization: k-Anonymity, l-Diversity, and t-Closeness',
        'Differential Privacy in Census & Survey Public Microdata'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      externalUrl: 'https://www.meity.gov.in/data-protection-framework',
      status: 'active'
    },
    matchScore: 86,
    priorityLevel: 'MEDIUM PRIORITY',
    currentScore: 73,
    requiredScore: 75,
    gap: 2,
    whyReason: 'Legal and technical compliance with the Digital Personal Data Protection Act 2023 for statistical microdata.',
    reason: 'Essential governance compliance for all data processing officers.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 18, roleRelevanceWeight: 28, previousLearningWeight: 15, careerRequirementWeight: 12, deptPriorityWeight: 9, emergingDemandWeight: 4 }
  },
  {
    course: {
      id: 'c-8',
      title: 'National Accounts Statistics & SNA 2008 Implementation',
      provider: 'NSSTA / MoSPI',
      skill: 'National Accounts',
      skillCategory: 'Statistical',
      difficulty: 'Advanced',
      duration: '14 hours',
      durationHours: 14,
      rating: 4.9,
      enrolledCount: 850,
      source: 'NSSTA',
      description: 'Deep dive into System of National Accounts (SNA 2008), Gross Value Added (GVA) estimation, Supply and Use Tables, and GDP base revision methodologies.',
      syllabus: [
        'SNA 2008 Conceptual Framework and Institutional Sectors',
        'Gross Value Added (GVA) Compilation Across 8 Economic Activities',
        'Supply-Use Tables (SUT) and Input-Output Modeling',
        'Revising Base Years: Price Indices, Deflators, and Chain-Linking'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
      externalUrl: 'https://mospi.gov.in/national-accounts-division',
      status: 'active'
    },
    matchScore: 91,
    priorityLevel: 'HIGH PRIORITY',
    currentScore: 82,
    requiredScore: 80,
    gap: 0,
    whyReason: 'Core discipline for MoSPI National Accounts Division GVA and GDP quarterly estimation.',
    reason: 'Mastery module for national economic accounting and SNA 2008 compliance.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 20, roleRelevanceWeight: 30, previousLearningWeight: 18, careerRequirementWeight: 12, deptPriorityWeight: 8, emergingDemandWeight: 3 }
  },
  {
    course: {
      id: 'c-9',
      title: 'Advanced Survey Sampling & Estimation Techniques',
      provider: 'NSSTA TPAC',
      skill: 'Sampling',
      skillCategory: 'Statistical',
      difficulty: 'Advanced',
      duration: '15 hours',
      durationHours: 15,
      rating: 4.9,
      enrolledCount: 1600,
      source: 'NSSTA',
      description: 'Theory and practice of complex multi-stage sampling designs, stratified PPS sampling, design effects (DEFF), multiplier generation, and sub-sample variance estimation.',
      syllabus: [
        'Two-Stage Stratified Sampling Design in National Sample Surveys',
        'Probability Proportional to Size (PPS) Selection of PSUs',
        'Calculating Sampling Weights and Multipliers for NSS Rounds',
        'Jackknife and Bootstrap Variance Estimation in Complex Surveys'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      externalUrl: 'https://unstats.un.org/unsd/methodology/surveys/',
      status: 'active'
    },
    matchScore: 94,
    priorityLevel: 'HIGH PRIORITY',
    currentScore: 81,
    requiredScore: 80,
    gap: 0,
    whyReason: 'Foundational statistical discipline for NSSO household surveys and field operations validation.',
    reason: 'Core expertise required for official sample survey design and multiplier estimation.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 22, roleRelevanceWeight: 30, previousLearningWeight: 18, careerRequirementWeight: 12, deptPriorityWeight: 8, emergingDemandWeight: 4 }
  },
  {
    course: {
      id: 'c-10',
      title: 'Index Numbers & Price Statistics (CPI / WPI)',
      provider: 'MoSPI / iGOT',
      skill: 'Statistical',
      skillCategory: 'Statistical',
      difficulty: 'Intermediate',
      duration: '6 hours',
      durationHours: 6,
      rating: 4.8,
      enrolledCount: 920,
      source: 'iGOT',
      description: 'Construction of Laspeyres, Paasche, and Fisher index numbers, Consumer Price Index (CPI) basket weighting, geometric mean aggregations, and quality adjustment.',
      syllabus: [
        'Axiomatic and Economic Approaches to Index Numbers',
        'Consumer Price Index (CPI) Rural/Urban Weighting Schemes',
        'Hedonic Quality Adjustments and Replacement Items in Price Surveys',
        'Compiling Core Inflation and Volatility Indices'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80',
      externalUrl: 'https://mospi.gov.in/cpi',
      status: 'active'
    },
    matchScore: 83,
    priorityLevel: 'MEDIUM PRIORITY',
    currentScore: 70,
    requiredScore: 75,
    gap: 5,
    whyReason: 'Monthly CPI index computation and field price quotation scrutiny.',
    reason: 'Strengthens price collection verification and Laspeyres index compilation.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 20, roleRelevanceWeight: 25, previousLearningWeight: 16, careerRequirementWeight: 11, deptPriorityWeight: 8, emergingDemandWeight: 3 }
  },
  {
    course: {
      id: 'c-11',
      title: 'Time Series Analysis & Seasonal Adjustment for Macroeconomic Indicators',
      provider: 'Swayam / iGOT',
      skill: 'Technical',
      skillCategory: 'Statistical',
      difficulty: 'Advanced',
      duration: '11 hours',
      durationHours: 11,
      rating: 4.8,
      enrolledCount: 670,
      source: 'iGOT',
      description: 'ARIMA modeling, X-13ARIMA-SEATS seasonal adjustment for official IIP and GDP series, trend-cycle extraction, and economic turning-point detection.',
      syllabus: [
        'Stationarity, Unit Roots, and Cointegration in Macro Series',
        'X-13ARIMA-SEATS Seasonal Adjustment Protocol',
        'Nowcasting Economic Indicators with High-Frequency Regressors',
        'Calendar and Festival Effects Modeling in Indian Series'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80',
      externalUrl: 'https://swayam.gov.in',
      status: 'active'
    },
    matchScore: 82,
    priorityLevel: 'MEDIUM PRIORITY',
    currentScore: 60,
    requiredScore: 70,
    gap: 10,
    whyReason: 'Seasonal adjustment and trend forecasting for Index of Industrial Production (IIP).',
    reason: 'Advanced macro time-series analysis for quarterly economic reporting.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 20, roleRelevanceWeight: 24, previousLearningWeight: 16, careerRequirementWeight: 11, deptPriorityWeight: 8, emergingDemandWeight: 3 }
  },
  {
    course: {
      id: 'c-12',
      title: 'Cybersecurity Essentials for Government Officers',
      provider: 'NIC / Cyberdost / iGOT',
      skill: 'Cybersecurity',
      skillCategory: 'Digital Governance',
      difficulty: 'Beginner',
      duration: '4 hours',
      durationHours: 4,
      rating: 4.9,
      enrolledCount: 5600,
      source: 'iGOT',
      description: 'Critical cyber hygiene, phishing prevention, secure handling of government credentials, multi-factor authentication, and incident reporting protocols.',
      syllabus: [
        'Government Cyber Security Guidelines & CERT-In Directives',
        'Phishing, Social Engineering & Ransomware Defense',
        'Secure Remote Working and NIC Email Protocols',
        'Incident Response and Information Security Audits'
      ],
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      externalUrl: 'https://www.cisa.gov/cybersecurity-basics',
      status: 'active'
    },
    matchScore: 80,
    priorityLevel: 'LOW PRIORITY',
    currentScore: 73,
    requiredScore: 75,
    gap: 2,
    whyReason: 'Mandatory government cyber hygiene compliance for official portal access.',
    reason: 'Essential baseline cyber protection protocol for government workstations.',
    isEnrolled: false,
    progress: 0,
    breakdown: { skillGapWeight: 15, roleRelevanceWeight: 25, previousLearningWeight: 18, careerRequirementWeight: 12, deptPriorityWeight: 6, emergingDemandWeight: 4 }
  }
];

// ============================================================================
// COMPREHENSIVE QUESTION BANK & SEED QUESTIONS (25+ Curated Official Questions)
// ============================================================================
export const CURATED_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q-1',
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In official NSS rounds, when is stratified sampling preferred over simple random sampling?',
    options: [
      'When distinct sub-populations (urban/rural) exhibit high inter-strata variance and homogeneous intra-strata variance',
      'When population elements are completely homogeneous across the entire country',
      'When sample size is strictly under 10 units',
      'When no sampling frame exists'
    ],
    correctAnswer: 0,
    explanation: 'Stratification partitions a heterogeneous population into homogeneous strata, decreasing overall sampling variance and ensuring representation of sub-domains.',
    sourceRef: 'MoSPI NSS Handbook 2025'
  },
  {
    id: 'q-2',
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'What does a Design Effect (DEFF) of 1.5 signify in a two-stage cluster survey?',
    options: [
      'Cluster design requires 50% smaller sample size than SRS',
      'Cluster sampling requires 50% larger sample size to achieve the same sampling precision as simple random sampling',
      'The survey has a 1.5% non-response rate',
      'The sample variance is zero'
    ],
    correctAnswer: 1,
    explanation: 'DEFF = Variance(Complex Design) / Variance(SRS). DEFF = 1.5 indicates that clustering increases variance by 50% due to intra-cluster correlation.',
    sourceRef: 'UN Household Sample Survey Guidelines'
  },
  {
    id: 'q-3',
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'In two-stage PPS sampling, if Primary Sampling Units (PSUs) are selected with Probability Proportional to Size, how should Ultimate Sampling Units (USUs) be selected to create a self-weighting sample?',
    options: [
      'Select a fixed number of USUs from each selected PSU with equal probability',
      'Select a varying number of USUs proportional to PSU size squared',
      'Select all households in the PSU without sampling',
      'Use quota sampling in the second stage'
    ],
    correctAnswer: 0,
    explanation: 'Selecting a fixed number of ultimate units from each PSU chosen with PPS creates a self-weighting sample design where every ultimate unit has an equal overall probability of selection.',
    sourceRef: 'MoSPI Sampling Standards'
  },
  {
    id: 'q-4',
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'What is the formula for calculating the sampling multiplier (expansion factor) for a unit with selection probability p_i?',
    options: [
      'Multiplier = 1 / p_i',
      'Multiplier = p_i * 100',
      'Multiplier = sqrt(p_i)',
      'Multiplier = 1 - p_i'
    ],
    correctAnswer: 0,
    explanation: 'The Horvitz-Thompson expansion weight is the inverse of the selection probability (w_i = 1 / p_i).',
    sourceRef: 'MoSPI Estimation Manual'
  },
  {
    id: 'q-5',
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Which method is standard for estimating standard errors in complex NSS survey designs where analytical formulas are intractable?',
    options: [
      'Sub-sample replication (Jackknife / Balanced Repeated Replication)',
      'Assuming Poisson distribution on national aggregates',
      'Ignoring design effect and applying standard SRS formulas',
      'Doubling the sample mean'
    ],
    correctAnswer: 0,
    explanation: 'Replication techniques such as Jackknife and BRR utilize independent sub-sample replicates to empirically compute complex survey variance.',
    sourceRef: 'MoSPI Variance Estimation Compendium'
  },
  {
    id: 'q-6',
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In Python Pandas, which operation computes grouped median imputation without Python-level loop overhead?',
    options: [
      'df["val"] = df.groupby("stratum")["val"].transform(lambda x: x.fillna(x.median()))',
      'for i, r in df.iterrows(): df.loc[i, "val"] = r["val"] if r["val"] else 0',
      'df.fillna(df.mean()) directly on the entire table',
      'df.dropna()'
    ],
    correctAnswer: 0,
    explanation: 'groupby().transform() executes vectorized operations directly across partition buffers without Python for-loop overhead.',
    sourceRef: 'Python Data Science for Official Statistics'
  },
  {
    id: 'q-7',
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'Which NumPy function efficiently computes weighted averages on large array columns with survey weights?',
    options: [
      'np.average(df["val"], weights=df["weight"])',
      'np.mean(df["val"]) * np.mean(df["weight"])',
      'df["val"].sum() / len(df)',
      'np.dot(df["val"], df["val"])'
    ],
    correctAnswer: 0,
    explanation: 'np.average(a, weights=w) performs C-level SIMD vectorized weighted aggregation: sum(a * w) / sum(w).',
    sourceRef: 'NumPy Scientific Computing Guide'
  },
  {
    id: 'q-8',
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'When processing billion-row microdata tables in Python, which data format provides column-level compression, fast push-down predicates, and zero-copy reads?',
    options: [
      'Apache Parquet / Feather with PyArrow engine',
      'Uncompressed CSV text files',
      'Standard Python pickle serialization',
      'JSON Lines without indexing'
    ],
    correctAnswer: 0,
    explanation: 'Apache Parquet organizes data into columnar byte chunks with Snappy/ZSTD compression, enabling memory-efficient query projection and push-down filtering.',
    sourceRef: 'High Performance Python for Data Engineering'
  },
  {
    id: 'q-9',
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Easy',
    type: 'MCQ',
    question: 'How do you filter a DataFrame in Pandas to select records where "sector" is "Rural" and "consumption" > 2500?',
    options: [
      'df[(df["sector"] == "Rural") & (df["consumption"] > 2500)]',
      'df[df["sector"] == "Rural" and df["consumption"] > 2500]',
      'df.filter("sector == Rural and consumption > 2500")',
      'df.where("Rural", 2500)'
    ],
    correctAnswer: 0,
    explanation: 'Bitwise & operator combined with boolean masks is the standard Pandas syntax for element-wise boolean compound indexing.',
    sourceRef: 'Pandas Official Documentation'
  },
  {
    id: 'q-10',
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Which library is recommended for distributed out-of-core statistical computing when survey microdata exceeds workstation RAM?',
    options: [
      'Dask / Polars Lazy API',
      'Standard Python built-in lists',
      'math module',
      'Tkinter'
    ],
    correctAnswer: 0,
    explanation: 'Dask and Polars Lazy APIs partition large datasets into task computation graphs that evaluate out-of-core chunks without exhausting RAM.',
    sourceRef: 'MoSPI Modernization Whitepaper'
  },
  {
    id: 'q-11',
    skill: 'AI/ML',
    category: 'Technical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'When training an NLP classifier for automated National Industrial Classification (NIC 2008) 5-digit code assignment, why is class-weighted macro F1-score used rather than raw accuracy?',
    options: [
      'Because economic activities in surveys have severe class imbalance (e.g. retail trade vs rare heavy mining)',
      'Because raw accuracy cannot be calculated on text',
      'Because macro F1 ignores all errors',
      'Because NIC codes are continuous numerical variables'
    ],
    correctAnswer: 0,
    explanation: 'Survey responses have heavy class imbalances; raw accuracy would look high by only predicting frequent retail classes while failing on minority strategic industries.',
    sourceRef: 'UNECE Machine Learning Guidelines'
  },
  {
    id: 'q-12',
    skill: 'AI/ML',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'What is the primary advantage of Predictive Mean Matching (PMM) over standard linear regression imputation for missing survey values?',
    options: [
      'PMM imputes only real donor values observed in the actual data, preserving discrete constraints and bounds',
      'PMM runs with zero computational memory',
      'PMM requires no observed data',
      'PMM guarantees zero variance'
    ],
    correctAnswer: 0,
    explanation: 'PMM matches regression predictions to the nearest observed donor case, ensuring all imputed values are legitimate real-world quantities.',
    sourceRef: 'UN Imputation Standards'
  },
  {
    id: 'q-13',
    skill: 'National Accounts',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Under UN System of National Accounts (SNA 2008), how is Research and Development (R&D) expenditure categorized in GDP compilation?',
    options: [
      'Gross Fixed Capital Formation (Intellectual Property Asset)',
      'Intermediate Consumption of the producing enterprise',
      'Household Final Consumption Expenditure',
      'Omitted from national balance sheets'
    ],
    correctAnswer: 0,
    explanation: 'SNA 2008 recognizes R&D expenditures that deliver future economic benefit as Gross Fixed Capital Formation (GFCF).',
    sourceRef: 'UN SNA 2008 Manual'
  },
  {
    id: 'q-14',
    skill: 'National Accounts',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In Supply-Use Tables (SUT), what identity must hold for every product row at purchasers prices?',
    options: [
      'Total Output + Imports + Trade & Transport Margins + Taxes less Subsidies on Products = Intermediate Use + Final Uses + Exports',
      'Total Output = Total Imports',
      'Taxes on Products = Subsidies on Products',
      'Intermediate Consumption = Gross Operating Surplus'
    ],
    correctAnswer: 0,
    explanation: 'Total supply at purchasers prices must identically equal total product uses across the economy in balanced SUT frameworks.',
    sourceRef: 'CSO National Accounts Compendium'
  },
  {
    id: 'q-15',
    skill: 'National Accounts',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'What is the double deflation method in constant price Gross Value Added (GVA) estimation?',
    options: [
      'Deflating gross output with an output price index and intermediate inputs with an input price index independently',
      'Dividing nominal GVA by CPI twice',
      'Applying GDP deflator to all industries uniformly',
      'Multiplying current GVA by the inflation rate'
    ],
    correctAnswer: 0,
    explanation: 'Double deflation computes real GVA as (Real Output - Real Intermediate Inputs) using specific product-level deflators for each component.',
    sourceRef: 'IMF National Accounts Compilation Guide'
  },
  {
    id: 'q-16',
    skill: 'Data Privacy',
    category: 'Digital Governance',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'Under the Digital Personal Data Protection (DPDP) Act 2023, which privacy technique provides mathematical bounds on information leakage when releasing microdata tables?',
    options: [
      'Epsilon-Differential Privacy with calibrated noise addition',
      'Simple hashing of first names only',
      'Storing data in an unencrypted zip file',
      'Deleting only the phone number column'
    ],
    correctAnswer: 0,
    explanation: 'Differential Privacy mathematically guarantees that an adversaries knowledge about any individual is strictly bounded by parameter epsilon.',
    sourceRef: 'DPDP Act 2023 & United Nations Statistical Commission'
  },
  {
    id: 'q-17',
    skill: 'Data Privacy',
    category: 'Digital Governance',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In statistical disclosure control, what does k-Anonymity require for public release of microdata?',
    options: [
      'Each combination of quasi-identifiers (e.g. Age, Gender, District) must be shared by at least k distinct individuals',
      'The file must have at least k rows',
      'Data must be deleted after k days',
      'Only k columns are allowed in the file'
    ],
    correctAnswer: 0,
    explanation: 'k-Anonymity guarantees that no individual can be uniquely linked to fewer than k records in the published anonymized dataset.',
    sourceRef: 'Statistical Disclosure Control Handbook'
  },
  {
    id: 'q-18',
    skill: 'GIS',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In spatial survey validation for Urban Frame Surveys (UFS), what does the Global Moran I statistic evaluate?',
    options: [
      'The degree of spatial autocorrelation (clustering vs dispersion) across enumeration blocks',
      'The battery life of survey tablets',
      'The total polygon perimeter of India',
      'The GPS satellite orbital speed'
    ],
    correctAnswer: 0,
    explanation: 'Moran I measures spatial autocorrelation. Positive values indicate clustering of similar socio-economic characteristics across neighboring blocks.',
    sourceRef: 'Spatial Statistics for Official Surveys'
  },
  {
    id: 'q-19',
    skill: 'Cloud Computing',
    category: 'Technical',
    difficulty: 'Easy',
    type: 'MCQ',
    question: 'What is MeghRaj in the context of the Government of India statistical infrastructure?',
    options: [
      'The National Cloud Initiative by MeitY and NIC providing secure government hosting and data storage',
      'A commercial weather forecasting app',
      'A proprietary private database engine',
      'A spreadsheet calculation macro'
    ],
    correctAnswer: 0,
    explanation: 'MeghRaj (GI Cloud) is the Government of India initiative delivering secure cloud infrastructure, S3 object storage, and containerized microservices for ministries.',
    sourceRef: 'MeitY Cloud First Directives'
  },
  {
    id: 'q-20',
    skill: 'Cybersecurity',
    category: 'Digital Governance',
    difficulty: 'Easy',
    type: 'MCQ',
    question: 'What is the mandatory protocol when handling government statistical survey credentials and cloud portal access?',
    options: [
      'Enforce Multi-Factor Authentication (MFA), role-based access control, and zero credential sharing',
      'Share admin passwords over unencrypted email for team convenience',
      'Write passwords on physical paper stickers',
      'Disable session timeouts'
    ],
    correctAnswer: 0,
    explanation: 'CERT-In directives mandate Multi-Factor Authentication (MFA), least-privilege role-based access, and encrypted credential storage.',
    sourceRef: 'CERT-In Government Information Security Guidelines'
  }
];

// ============================================================================
// INITIAL SAMPLE QUIZZES (10-Question and 5-Question Rich Official Quizzes)
// ============================================================================
export const INITIAL_SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Statistical Sampling & Survey Methodology Certification Quiz',
    description: 'Comprehensive certification examination covering stratified two-stage sampling, DEFF estimation, Horvitz-Thompson multipliers, and CAPI validation rules.',
    targetSkill: 'Sampling',
    domain: 'Statistical Competencies',
    topic: 'Sampling & Survey Methodology',
    difficulty: 'Mixed',
    sourceMaterialName: 'MoSPI National Sample Survey Handbook 2025.pdf',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-20T00:00:00Z',
    status: 'published',
    computedStatus: 'ACTIVE',
    timeLimitMinutes: 15,
    passingScorePercentage: 60,
    startAt: '2026-08-01T00:00:00Z',
    endAt: '2026-10-31T23:59:59Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    targetDepartments: ['All'],
    participantsCount: 245,
    averageScore: 74,
    questions: [
      CURATED_ASSESSMENT_QUESTIONS[0], // q-1 (Sampling)
      CURATED_ASSESSMENT_QUESTIONS[1], // q-2 (DEFF)
      CURATED_ASSESSMENT_QUESTIONS[2], // q-3 (PPS self-weighting)
      CURATED_ASSESSMENT_QUESTIONS[3], // q-4 (Multiplier formula)
      CURATED_ASSESSMENT_QUESTIONS[4], // q-5 (Jackknife variance)
      CURATED_ASSESSMENT_QUESTIONS[5], // q-6 (Python Pandas)
      CURATED_ASSESSMENT_QUESTIONS[6], // q-7 (NumPy weighted avg)
      CURATED_ASSESSMENT_QUESTIONS[12], // q-13 (National Accounts R&D)
      CURATED_ASSESSMENT_QUESTIONS[15], // q-16 (DPDP Privacy)
      CURATED_ASSESSMENT_QUESTIONS[18]  // q-19 (MeghRaj Cloud)
    ]
  },
  {
    id: 'quiz-2',
    title: 'Python for Statistical Computing & Vectorization Exam',
    description: 'Hands-on programming and computational statistics assessment covering Pandas dataframes, NumPy array broadcasting, Parquet pipelines, and out-of-core calculations.',
    targetSkill: 'Python',
    domain: 'Technical Competencies',
    topic: 'Data Analysis & Scientific Computing',
    difficulty: 'Medium',
    sourceMaterialName: 'Python Data Science for Official Statistics Manual.pdf',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-10T00:00:00Z',
    status: 'published',
    computedStatus: 'ACTIVE',
    timeLimitMinutes: 20,
    passingScorePercentage: 65,
    startAt: '2026-08-10T00:00:00Z',
    endAt: '2026-11-15T23:59:59Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['Statistical Officers (SSS)', 'Data Processing Assistants'],
    targetDepartments: ['All'],
    participantsCount: 180,
    averageScore: 68,
    questions: [
      CURATED_ASSESSMENT_QUESTIONS[5], // q-6 (Pandas median transform)
      CURATED_ASSESSMENT_QUESTIONS[6], // q-7 (NumPy weighted average)
      CURATED_ASSESSMENT_QUESTIONS[7], // q-8 (Parquet compression)
      CURATED_ASSESSMENT_QUESTIONS[8], // q-9 (Compound filtering)
      CURATED_ASSESSMENT_QUESTIONS[9], // q-10 (Dask/Polars out of core)
      CURATED_ASSESSMENT_QUESTIONS[0], // q-1 (Stratified sampling)
      CURATED_ASSESSMENT_QUESTIONS[10], // q-11 (AI/ML Macro F1)
      CURATED_ASSESSMENT_QUESTIONS[11], // q-12 (PMM Imputation)
      CURATED_ASSESSMENT_QUESTIONS[16], // q-17 (k-Anonymity)
      CURATED_ASSESSMENT_QUESTIONS[19]  // q-20 (Cybersecurity MFA)
    ]
  },
  {
    id: 'quiz-3',
    title: 'AI & Data Modernization Readiness Assessment',
    description: 'Examination on applied machine learning for registry coding, predictive mean matching, DPDP 2023 compliance, and government cloud pipelines.',
    targetSkill: 'AI/ML',
    domain: 'AI & Emerging Tech',
    topic: 'AI & Data Modernization',
    difficulty: 'Hard',
    sourceMaterialName: 'Modernizing Official Statistics with AI & Cloud Architecture.pptx',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-25T00:00:00Z',
    status: 'published',
    computedStatus: 'ACTIVE',
    timeLimitMinutes: 15,
    passingScorePercentage: 70,
    startAt: '2026-08-25T09:00:00Z',
    endAt: '2026-10-15T23:59:59Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    targetDepartments: ['All'],
    participantsCount: 110,
    averageScore: 71,
    questions: [
      CURATED_ASSESSMENT_QUESTIONS[10], // q-11 (NIC text coding F1)
      CURATED_ASSESSMENT_QUESTIONS[11], // q-12 (PMM imputation)
      CURATED_ASSESSMENT_QUESTIONS[15], // q-16 (Differential Privacy)
      CURATED_ASSESSMENT_QUESTIONS[17], // q-18 (GIS Moran I)
      CURATED_ASSESSMENT_QUESTIONS[18]  // q-19 (MeghRaj Cloud)
    ]
  },
  {
    id: 'quiz-4',
    title: 'National Accounts & SNA 2008 Advanced Evaluation',
    description: 'Comprehensive evaluation on GFCF compilation, Supply-Use Tables balancing, double deflation methodology, and macro deflators.',
    targetSkill: 'National Accounts',
    domain: 'Macro-Economic Statistics',
    topic: 'National Accounts & SNA 2008',
    difficulty: 'Hard',
    sourceMaterialName: 'SNA 2008 Guidelines & CSO NAD Compendium.pdf',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-28T00:00:00Z',
    status: 'published',
    computedStatus: 'ACTIVE',
    timeLimitMinutes: 20,
    passingScorePercentage: 65,
    startAt: '2026-08-28T09:00:00Z',
    endAt: '2026-11-30T23:59:59Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['Central & State Accounts Cadre'],
    targetDepartments: ['All'],
    participantsCount: 65,
    averageScore: 78,
    questions: [
      CURATED_ASSESSMENT_QUESTIONS[12], // q-13 (R&D in SNA 2008)
      CURATED_ASSESSMENT_QUESTIONS[13], // q-14 (SUT Identity)
      CURATED_ASSESSMENT_QUESTIONS[14], // q-15 (Double Deflation)
      CURATED_ASSESSMENT_QUESTIONS[0],  // q-1 (Stratified sampling)
      CURATED_ASSESSMENT_QUESTIONS[3]   // q-4 (Multiplier formula)
    ]
  },
  {
    id: 'quiz-5',
    title: 'Cloud Infrastructure & Cyber Defense in Statistical Systems',
    description: 'Evaluation of MeghRaj cloud deployment, containerized microservices, role-based API tokens, and DPDP Act 2023 compliance.',
    targetSkill: 'Cloud Computing',
    domain: 'Digital Governance',
    topic: 'Cloud Infrastructure & Cyber Defense',
    difficulty: 'Medium',
    sourceMaterialName: 'MeitY MeghRaj & CERT-In Statistical Guidelines.pdf',
    createdBy: 'Dr. Sunita Rao (NSSTA)',
    createdAt: '2026-08-01T00:00:00Z',
    status: 'published',
    computedStatus: 'CLOSED',
    timeLimitMinutes: 15,
    passingScorePercentage: 60,
    startAt: '2026-08-01T09:00:00Z',
    endAt: '2026-08-20T23:59:59Z',
    timezone: 'IST (UTC+05:30)',
    targetCadres: ['All'],
    targetDepartments: ['All'],
    participantsCount: 140,
    averageScore: 76,
    questions: [
      CURATED_ASSESSMENT_QUESTIONS[18], // q-19 (MeghRaj Cloud)
      CURATED_ASSESSMENT_QUESTIONS[19], // q-20 (Cybersecurity MFA)
      CURATED_ASSESSMENT_QUESTIONS[15], // q-16 (Differential Privacy)
      CURATED_ASSESSMENT_QUESTIONS[16], // q-17 (k-Anonymity)
      CURATED_ASSESSMENT_QUESTIONS[7]   // q-8 (Parquet format)
    ]
  }
];

// ============================================================================
// DYNAMIC STORAGE HELPERS (Local persistence synchronizing Admin & Official)
// ============================================================================
function computeDynamicQuizStatus(quiz: Quiz, now: Date = new Date()): QuizDynamicStatus {
  if (quiz.isDeleted || quiz.status === 'archived') return 'ARCHIVED';
  if (quiz.status === 'draft') return 'DRAFT';
  if (quiz.manuallyClosed) return 'CLOSED';
  const nowMs = now.getTime();
  const startMs = quiz.startAt ? new Date(quiz.startAt).getTime() : 0;
  const endMs = quiz.endAt ? new Date(quiz.endAt).getTime() : Infinity;
  if (startMs && nowMs < startMs) return 'UPCOMING';
  if (endMs && nowMs > endMs) return 'CLOSED';
  return 'ACTIVE';
}

function getStoredQuizzes(): Quiz[] {
  try {
    const raw = localStorage.getItem('statskill_quizzes_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(q => ({
          ...q,
          computedStatus: computeDynamicQuizStatus(q)
        }));
      }
    }
  } catch (e) {}

  // Initialize with complete INITIAL_SAMPLE_QUIZZES
  const initial = INITIAL_SAMPLE_QUIZZES.map(q => ({
    ...q,
    computedStatus: computeDynamicQuizStatus(q)
  }));
  try {
    localStorage.setItem('statskill_quizzes_store', JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

function saveStoredQuizzes(quizzes: Quiz[]): void {
  try {
    localStorage.setItem('statskill_quizzes_store', JSON.stringify(quizzes));
  } catch (e) {}
}

function getStoredAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem('statskill_attempts_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveStoredAttempts(attempts: QuizAttempt[]): void {
  try {
    localStorage.setItem('statskill_attempts_store', JSON.stringify(attempts));
  } catch (e) {}
}

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

// ============================================================================
// MAIN API CLIENT
// ============================================================================
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
        recommendations: ALL_OFFICIAL_COURSES.slice(0, 3)
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
                  id: 'c-4',
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
                  id: 'c-2',
                  title: 'AI & Machine Learning for Official Statistics',
                  skill: 'AI/ML',
                  gap: 30,
                  completed: false,
                  submodules: ['1. ML Taxonomy in Stats', '2. Automated Classification (NLP)', '3. Anomaly Detection (ASI)', '4. Satellite Remote Sensing', '5. Ethical AI & Bias', '6. Practice Assessment'],
                  externalUrl: 'https://developers.google.com/machine-learning/crash-course'
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
                  id: 'c-9',
                  title: 'Advanced Survey Sampling & Estimation Techniques',
                  skill: 'Sampling',
                  gap: 27,
                  completed: false,
                  submodules: ['1. Questionnaire Design', '2. Real-Time Logic Rules', '3. Paradata Diagnostics', '4. Field Quality Assurance'],
                  externalUrl: 'https://unstats.un.org/unsd/methodology/surveys/'
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
                  id: 'c-6',
                  title: 'Modern Data Visualization with PowerBI for Public Policy',
                  skill: 'Data Visualization',
                  gap: 15,
                  completed: false,
                  submodules: ['1. PowerBI Data Models', '2. DAX Measures', '3. Geo-Spatial Visuals', '4. Ministry Dashboards'],
                  externalUrl: 'https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/'
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
      () => {
        let list = [...ALL_OFFICIAL_COURSES];
        if (filters?.skill && filters.skill !== 'all') {
          const s = filters.skill.toLowerCase();
          list = list.filter(item =>
            item.course.skill.toLowerCase().includes(s) ||
            item.course.skillCategory.toLowerCase().includes(s)
          );
        }
        if (filters?.difficulty && filters.difficulty !== 'all') {
          list = list.filter(item => item.course.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
        }
        if (filters?.search && filters.search.trim()) {
          const q = filters.search.toLowerCase();
          list = list.filter(item =>
            item.course.title.toLowerCase().includes(q) ||
            item.course.description.toLowerCase().includes(q) ||
            item.course.skill.toLowerCase().includes(q)
          );
        }
        return { courses: list };
      }
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
        questions: CURATED_ASSESSMENT_QUESTIONS.slice(0, 5)
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
        isCorrect: selectedAnswer === 0,
        explanation: 'Correct! The official statistical standard rule fulfills the cadre benchmark requirement.'
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

  // ==========================================================================
  // DYNAMIC QUIZ MANAGEMENT & ATTEMPTS (Source of Truth Engine)
  // ==========================================================================
  async getQuizzes(options?: { role?: string; userId?: string; includeDeleted?: boolean }): Promise<{ quizzes: Quiz[] }> {
    return safeFetch(
      `${API_BASE}/quiz/list?${new URLSearchParams(options as any)}`,
      undefined,
      () => {
        const stored = getStoredQuizzes();
        let list = stored.filter(q => {
          if (!options?.includeDeleted && q.isDeleted) return false;
          if (options?.role === 'official') {
            if (q.isDeleted || q.status === 'archived' || q.status === 'draft') return false;
          }
          return true;
        });
        return { quizzes: list };
      }
    );
  },

  async getQuizById(id: string): Promise<{ quiz: Quiz | null }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}`,
      undefined,
      () => {
        const stored = getStoredQuizzes();
        const found = stored.find(q => q.id === id);
        return { quiz: found || stored[0] || null };
      }
    );
  },

  async getAdminQuizStats(): Promise<AdminQuizStats> {
    return safeFetch(
      `${API_BASE}/quiz/admin/stats`,
      undefined,
      () => {
        const stored = getStoredQuizzes().filter(q => !q.isDeleted);
        return {
          total: stored.length,
          published: stored.filter(q => q.status === 'published').length,
          drafts: stored.filter(q => q.status === 'draft').length,
          active: stored.filter(q => q.computedStatus === 'ACTIVE').length,
          closed: stored.filter(q => q.computedStatus === 'CLOSED').length,
          upcoming: stored.filter(q => q.computedStatus === 'UPCOMING').length
        };
      }
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
      () => {
        const stored = getStoredQuizzes();
        const newQuiz: Quiz = {
          id: quizData.id || `quiz-${Date.now()}`,
          title: quizData.title || 'Untitled Assessment',
          description: quizData.description || '',
          targetSkill: quizData.targetSkill || 'Sampling',
          domain: quizData.domain || 'Statistical Competencies',
          topic: quizData.topic || quizData.targetSkill || 'General Statistics',
          difficulty: quizData.difficulty || 'Mixed',
          createdBy: quizData.createdBy || 'Dr. Sunita Rao (NSSTA)',
          createdAt: quizData.createdAt || new Date().toISOString(),
          status: quizData.status || 'draft',
          timeLimitMinutes: quizData.timeLimitMinutes || 15,
          passingScorePercentage: quizData.passingScorePercentage || 60,
          startAt: quizData.startAt || new Date().toISOString(),
          endAt: quizData.endAt || new Date(Date.now() + 14 * 86400000).toISOString(),
          timezone: quizData.timezone || 'IST (UTC+05:30)',
          targetCadres: quizData.targetCadres || ['All'],
          targetDepartments: quizData.targetDepartments || ['All'],
          questions: quizData.questions && quizData.questions.length > 0 ? quizData.questions : CURATED_ASSESSMENT_QUESTIONS.slice(0, 5),
          participantsCount: 0,
          averageScore: 0,
          isDeleted: false,
          manuallyClosed: false,
          ...quizData
        } as Quiz;
        newQuiz.computedStatus = computeDynamicQuizStatus(newQuiz);
        stored.unshift(newQuiz);
        saveStoredQuizzes(stored);
        return { success: true, quiz: newQuiz };
      }
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
      () => {
        const stored = getStoredQuizzes();
        const idx = stored.findIndex(q => q.id === id);
        if (idx >= 0) {
          stored[idx] = { ...stored[idx], ...updates };
          stored[idx].computedStatus = computeDynamicQuizStatus(stored[idx]);
          saveStoredQuizzes(stored);
          return { success: true, quiz: stored[idx] };
        }
        return { success: true, quiz: { id, ...updates } as Quiz };
      }
    );
  },

  async publishQuiz(id: string): Promise<{ success: boolean; error?: string; quiz?: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/publish`,
      { method: 'POST' },
      () => {
        const stored = getStoredQuizzes();
        const idx = stored.findIndex(q => q.id === id);
        if (idx >= 0) {
          stored[idx].status = 'published';
          stored[idx].manuallyClosed = false;
          stored[idx].computedStatus = computeDynamicQuizStatus(stored[idx]);
          saveStoredQuizzes(stored);
          return { success: true, quiz: stored[idx] };
        }
        return { success: true };
      }
    );
  },

  async unpublishQuiz(id: string): Promise<{ success: boolean; error?: string; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/unpublish`,
      { method: 'POST' },
      () => {
        const stored = getStoredQuizzes();
        const idx = stored.findIndex(q => q.id === id);
        if (idx >= 0) {
          stored[idx].status = 'draft';
          stored[idx].computedStatus = computeDynamicQuizStatus(stored[idx]);
          saveStoredQuizzes(stored);
          return { success: true, quiz: stored[idx] };
        }
        return { success: true, quiz: { id, status: 'draft' } as Quiz };
      }
    );
  },

  async closeQuiz(id: string): Promise<{ success: boolean; error?: string; closedAttemptsCount: number; quiz: Quiz }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}/close`,
      { method: 'POST' },
      () => {
        const stored = getStoredQuizzes();
        const idx = stored.findIndex(q => q.id === id);
        let closedCount = 0;
        if (idx >= 0) {
          stored[idx].status = 'archived';
          stored[idx].manuallyClosed = true;
          stored[idx].closedAt = new Date().toISOString();
          stored[idx].computedStatus = 'CLOSED';
          saveStoredQuizzes(stored);

          // Finalize active attempts
          const attempts = getStoredAttempts();
          attempts.forEach(att => {
            if (att.quizId === id && att.status === 'IN_PROGRESS') {
              att.status = 'AUTO_SUBMITTED';
              att.submissionType = 'Auto-submitted';
              att.submissionReason = 'ADMIN_CLOSED_QUIZ';
              att.submittedAt = new Date().toISOString();
              closedCount++;
            }
          });
          saveStoredAttempts(attempts);

          return { success: true, closedAttemptsCount: closedCount, quiz: stored[idx] };
        }
        return { success: true, closedAttemptsCount: 0, quiz: { id, status: 'archived' } as Quiz };
      }
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
      () => {
        const stored = getStoredQuizzes();
        const idx = stored.findIndex(q => q.id === id);
        if (idx >= 0) {
          stored[idx].status = 'published';
          stored[idx].manuallyClosed = false;
          stored[idx].endAt = newEndAt;
          stored[idx].closedAt = undefined;
          stored[idx].computedStatus = computeDynamicQuizStatus(stored[idx]);
          saveStoredQuizzes(stored);
          return { success: true, quiz: stored[idx] };
        }
        return { success: true, quiz: { id, endAt: newEndAt, status: 'published' } as Quiz };
      }
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
      () => {
        const stored = getStoredQuizzes();
        const idx = stored.findIndex(q => q.id === id);
        if (idx >= 0) {
          stored[idx].endAt = newEndAt;
          stored[idx].computedStatus = computeDynamicQuizStatus(stored[idx]);
          saveStoredQuizzes(stored);
          return { success: true, quiz: stored[idx] };
        }
        return { success: true, quiz: { id, endAt: newEndAt } as Quiz };
      }
    );
  },

  async deleteQuiz(id: string): Promise<{ success: boolean; error?: string }> {
    return safeFetch(
      `${API_BASE}/quiz/${id}`,
      { method: 'DELETE' },
      () => {
        const stored = getStoredQuizzes();
        const idx = stored.findIndex(q => q.id === id);
        if (idx >= 0) {
          stored[idx].isDeleted = true;
          saveStoredQuizzes(stored);
        }
        return { success: true };
      }
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
      () => {
        const quizzes = getStoredQuizzes();
        const quiz = quizzes.find(q => q.id === quizId) || quizzes[0];
        const attempts = getStoredAttempts();

        // Check if there is already an active or completed attempt
        let existing = attempts.find(a => a.userId === userId && a.quizId === quizId);
        if (existing) {
          const totalSec = (quiz?.timeLimitMinutes || 15) * 60;
          const elapsed = Math.floor((Date.now() - new Date(existing.startedAt).getTime()) / 1000);
          const remaining = Math.max(0, totalSec - elapsed);
          return { attempt: existing, remainingSeconds: remaining };
        }

        const totalQ = quiz ? quiz.questions.length : 10;
        const newAttempt: QuizAttempt = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId,
          quizId,
          status: 'IN_PROGRESS',
          startedAt: new Date().toISOString(),
          answers: {},
          submissionType: 'Manual',
          submissionReason: 'MANUAL_SUBMISSION',
          totalQuestions: totalQ
        };

        attempts.unshift(newAttempt);
        saveStoredAttempts(attempts);

        return {
          attempt: newAttempt,
          remainingSeconds: (quiz?.timeLimitMinutes || 15) * 60
        };
      }
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
      () => {
        const attempts = getStoredAttempts();
        const att = attempts.find(a => a.id === attemptId);
        if (att) {
          if (!att.answers) att.answers = {};
          att.answers[questionId] = selectedAnswer;
          saveStoredAttempts(attempts);
        }
        return { success: true };
      }
    );
  },

  async submitQuiz(
    quizId: string,
    userId: string,
    answers: Record<string, number | null>,
    submissionType: 'Manual' | 'Auto-submitted',
    reason: QuizSubmissionReason,
    attemptId?: string,
    timeSpent?: number
  ): Promise<any> {
    return safeFetch(
      `${API_BASE}/quiz/${quizId}/submit`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers, submissionType, reason, attemptId, timeSpent })
      },
      () => {
        const quizzes = getStoredQuizzes();
        const quiz = quizzes.find(q => q.id === quizId) || quizzes[0];
        const questions = quiz ? quiz.questions : CURATED_ASSESSMENT_QUESTIONS.slice(0, 10);
        const totalQuestions = questions.length || 1;

        let correctCount = 0;
        let answeredCount = 0;

        const questionResults = questions.map((q) => {
          const userAns = answers[q.id];
          const isAnswered = userAns !== undefined && userAns !== null;
          if (isAnswered) answeredCount++;
          const isCorrect = isAnswered && Number(userAns) === q.correctAnswer;
          if (isCorrect) correctCount++;

          return {
            questionId: q.id,
            question: q.question,
            options: q.options,
            userAnswer: isAnswered ? Number(userAns) : null,
            correctAnswer: q.correctAnswer,
            isCorrect,
            explanation: q.explanation || 'Official MoSPI standard rule.',
            sourceRef: q.sourceRef || 'MoSPI Guidelines',
            source: (q as any).source || 'NSSTA Academy',
            sourceUrl: (q as any).sourceUrl || 'https://mospi.gov.in'
          };
        });

        const unansweredCount = Math.max(0, totalQuestions - answeredCount);
        const incorrectCount = Math.max(0, answeredCount - correctCount);
        const score = Math.round((correctCount / totalQuestions) * 100);

        const attempts = getStoredAttempts();
        let att = attemptId ? attempts.find(a => a.id === attemptId) : attempts.find(a => a.userId === userId && a.quizId === quizId);

        if (!att) {
          att = {
            id: attemptId || `att-${Date.now()}`,
            userId,
            quizId,
            startedAt: new Date(Date.now() - (timeSpent || 120) * 1000).toISOString(),
            answers: {},
            totalQuestions
          } as QuizAttempt;
          attempts.unshift(att);
        }

        att.answers = { ...att.answers, ...answers };
        att.status = submissionType === 'Auto-submitted' ? 'AUTO_SUBMITTED' : 'SUBMITTED';
        att.submissionType = submissionType;
        att.submissionReason = reason || 'MANUAL_SUBMISSION';
        att.submittedAt = new Date().toISOString();
        att.score = score;
        att.correctCount = correctCount;
        att.incorrectCount = incorrectCount;
        att.answeredCount = answeredCount;
        att.unansweredCount = unansweredCount;
        att.totalQuestions = totalQuestions;
        att.timeSpentSeconds = timeSpent || 120;
        att.questionResults = questionResults;
        att.aiFeedback = score >= 70
          ? `Outstanding performance in ${quiz.targetSkill}! You achieved ${score}% (${correctCount}/${totalQuestions} correct), demonstrating solid mastery of official standards.`
          : `Identified actionable skill gaps in ${quiz.targetSkill} (${score}%: ${correctCount}/${totalQuestions} correct). Recommended next step: Complete targeted training modules to elevate your score to benchmark.`;

        saveStoredAttempts(attempts);

        return {
          success: true,
          attempt: att,
          ...att,
          passed: score >= (quiz.passingScorePercentage || 60),
          scorePercentage: score,
          scoreBoost: Math.max(5, Math.round((score / 100) * 15))
        };
      }
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
      () => {
        const attempts = getStoredAttempts();
        const att = attempts.find(a => a.id === attemptId);
        return {
          success: true,
          passed: true,
          scorePercentage: att?.score || 85,
          attempt: att || ({ id: attemptId, status: 'SUBMITTED', score: 85 } as QuizAttempt)
        };
      }
    );
  },

  async getActiveQuizAttempt(userId: string, quizId: string): Promise<{ attempt: QuizAttempt | null; remainingSeconds: number }> {
    return safeFetch(
      `${API_BASE}/quiz/${quizId}/attempt?userId=${userId}`,
      undefined,
      () => {
        const attempts = getStoredAttempts();
        const att = attempts.find(a => a.userId === userId && a.quizId === quizId);
        const quizzes = getStoredQuizzes();
        const quiz = quizzes.find(q => q.id === quizId);
        const totalSec = (quiz?.timeLimitMinutes || 15) * 60;
        const elapsed = att ? Math.floor((Date.now() - new Date(att.startedAt).getTime()) / 1000) : 0;
        const remaining = Math.max(0, totalSec - elapsed);
        return { attempt: att || null, remainingSeconds: remaining };
      }
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
      () => {
        const attempts = getStoredAttempts();
        const att = attempts.find(a => a.id === attemptId);
        if (att) {
          att.answers = { ...att.answers, ...answers };
          saveStoredAttempts(attempts);
        }
        return { success: true };
      }
    );
  },

  // AI Generation
  async generateQuiz(payload: any): Promise<{ quiz: Quiz; questions: any[] }> {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const targetSkill = isFormData ? (payload.get('targetSkill') as string || 'Sampling') : (payload.targetSkill || 'Sampling');
    const topic = isFormData ? (payload.get('topic') as string || 'MoSPI Official Methodology') : (payload.topic || 'MoSPI Official Methodology');
    const difficulty = isFormData ? (payload.get('difficulty') as string || 'Mixed') : (payload.difficulty || 'Mixed');
    const countRaw = isFormData ? Number(payload.get('questionCount') || 10) : Number(payload.questionCount || 10);
    const count = isNaN(countRaw) || countRaw <= 0 ? 10 : countRaw;

    return safeFetch(
      `${API_BASE}/quiz/generate`,
      {
        method: 'POST',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? payload : JSON.stringify(payload)
      },
      () => {
        // Filter or create count questions matching targetSkill
        let matching = CURATED_ASSESSMENT_QUESTIONS.filter(q =>
          q.skill.toLowerCase().includes(targetSkill.toLowerCase()) ||
          targetSkill.toLowerCase().includes(q.skill.toLowerCase())
        );

        if (matching.length < count) {
          const others = CURATED_ASSESSMENT_QUESTIONS.filter(q => !matching.includes(q));
          matching = [...matching, ...others];
        }

        const selectedQuestions: AssessmentQuestion[] = [];
        for (let i = 0; i < count; i++) {
          const baseQ = matching[i % matching.length];
          selectedQuestions.push({
            ...baseQ,
            id: `q-gen-${Date.now()}-${i + 1}`,
            question: baseQ.question + (i >= matching.length ? ` (Variant ${Math.floor(i / matching.length) + 1})` : '')
          });
        }

        const newQuiz: Quiz = {
          id: `quiz-gen-${Date.now()}`,
          title: `AI Assessment: ${targetSkill} (${count} Questions)`,
          description: `Generated examination on ${topic} with ${count} tailored questions for cadre competency assessment.`,
          targetSkill,
          domain: 'Official Statistical System',
          topic,
          difficulty: difficulty as any,
          createdBy: 'Dr. Sunita Rao (AI Synthesizer)',
          createdAt: new Date().toISOString(),
          timeLimitMinutes: Math.max(10, Math.round(count * 1.5)),
          passingScorePercentage: 60,
          startAt: new Date().toISOString(),
          endAt: new Date(Date.now() + 14 * 86400000).toISOString(),
          status: 'draft',
          computedStatus: 'DRAFT',
          targetCadres: ['All'],
          targetDepartments: ['All'],
          questions: selectedQuestions,
          participantsCount: 0,
          averageScore: 0
        };

        const stored = getStoredQuizzes();
        stored.unshift(newQuiz);
        saveStoredQuizzes(stored);

        return {
          quiz: newQuiz,
          questions: selectedQuestions
        };
      }
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
      () => {
        const bank: BankQuestion[] = CURATED_ASSESSMENT_QUESTIONS.map((q, idx) => ({
          ...q,
          subject: q.skill === 'Sampling' || q.skill === 'Survey Design' || q.skill === 'National Accounts' ? 'Statistics' : q.skill,
          topic: q.skill,
          concepts: [q.skill],
          tags: [q.skill, q.category, q.difficulty],
          source: 'NSSTA Curated Bank',
          sourceUrl: 'https://mospi.gov.in',
          usageCount: idx + 3,
          status: 'approved',
          generatedAt: '2026-08-20T10:00:00Z'
        }));
        return {
          total: bank.length,
          questions: bank
        };
      }
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
        totalQuestions: CURATED_ASSESSMENT_QUESTIONS.length,
        approvedQuestions: CURATED_ASSESSMENT_QUESTIONS.length,
        pendingQuestions: 0,
        subjectsCount: 5,
        topicsCount: 14,
        uniqueConceptsCount: 28,
        difficultyCounts: { Easy: 4, Medium: 10, Hard: 6 },
        typeCounts: { MCQ: CURATED_ASSESSMENT_QUESTIONS.length },
        subjects: ['Sampling', 'Python', 'National Accounts', 'AI/ML', 'Data Privacy', 'GIS', 'Cloud Computing']
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
            { label: 'Take Practice Quiz', url: '/quizzes', promptText: 'Launch official quiz' }
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
            title: 'New Official Quiz Published',
            message: 'A 10-question certification test is available for Statistical Sampling & Survey Methodology.',
            type: 'assessment',
            read: false,
            timestamp: '10m ago',
            actionUrl: '/quizzes'
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
        questions: CURATED_ASSESSMENT_QUESTIONS.slice(0, 5)
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
        courses: ALL_OFFICIAL_COURSES.map(item => item.course)
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
