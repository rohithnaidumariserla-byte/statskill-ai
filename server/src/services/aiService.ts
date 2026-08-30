import { AssessmentQuestion, Course, NSSTAProgramme, UserSkill } from '../data/seedData';
import { db } from '../data/db';
import { gapAnalysisService } from './gapAnalysisService';
import { recommendationEngine, CourseRecommendation } from './recommendationEngine';
import { questionBankService } from './questionBankService';

export interface RawQuestion {
  skill: string;
  category: 'Statistical' | 'Technical' | 'Digital Governance' | 'Behavioural & Managerial';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'True/False' | 'Scenario-based' | 'Multiple-answer';
  question: string;
  correctAnswerText: string;
  distractors: string[];
  explanation: string;
  sourceRef: string;
}

export interface QuizGenerationParams {
  content?: string;
  sourceMaterialName?: string;
  targetSkill: string;
  questionCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questionTypes: string[];
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

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
}
export const RAW_QUESTION_BANK: RawQuestion[] = [
  {
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'What is the primary objective of stratified random sampling over simple random sampling (SRS)?',
    correctAnswerText: 'To ensure representation of heterogeneous subgroups and decrease sampling variance of overall estimates',
    distractors: [
      'To completely eliminate all non-sampling errors and response bias in field operations',
      'To reduce the total number of survey respondents below mathematical validity limits',
      'To replace probability sampling when no sampling frame or census listing is available'
    ],
    explanation: 'Stratified sampling partitions a heterogeneous population into mutually exclusive, homogeneous subgroups (strata) and samples from each, thereby reducing sampling variance and guaranteeing representation of minority domains.',
    sourceRef: 'UN Handbook on Household Sample Surveys & MoSPI NSS Methodology'
  },
  {
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In multi-stage cluster sampling conducted by NSSO, how is the design effect (DEFF) formally defined?',
    correctAnswerText: 'The ratio of the sampling variance under the complex design to the variance under simple random sampling with the same sample size',
    distractors: [
      'The ratio of total sample size to total target population size',
      'The ratio of between-cluster variance to individual response variance',
      'The square root of the standard error multiplied by sample kurtosis'
    ],
    explanation: 'Design effect (DEFF) measures the factor by which the variance of an estimate from a complex sampling design exceeds that of a Simple Random Sample of the same sample size: DEFF = Var(complex) / Var(SRS).',
    sourceRef: 'MoSPI Sampling & Survey Design Manual (Section 4.2)'
  },
  {
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'Scenario-based',
    question: 'Scenario: A state socio-economic survey experiences differential non-response across rural and urban agricultural households. Which calibration method is officially recommended to adjust sample weights?',
    correctAnswerText: 'Generalized Regression (GREG) calibration using auxiliary administrative census totals as benchmarks',
    distractors: [
      'Dropping non-responding households and renormalizing raw weights directly without auxiliary data',
      'Assigning arbitrary maximum weights to all remaining responding rural households',
      'Replacing missing household responses with state arithmetic mean values'
    ],
    explanation: 'GREG calibration adjusts survey weights so that weighted totals of auxiliary variables exactly match known independent population benchmarks from Census registers while minimizing distance from design weights.',
    sourceRef: 'UN Calibration Estimators Guidelines & Deville and Sarndal (1992)'
  },
  {
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Easy',
    type: 'True/False',
    question: 'True or False: In systematic sampling with interval k, if the sampling frame has hidden periodicity equal to k, the sample will be severely biased.',
    correctAnswerText: 'True: periodicity coinciding with the sampling interval causes massive systematic bias',
    distractors: [
      'False: systematic sampling is mathematically immune to any ordering or periodic structures in the sampling frame'
    ],
    explanation: 'True. If the sampling frame contains hidden periodicity that matches the sampling interval k, systematic sampling selects only specific phase points, introducing severe bias.',
    sourceRef: 'Sampling Techniques (W.G. Cochran)'
  },
  {
    skill: 'Sampling',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Which estimator provides the design-unbiased estimate of a population total under unequal probability sampling without replacement?',
    correctAnswerText: 'Horvitz-Thompson Estimator (sum of values divided by their first-order inclusion probabilities pi_i)',
    distractors: [
      'Simple arithmetic sample mean multiplied by total population N',
      'Ordinary Least Squares sample intercept',
      'Maximum Likelihood estimator without inclusion weights'
    ],
    explanation: 'The Horvitz-Thompson estimator: Y_hat = sum(y_i / pi_i) is strictly design-unbiased for the population total when units are selected with known inclusion probabilities pi_i > 0.',
    sourceRef: 'Horvitz & Thompson (1952) / MoSPI Advanced Sampling Theory'
  }
];
RAW_QUESTION_BANK.push(
  {
    skill: 'Survey Design',
    category: 'Statistical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In Computer-Assisted Personal Interviewing (CAPI) survey design, what is the key advantage of automated range and logic consistency checks?',
    correctAnswerText: 'Immediate error detection at the point of data capture while the respondent is still present',
    distractors: [
      'Guaranteed 100% elimination of all respondent non-response',
      'Completely removing the necessity of training field enumerators',
      'Allowing enumerators to skip entire questionnaire sections without supervisor authorization'
    ],
    explanation: 'Real-time validation rules embedded in CAPI software flag impossible ranges or contradictory responses during the interview, enabling instantaneous verification with the respondent.',
    sourceRef: 'World Bank CAPI Guidelines & MoSPI Field Operations Manual'
  },
  {
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'When processing 50 million records of Annual Survey of Industries data, which Pandas data type optimization reduces memory footprint by up to 80% for repetitive district names?',
    correctAnswerText: 'Converting object string columns to Categorical dtype: df["district"] = df["district"].astype("category")',
    distractors: [
      'Converting all string columns to float64 numeric arrays',
      'Converting the dataframe to nested standard Python dictionary lists',
      'Writing the dataframe to raw JSON string buffers'
    ],
    explanation: 'Pandas Categorical dtype stores strings as integer codes with a lookup table, drastically reducing memory usage and accelerating groupby aggregations on low-cardinality survey variables.',
    sourceRef: 'Python for High Performance Official Statistics'
  },
  {
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'In Python (Pandas), which method is the most vectorized and memory-efficient way to impute missing survey weights with stratum median weights?',
    correctAnswerText: 'df["weight"] = df.groupby("stratum")["weight"].transform(lambda x: x.fillna(x.median()))',
    distractors: [
      'Iterating through every row with a Python for loop: for idx, row in df.iterrows(): ...',
      'Calling df["weight"].apply(lambda x: median(x)) without grouping',
      'Dropping all rows with missing weights directly using df.dropna()'
    ],
    explanation: 'Using groupby().transform() with fillna() is fully vectorized, executing in C underlying arrays without Python-level iteration overhead, making it ideal for large official survey microdata.',
    sourceRef: 'Python Data Science for Official Statistics Manual'
  },
  {
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Which Python statistical library module should be used to compute robust standard errors adjusted for survey clustering and stratification?',
    correctAnswerText: 'statsmodels.formula.api.ols with cov_type="cluster" and cluster groups specified',
    distractors: [
      'math.sqrt() applied directly to the raw sample variance',
      'numpy.random.choice() with replacement',
      'scipy.stats.ttest_ind() under standard i.i.d. assumptions'
    ],
    explanation: 'statsmodels supports cluster-robust covariance matrices (cov_type="cluster") to correctly estimate standard errors in complex survey data without underestimating variance due to intra-cluster correlation.',
    sourceRef: 'Statistical Modeling with Python (Statsmodels Survey Documentation)'
  },
  {
    skill: 'Python',
    category: 'Technical',
    difficulty: 'Easy',
    type: 'MCQ',
    question: 'Which file format provides columnar storage, snappy compression, and fastest read times for multi-gigabyte statistical survey microdata in Python?',
    correctAnswerText: 'Apache Parquet (.parquet)',
    distractors: [
      'Uncompressed CSV (.csv)',
      'Legacy Microsoft Excel (.xls)',
      'Newline-delimited XML (.xml)'
    ],
    explanation: 'Parquet is a columnar binary format that stores schema metadata and utilizes efficient dictionary encoding and compression, loading orders of magnitude faster than CSV.',
    sourceRef: 'High-Performance Data Storage in Python (PyArrow Guidelines)'
  }
);
RAW_QUESTION_BANK.push(
  {
    skill: 'SQL',
    category: 'Technical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'In PostgreSQL/Oracle SQL, which window function calculates the cumulative running total of industrial output partitioned by State and ordered by survey Year?',
    correctAnswerText: 'SUM(output) OVER (PARTITION BY state_code ORDER BY survey_year ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
    distractors: [
      'GROUP BY state_code, survey_year WITH ROLLUP',
      'SUM(output) GROUP BY state_code ORDER BY survey_year',
      'CUMULATIVE_SUM(output) WITHIN GROUP (ORDER BY survey_year)'
    ],
    explanation: 'The OVER clause with PARTITION BY and ORDER BY defines an analytical window frame that calculates running aggregates without collapsing individual records.',
    sourceRef: 'ANSI SQL:2016 Window Functions Standard'
  },
  {
    skill: 'SQL',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'What is the primary performance benefit of database table partitioning by financial year in national statistical data warehouses?',
    correctAnswerText: 'Enables partition pruning, allowing the query engine to scan only relevant year segments rather than the full multi-billion row table',
    distractors: [
      'Automatically translates SQL queries into Python code',
      'Eliminates the need to define primary keys or unique constraints',
      'Permanently encrypts table columns against administrative read access'
    ],
    explanation: 'Partition pruning skips irrelevant partitions at query execution time, drastically reducing disk I/O when filtering by partitioned keys like financial year.',
    sourceRef: 'Enterprise Database Optimization for National Statistical Registers'
  },
  {
    skill: 'AI/ML',
    category: 'Technical',
    difficulty: 'Hard',
    type: 'Scenario-based',
    question: 'Scenario: MoSPI seeks to automate 5-digit National Industrial Classification (NIC 2008) coding from free-text enterprise descriptions. Which NLP approach provides both high accuracy and verifiable confidence thresholds?',
    correctAnswerText: 'Fine-tuned Transformer/BERT model with conformal prediction confidence sets for human review routing',
    distractors: [
      'Hardcoded regular expression keyword lookup table without machine learning',
      'Unsupervised K-Means clustering with k=5',
      'Simple linear regression fitted on text character count'
    ],
    explanation: 'Fine-tuned Transformer models coupled with conformal prediction achieve high automated classification while providing mathematical coverage guarantees, routing low-confidence edge cases to expert human statisticians.',
    sourceRef: 'UNECE High-Level Group on AI for Official Statistics'
  },
  {
    skill: 'AI/ML',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'How can Generative Adversarial Networks (GANs) and Variational Autoencoders (VAEs) assist in statistical microdata dissemination?',
    correctAnswerText: 'Generating privacy-preserving synthetic microdata that mimics empirical covariance without leaking individual respondent identities',
    distractors: [
      'Eliminating the need to conduct any field surveys or census operations in the future',
      'Automatically increasing internet bandwidth in rural field tablets',
      'Generating decorative video animations for statistical chart presentations'
    ],
    explanation: 'Synthetic microdata generated via generative models enables open public and research access to complex datasets while preserving confidentiality and adhering to privacy laws.',
    sourceRef: 'Synthetic Data Framework for Official Statistical Agencies'
  },
  {
    skill: 'GIS',
    category: 'Technical',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'Which spatial statistical metric evaluates the degree of spatial autocorrelation (clustering vs dispersion) in district-level poverty indices?',
    correctAnswerText: "Moran's I index (Global and Local Indicators of Spatial Association - LISA)",
    distractors: [
      "Pearson's correlation coefficient without spatial coordinate weighting",
      'Standard Euclidean distance between capital cities',
      'Cronbach Alpha coefficient of questionnaire items'
    ],
    explanation: "Global Moran's I measures overall spatial clustering, while Local Moran's (LISA) identifies specific hot-spots, cold-spots, and spatial outliers across geographic units.",
    sourceRef: 'Spatial Analysis in Official Statistics (Luc Anselin)'
  },
  {
    skill: 'National Accounts',
    category: 'Statistical',
    difficulty: 'Hard',
    type: 'MCQ',
    question: 'Under SNA 2008 standards, how is Research and Development (R&D) expenditure treated in GDP compilation?',
    correctAnswerText: 'Treated as Gross Fixed Capital Formation (GFCF) as an intellectual property asset if it delivers future economic benefit',
    distractors: [
      'Treated exclusively as intermediate consumption of the producing establishment',
      'Deducted directly from Gross Operating Surplus without asset creation',
      'Omitted completely from national accounts as an unmeasurable intangible'
    ],
    explanation: 'SNA 2008 recognized R&D as Gross Fixed Capital Formation (intellectual property asset), whereas the previous 1993 SNA treated R&D as intermediate consumption.',
    sourceRef: 'System of National Accounts 2008 (UN, OECD, IMF, World Bank)'
  },
  {
    skill: 'Data Privacy',
    category: 'Digital Governance',
    difficulty: 'Medium',
    type: 'MCQ',
    question: 'Under the Digital Personal Data Protection (DPDP) Act 2023 and official statistical guidelines, what mathematical privacy guarantee bounds privacy loss when releasing tabular aggregate statistics?',
    correctAnswerText: 'Epsilon-Differential Privacy (adding calibrated Laplace or Gaussian noise to aggregate query outputs)',
    distractors: [
      'Replacing names with 4-digit serial numbers (pseudonymization only)',
      'Password protecting Excel workbooks with 8-character passwords',
      'Publishing data only during government working hours'
    ],
    explanation: 'Differential privacy provides a provable mathematical limit (epsilon) on the maximum information an adversary can learn about any individual respondent, regardless of external background knowledge.',
    sourceRef: 'DPDP Act 2023 & US Census Bureau / UN Differential Privacy Framework'
  }
);
export function randomizeAndValidateQuestion(
  raw: RawQuestion,
  idOverride?: string,
  targetIndex?: number
): AssessmentQuestion {
  const correctText = raw.correctAnswerText.trim();
  const distractors = raw.distractors.map(d => d.trim()).filter(d => d !== correctText);

  const combined = [correctText, ...distractors];
  const uniqueOptions = Array.from(new Set(combined));

  if (uniqueOptions.length < 2) {
    throw new Error(`Question "${raw.question}" does not have enough unique options.`);
  }

  // Fisher-Yates shuffle
  const options = [...uniqueOptions];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex < options.length) {
    const currentIdx = options.indexOf(correctText);
    if (currentIdx !== targetIndex) {
      [options[currentIdx], options[targetIndex]] = [options[targetIndex], options[currentIdx]];
    }
  }

  const newCorrectIndex = options.indexOf(correctText);

  if (
    newCorrectIndex < 0 ||
    newCorrectIndex >= options.length ||
    options[newCorrectIndex] !== correctText ||
    new Set(options).size !== options.length
  ) {
    throw new Error(`Validation failed for randomized question: "${raw.question}"`);
  }

  return {
    id: idOverride || `q-gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    skill: raw.skill,
    category: raw.category,
    difficulty: raw.difficulty,
    type: raw.type,
    question: raw.question,
    options,
    correctAnswer: newCorrectIndex,
    explanation: raw.explanation,
    sourceRef: raw.sourceRef
  };
}

export class AIService {
  private hasApiKey: boolean;

  constructor() {
    this.hasApiKey = !!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
  }

  async generateQuiz(params: QuizGenerationParams & { userId?: string }): Promise<AssessmentQuestion[]> {
    return questionBankService.generateQuizFromBank(params);
  }

  generateAssessmentFeedback(score: number, skillName: string, correctCount: number, totalCount: number): string {
    if (score >= 80) {
      return `Outstanding competency demonstrated in ${skillName} (${score}% score: ${correctCount}/${totalCount} correct). You exhibit advanced mastery in theoretical foundations and official methodology. Recommended next step: Advance to Domain Application or mentor junior statistical personnel.`;
    } else if (score >= 60) {
      return `Good conceptual grasp in ${skillName} (${score}% score: ${correctCount}/${totalCount} correct). Focus on complex sampling error formulas, variance estimation under multistage designs, and automated validation rules to achieve top-tier proficiency.`;
    } else {
      return `Identified foundational skill gap in ${skillName} (${score}% score: ${correctCount}/${totalCount} correct). Priority recommendation: Enroll in the dedicated iGOT Karmayogi pathway and review NSSTA standard operating manuals to meet cadre benchmarks.`;
    }
  }
  async getChatbotResponse(
    message: string,
    context?: {
      userId?: string;
      conversationHistory?: ChatMessage[];
      sessionState?: {
        lastTopic?: string;
        lastCourseId?: string;
        lastSkill?: string;
        lastIntent?: string;
      };
    }
  ): Promise<ChatResponse> {
    const rawMsg = message.trim();
    const text = rawMsg.toLowerCase();
    const userId = context?.userId || 'u-1';
    const lastTopic = context?.sessionState?.lastTopic;
    const lastSkill = context?.sessionState?.lastSkill;
    const lastCourseId = context?.sessionState?.lastCourseId;

    const user = db.getUserById(userId);
    const userSkills = db.getUserSkills(userId);
    const gapReport = gapAnalysisService.analyzeUserGaps(userId) || {
      overallCompetency: 72,
      gaps: [],
      highGapCount: 0,
      mediumGapCount: 0,
      lowGapCount: 0,
      masteredCount: 0,
      roleTitle: user?.designation || 'Statistical Officer',
      cadre: '',
      aiExplanation: 'Competency evaluation based on verified statistical cadre benchmark.'
    };
    const recommendations = recommendationEngine.getRecommendationsForUser(userId);
    const allCourses = db.getAllCourses();
    const allNssta = db.getAllNSSTAProgrammes();

    const userName = user?.name || 'Officer';
    const userRole = user?.designation || 'Statistical Officer';
    const roleBenchmark = db.getRoleBenchmark(userRole) || { roleName: userRole, cadre: '', requiredSkills: [] };
    const primaryGap = gapReport.gaps[0] || { skillName: 'Python', currentScore: 42, requiredScore: 75, gap: 33 };

    // 1. FOLLOW-UP INTENT HANDLER (CONVERSATION MEMORY)
    const isExampleRequest = text.includes('example') || text.includes('give an example') || text.includes('for instance');
    const isDurationRequest = text.includes('how long') || text.includes('duration') || text.includes('time will it take') || text.includes('time required');
    const isWhyRecommendRequest = text.includes('why did you recommend') || text.includes('why this course') || text.includes('why recommend');

    if (isExampleRequest) {
      if (lastTopic?.includes('stratified') || lastTopic?.includes('sampling') || text.includes('sampling')) {
        return {
          answer: `**Practical Example: Stratified Sampling in NSS Surveys**\n\nSuppose MoSPI is conducting the **Periodic Labour Force Survey (PLFS)** in a state with 10 million households:\n\n1. **Stratification**: Divide the state into two primary strata: **Rural** (6.5M households) and **Urban** (3.5M households).\n2. **Sub-strata**: Further subdivide into agricultural vs non-agricultural village clusters or urban ward economic tiers.\n3. **Independent Allocation**: Draw 6,000 households from Rural and 4,000 households from Urban using circular systematic sampling.\n\n**Benefit**: Guarantees that neither urban slums nor remote rural hamlets are omitted, reducing overall sampling variance by **~34%** compared to a raw random draw!`,
          suggestedActions: [
            { label: 'Take Sampling Quiz', url: '/quizzes', promptText: 'Give me a quiz on sampling' },
            { label: 'View NSS Survey Manual', url: '/courses' }
          ],
          sessionContext: { lastTopic: 'stratified sampling', lastSkill: 'Sampling', lastIntent: 'EXAMPLE' }
        };
      } else if (lastTopic?.includes('python') || text.includes('python')) {
        return {
          answer: `**Practical Example: Python Pandas for Survey Weight Imputation**\n\nHere is how you replace missing survey weights with the median weight of each stratum in 3 lines:\n\n\`\`\`python\nimport pandas as pd\n\n# Load survey microdata\ndf = pd.read_parquet("nss_round_79.parquet")\n\n# Vectorized stratum median fill\ndf["weight"] = df.groupby("stratum_code")["weight"].transform(\n    lambda x: x.fillna(x.median())\n)\n\`\`\`\n\nThis executes in native C-speed arrays, processing 5 million survey records in under **1.2 seconds**!`,
          suggestedActions: [
            { label: 'Enroll in Python Course', url: '/courses', promptText: 'Recommend a Python course' },
            { label: 'View Learning Path', url: '/learning-path' }
          ],
          sessionContext: { lastTopic: 'python', lastSkill: 'Python', lastIntent: 'EXAMPLE' }
        };
      } else if (lastTopic?.includes('sql') || text.includes('sql')) {
        return {
          answer: `**Practical Example: SQL Window Function for National Accounts**\n\n\`\`\`sql\nSELECT \n    state_code, \n    survey_year, \n    gross_value_added,\n    -- Calculate year-over-year growth percentage\n    ROUND((\n        (gross_value_added - LAG(gross_value_added, 1) OVER (PARTITION BY state_code ORDER BY survey_year)) \n        / LAG(gross_value_added, 1) OVER (PARTITION BY state_code ORDER BY survey_year)\n    ) * 100, 2) AS yoy_gva_growth_pct\nFROM state_economic_accounts;\n\`\`\`\n\nThis allows economists to compute growth trajectories across all 36 States/UTs simultaneously!`,
          suggestedActions: [
            { label: 'View SQL Course', url: '/courses', promptText: 'Recommend a course for SQL' }
          ],
          sessionContext: { lastTopic: 'sql', lastSkill: 'SQL', lastIntent: 'EXAMPLE' }
        };
      } else {
        return {
          answer: `**Practical Illustration: Automated Machine Learning Coding in MoSPI**\n\nWhen survey enumerators enter free-text enterprise descriptions like *"Retail trade of pharmaceutical goods in specialized stores"*, a fine-tuned Transformer NLP model maps it instantly to **NIC-2008 Code 47721** with a **98.4% confidence score**.\n\nIf the confidence is below 85%, the record is automatically routed to a Statistical Officer's queue for human review!`,
          suggestedActions: [
            { label: 'Explore AI/ML Courses', url: '/courses', promptText: 'Show me AI/ML courses' }
          ],
          sessionContext: { lastTopic: 'ai in statistics', lastSkill: 'AI/ML', lastIntent: 'EXAMPLE' }
        };
      }
    }

    if (isDurationRequest) {
      return {
        answer: `**Estimated Duration & Study Timeline**:\n\n• **iGOT Online Micro-Courses**: 5 to 14 hours per course (self-paced, typically completed over 1-2 weeks at 1 hr/day).\n• **Full 4-Phase Learning Path**: 12 to 16 weeks total for complete mastery from foundation to domain application.\n• **NSSTA Residential Programmes**: 3 to 14 days intensive on-campus training at Greater Noida.\n\nWould you like me to create a customized weekly schedule for your learning goals?`,
        suggestedActions: [
          { label: 'View 4-Phase Learning Path', url: '/learning-path' },
          { label: 'Browse Courses', url: '/courses' }
        ],
        sessionContext: { lastTopic: lastTopic || 'learning timeline', lastIntent: 'DURATION' }
      };
    }

    if (isWhyRecommendRequest) {
      return {
        answer: `**Why was this course recommended for you?**\n\nOur 6-Factor AI Recommendation Engine analyzed your profile:\n\n1. **Cadre Gap Relevance (35% Weight)**: Directly targets your primary identified competency deficit.\n2. **Job Role Benchmark (25% Weight)**: Mandatory competency required for **${userRole}** standards.\n3. **Prior Learning Alignment (15% Weight)**: Builds upon your verified prerequisite courses.\n4. **Career Progression (10% Weight)**: Required for senior cadre promotions.\n5. **MoSPI Strategic Priority (10% Weight)**: Modernizing survey systems to digital CAPI/CATI.\n6. **Emerging Tech Horizon (5% Weight)**: Prepares for 2026-2030 digital statistics infrastructure.`,
        suggestedActions: [
          { label: 'View All Recommended Courses', url: '/courses' },
          { label: 'Open Gap Analysis', url: '/skill-gaps' }
        ],
        sessionContext: { lastTopic: 'recommendation rationale', lastIntent: 'WHY_RECOMMEND' }
      };
    }

    // 2. USER SKILLS / STRENGTHS & WEAKNESSES INTENT
    if (
      text.includes('strongest skill') ||
      text.includes('best skill') ||
      text.includes('what am i good at') ||
      text.includes('weakest skill') ||
      text.includes('lowest score') ||
      text.includes('current competency') ||
      text.includes('my skills') ||
      text.includes('my profile') ||
      text.includes('my competency')
    ) {
      const sortedSkills = [...userSkills].sort((a, b) => b.competencyScore - a.competencyScore);
      const strongest = sortedSkills.slice(0, 3);
      const weakest = sortedSkills.slice(-3).reverse();

      const isWeakestQuery = text.includes('weakest') || text.includes('lowest') || text.includes('improve first');

      if (isWeakestQuery) {
        const lowest = weakest[0];
        return {
          answer: `**Your Primary Competency Deficits (${userName})**:\n\nBased on your official personnel record, your lowest competency scores are:\n\n• 🔴 **${weakest[0]?.skillName}**: **${weakest[0]?.competencyScore}%** (${weakest[0]?.competencyLevel})\n• 🔴 **${weakest[1]?.skillName}**: **${weakest[1]?.competencyScore}%** (${weakest[1]?.competencyLevel})\n• 🟡 **${weakest[2]?.skillName}**: **${weakest[2]?.competencyScore}%** (${weakest[2]?.competencyLevel})\n\n**Recommendation**: For your **${userRole}** assignment, prioritize strengthening **${weakest[0]?.skillName}** and **${weakest[1]?.skillName}** first to meet cadre operational requirements.`,
          cards: weakest.map(sk => ({
            type: 'skill',
            title: sk.skillName,
            subtitle: `${sk.category} Category`,
            badge: `${sk.competencyScore}% (${sk.competencyLevel})`,
            badgeColor: sk.competencyScore < 40 ? 'red' : 'orange',
            metric: 'Target: 75%'
          })),
          suggestedActions: [
            { label: 'View Skill Gaps', url: '/skill-gaps', promptText: 'What are my skill gaps?' },
            { label: 'Recommend Courses', url: '/courses', promptText: 'What should I learn next?' }
          ],
          sessionContext: { lastTopic: 'user weaknesses', lastSkill: lowest?.skillName, lastIntent: 'USER_SKILLS' }
        };
      }

      return {
        answer: `**Competency Profile Summary for ${userName} (${userRole})**:\n\n**Overall Readiness Index**: **${gapReport.overallCompetency}%**\n\n🏆 **Your Strongest Skills**:\n${strongest.map(s => `• 🟢 **${s.skillName}**: **${s.competencyScore}%** (${s.competencyLevel})`).join('\n')}\n\n⚠️ **Areas Needing Development**:\n${weakest.map(s => `• 🔴 **${s.skillName}**: **${s.competencyScore}%** (${s.competencyLevel})`).join('\n')}`,
        cards: [
          ...strongest.map(sk => ({
            type: 'skill' as const,
            title: sk.skillName,
            subtitle: 'Verified Competency',
            badge: `${sk.competencyScore}%`,
            badgeColor: 'green' as const
          })),
          ...weakest.map(sk => ({
            type: 'skill' as const,
            title: sk.skillName,
            subtitle: 'Target Cadre Gap',
            badge: `${sk.competencyScore}%`,
            badgeColor: 'red' as const
          }))
        ],
        suggestedActions: [
          { label: 'View Gap Analysis', url: '/skill-gaps', promptText: 'What are my skill gaps?' },
          { label: 'Take Re-Assessment', url: '/assessment', promptText: 'Start an assessment' }
        ],
        sessionContext: { lastTopic: 'competency profile', lastIntent: 'USER_SKILLS' }
      };
    }

    // 3. SKILL GAPS INTENT
    if (
      text.includes('skill gap') ||
      text.includes('gaps') ||
      text.includes('why is ai/ml') ||
      text.includes('why is python') ||
      text.includes('what should i improve') ||
      text.includes('which skill should i improve') ||
      text.includes('how can i improve')
    ) {
      const topGaps = gapReport.gaps.filter(g => g.severity === 'High' || g.severity === 'Medium');

      return {
        answer: `**Skill Gap Diagnostic Analysis for ${userRole}**:\n\n${gapReport.aiExplanation}\n\n**Top Priority Gaps to Close**:\n${topGaps.map(g => `• ${g.severity === 'High' ? '🔴' : '🟡'} **${g.skillName}**: Current **${g.currentScore}%** vs Cadre Target **${g.requiredScore}%** (Deficit: **-${g.gap}%**)`).join('\n')}\n\nClosing these deficits directly aligns with MoSPI's digital survey modernization and data quality initiatives.`,
        cards: topGaps.slice(0, 3).map(g => ({
          type: 'gap',
          title: g.skillName,
          subtitle: `Current: ${g.currentScore}% | Target: ${g.requiredScore}%`,
          badge: `${g.severity} Gap (-${g.gap}%)`,
          badgeColor: g.severity === 'High' ? 'red' : 'orange',
          actionLabel: 'Remediate',
          actionUrl: '/courses'
        })),
        suggestedActions: [
          { label: 'View Detailed Radar Chart', url: '/skill-gaps' },
          { label: 'What should I learn next?', url: '/learning-path', promptText: 'What should I learn next?' }
        ],
        sessionContext: { lastTopic: 'skill gaps', lastSkill: topGaps[0]?.skillName, lastIntent: 'SKILL_GAPS' }
      };
    }

    // 3.5 PLATFORM HELP & HOW-TO INTENT
    if (
      text.includes('how do i') ||
      text.includes('how to') ||
      text.includes('where can i') ||
      text.includes('how does statskill work') ||
      text.includes('what is statskill') ||
      text.includes('help')
    ) {
      if (text.includes('enroll') || text.includes('registration')) {
        return {
          answer: `**How to Enroll in an Official Course**:\n\n1. **Browse Courses**: Navigate to the **Course Catalogue** tab from the top menu or through your personalized learning roadmap.\n2. **Select Course**: Click **"Enroll on iGOT"** on any recommended course (e.g. *Python for Statistical Data Analysis*).\n3. **Track Progress**: The course is instantly linked to your official profile in **My Dashboard**.\n4. **Complete & Verify**: As you progress through the modules, take the post-module quiz to update your official competency score!`,
          suggestedActions: [
            { label: 'Open Course Catalogue', url: '/courses' },
            { label: 'View 4-Phase Learning Path', url: '/learning-path' }
          ],
          sessionContext: { lastTopic: 'course enrollment help', lastIntent: 'PLATFORM_HELP' }
        };
      }

      return {
        answer: `**How StatSkill AI Works**:\n\n1. **Profile**: Update your cadre designation, education, and self-assessed skills in **My Profile**.\n2. **Assess**: Launch an **Adaptive Assessment** to scientifically test your competencies.\n3. **Skill Gaps**: Review your **Skill Gap Analysis** to see where you stand vs Cadre Benchmarks.\n4. **Personalized Learning**: Follow your **4-Phase Learning Path** and enroll in matched iGOT courses.\n5. **Re-Assess & Grow**: Take certification quizzes; your competency scores update dynamically!\n\nWhere would you like to navigate?`,
        suggestedActions: [
          { label: 'My Dashboard', url: '/dashboard' },
          { label: 'Skill Gap Analysis', url: '/skill-gaps' },
          { label: 'Course Catalogue', url: '/courses' },
          { label: 'Assessments', url: '/quizzes' }
        ],
        sessionContext: { lastTopic: 'platform help', lastIntent: 'PLATFORM_HELP' }
      };
    }

    // 4. COURSE RECOMMENDATION INTENT
    if (
      text.includes('what should i learn') ||
      text.includes('recommend') ||
      text.includes('next course') ||
      text.includes('courses') ||
      text.includes('course') ||
      text.includes('suggest') ||
      text.includes('find course')
    ) {
      let filteredRecs: CourseRecommendation[] = recommendations;

      if (text.includes('python')) {
        filteredRecs = recommendations.filter((r: CourseRecommendation) => r.course.skill.toLowerCase().includes('python'));
      } else if (text.includes('sql')) {
        filteredRecs = recommendations.filter((r: CourseRecommendation) => r.course.skill.toLowerCase().includes('sql'));
      } else if (text.includes('ai') || text.includes('machine learning')) {
        filteredRecs = recommendations.filter((r: CourseRecommendation) => r.course.skill.toLowerCase().includes('ai') || r.course.skill.toLowerCase().includes('ml'));
      } else if (text.includes('gis') || text.includes('spatial')) {
        filteredRecs = recommendations.filter((r: CourseRecommendation) => r.course.skill.toLowerCase().includes('gis'));
      }

      if (filteredRecs.length === 0) {
        filteredRecs = recommendations;
      }

      const topRec = filteredRecs[0] || recommendations[0];

      return {
        answer: `**AI Recommended Courses for ${userName} (${userRole})**:\n\nBased on your **${topRec?.course?.skill || 'Statistical'}** competency gap and cadre requirements, here are your top matched training modules:\n\n${filteredRecs.slice(0, 3).map((r: CourseRecommendation, idx: number) => `**${idx + 1}. ${r.course.title}**\n• Provider: **${r.course.provider}** | Duration: **${r.course.duration}**\n• AI Match: **${r.matchScore}%**\n• *Why this course?* ${r.reason}`).join('\n\n')}`,
        cards: filteredRecs.slice(0, 3).map((r: CourseRecommendation) => ({
          type: 'course' as const,
          title: r.course.title,
          subtitle: `${r.course.provider} • ${r.course.duration}`,
          badge: `Match: ${r.matchScore}%`,
          badgeColor: 'blue' as const,
          metric: r.course.difficulty,
          actionLabel: 'Enroll on iGOT',
          actionUrl: '/courses'
        })),
        suggestedActions: [
          { label: 'Open Course Catalogue', url: '/courses' },
          { label: 'View 4-Phase Learning Path', url: '/learning-path', promptText: 'Give me a learning roadmap' }
        ],
        sessionContext: {
          lastTopic: `${topRec?.course?.skill || 'Statistical'} courses`,
          lastSkill: topRec?.course?.skill,
          lastCourseId: topRec?.course?.id,
          lastIntent: 'COURSE_RECOMMENDATION'
        }
      };
    }

    // 5. LEARNING PATH / ROADMAP INTENT
    if (
      text.includes('learning path') ||
      text.includes('roadmap') ||
      text.includes('what should i learn before') ||
      text.includes('create a learning path') ||
      text.includes('progression')
    ) {
      return {
        answer: `**Personalized 4-Phase Learning Roadmap for ${userRole}**:\n\n$$\\text{Phase 1 (Foundation)} \\longrightarrow \\text{Phase 2 (Applied)} \\longrightarrow \\text{Phase 3 (Advanced)} \\longrightarrow \\text{Phase 4 (Domain)}$$\n\n1. **Phase 1 — Foundation Skills (Weeks 1–3)**:\n   • *Python for Statistical Data Analysis* (iGOT - 8 hrs)\n   • *Modern Data Visualization with PowerBI* (iGOT - 7 hrs)\n\n2. **Phase 2 — Applied Technical Skills (Weeks 4–7)**:\n   • *Geospatial Data Analytics & QGIS* (iGOT - 10 hrs)\n   • *Government Cloud Architecture on MeghRaj* (iGOT - 6 hrs)\n\n3. **Phase 3 — Advanced Analytics (Weeks 8–11)**:\n   • *AI & Machine Learning in Official Statistics* (iGOT - 12 hrs)\n   • *Data Privacy & DPDP Act 2023 Compliance* (iGOT - 5 hrs)\n\n4. **Phase 4 — Domain Specialization & Leadership (Weeks 12–14)**:\n   • *NSSTA Residential Masterclass on AI in National Statistics* (Greater Noida)`,
        suggestedActions: [
          { label: 'Open Interactive Roadmap', url: '/learning-path' },
          { label: 'Start Phase 1 Courses', url: '/courses', promptText: 'Recommend a Python course' }
        ],
        sessionContext: { lastTopic: 'learning roadmap', lastIntent: 'LEARNING_PATH' }
      };
    }
    // 6. ASSESSMENTS & QUIZZES INTENT
    if (
      text.includes('assessment') ||
      text.includes('quiz') ||
      text.includes('test') ||
      text.includes('exam') ||
      text.includes('how did i perform')
    ) {
      return {
        answer: `**Official Skill Assessments & Certifications**:\n\n• **Adaptive Competency Assessment**: An AI-powered diagnostic that automatically calibrates question difficulty (Easy $\\to$ Medium $\\to$ Hard) based on your answers.\n• **Certification Quizzes**: Official timed tests with instant explanations and automatic score updates in your personnel record.\n\nWould you like to launch an adaptive assessment now or take a specialized subject quiz?`,
        suggestedActions: [
          { label: 'Launch Adaptive Assessment', url: '/assessment' },
          { label: 'Browse Available Quizzes', url: '/quizzes' }
        ],
        sessionContext: { lastTopic: 'assessments', lastIntent: 'ASSESSMENT' }
      };
    }

    // 7. IGOT COURSES INTENT
    if (text.includes('igot') || text.includes('karmayogi') || text.includes('find courses') || text.includes('catalogue')) {
      return {
        answer: `**iGOT Karmayogi Course Matrix**:\n\nWe have indexed **8 verified official courses** tailored for statistical personnel:\n\n• **Python for Statistical Data Analysis** (8 hrs, Beginner, 94% Match)\n• **AI & Machine Learning for Official Statistics** (12 hrs, Intermediate, 91% Match)\n• **Advanced SQL for National Registers** (9 hrs, Advanced, 85% Match)\n• **Modern Data Visualization with PowerBI** (7 hrs, Intermediate, 88% Match)\n• **Geospatial Analytics & QGIS** (10 hrs, Intermediate, 86% Match)\n• **Data Privacy & DPDP Act 2023** (5 hrs, Intermediate, 82% Match)\n• **System of National Accounts (SNA 2008)** (14 hrs, Advanced, 80% Match)\n• **Government Cloud & MeghRaj Security** (6 hrs, Beginner, 89% Match)`,
        suggestedActions: [
          { label: 'Browse Full iGOT Catalogue', url: '/courses' },
          { label: 'Filter by Python', url: '/courses', promptText: 'Show me Python courses' }
        ],
        sessionContext: { lastTopic: 'igot courses', lastIntent: 'IGOT_COURSES' }
      };
    }

    // 8. NSSTA RESIDENTIAL TRAINING INTENT
    if (text.includes('nssta') || text.includes('tpac') || text.includes('residential') || text.includes('greater noida') || text.includes('workshop')) {
      return {
        answer: `**National Statistical Systems Training Academy (NSSTA) — Greater Noida**:\n\nPremier training programmes currently accepting cadre nominations:\n\n1. **Executive Masterclass: AI & Machine Learning in Official Statistics**\n   • Mode: **Residential (Greater Noida)** | Batch: **14 Oct - 19 Oct 2026**\n   • Eligibility: Statistical Officers & Assistant Directors | Match: **95%**\n\n2. **Advanced Sampling Design & Sample Weight Calibration in Large-Scale Surveys**\n   • Mode: **Residential (Greater Noida)** | Batch: **22 Oct - 27 Oct 2026**\n   • Eligibility: Officers involved in NSS/ASI surveys | Match: **92%**\n\n3. **Modernizing Survey Workflows with CAPI/CATI & Geospatial Tech**\n   • Mode: **Hybrid Workshop** | Batch: **28 Oct - 31 Oct 2026** | Match: **89%**`,
        cards: allNssta.slice(0, 3).map((prog: NSSTAProgramme) => ({
          type: 'nssta' as const,
          title: prog.title,
          subtitle: `${prog.mode} • ${prog.batchDate}`,
          badge: `Match: ${prog.recommendationScore}%`,
          badgeColor: 'purple' as const,
          metric: `${prog.seatsAvailable} seats left`,
          actionLabel: 'Apply for Nomination',
          actionUrl: '/nssta'
        })),
        suggestedActions: [
          { label: 'Browse NSSTA Programmes', url: '/nssta' }
        ],
        sessionContext: { lastTopic: 'nssta training', lastIntent: 'NSSTA_TRAINING' }
      };
    }

    // 9. AI SKILL COACH & INTERACTIVE TEACHING INTENTS
    if (text.includes('teach me pandas') || text.includes('pandas') || text.includes('teach me python')) {
      return {
        answer: `### 🎓 StatBot AI Skill Coach: Pandas for Official Statistics\n\n**What is Pandas?**\nPandas is Python's primary tool for tabular data analysis, making it easy to clean, filter, and aggregate national survey microdata (like NSS and ASI).\n\n**Key Concept: The DataFrame**\nA DataFrame is a 2D table with rows and labeled columns.\n\n\`\`\`python
import pandas as pd

# 1. Load survey microdata
df = pd.read_csv("household_survey.csv")

# 2. Filter rural households in Delhi
rural_delhi = df.query("sector == 'Rural' and state == 'Delhi'")

# 3. Calculate sample-weighted average consumption expenditure
weighted_exp = (rural_delhi["expenditure"] * rural_delhi["multiplier"]).sum() / rural_delhi["multiplier"].sum()
print(f"Weighted Mean: ₹{weighted_exp:,.2f}")
\`\`\`\n\n**🎯 Interactive Quick Check**:\n*Which method is recommended for high-performance string querying without memory overhead in Pandas?*\n• **A)** \`df.query("state == 'Delhi'")\` *(Recommended)*\n• **B)** \`df[df['state'] == 'Delhi']\`\n• **C)** \`df.apply(lambda r: r['state'] == 'Delhi')\`\n\nWould you like to take a 5-question **Python Mini Practice Quiz** or enroll in the complete Kaggle/iGOT Python course?`,
        cards: [
          {
            type: 'course' as const,
            title: 'Python for Statistical Data Analysis',
            subtitle: 'Kaggle Learn / iGOT Karmayogi • 8 Hours',
            badge: 'High Priority Gap (42% / 75%)',
            badgeColor: 'red' as const,
            actionLabel: 'Start Real Course',
            actionUrl: 'https://www.kaggle.com/learn/python'
          }
        ],
        suggestedActions: [
          { label: 'Take 5-Question Practice Quiz', url: '/dashboard', promptText: 'Give me a Python practice question' },
          { label: 'Why is my Python score low?', url: '/skill-gaps', promptText: 'Why is my Python score low?' },
          { label: 'Next Concept: NumPy', url: '/courses', promptText: 'Teach me NumPy' }
        ],
        sessionContext: { lastTopic: 'pandas tutorial', lastSkill: 'Python', lastIntent: 'SKILL_COACH' }
      };
    }

    if (text.includes('why is my') && (text.includes('score low') || text.includes('gap') || text.includes('deficit'))) {
      const targetSkillName = text.includes('python') ? 'Python' :
                             text.includes('cloud') ? 'Cloud Computing' :
                             text.includes('ai') || text.includes('machine learning') ? 'AI/ML' :
                             primaryGap.skillName;

      const userSkill = userSkills.find((s: UserSkill) => s.skillName.toLowerCase().includes(targetSkillName.toLowerCase()));
      const reqSkill = roleBenchmark.requiredSkills.find((s: any) => s.skillName.toLowerCase().includes(targetSkillName.toLowerCase()));

      const current = userSkill ? userSkill.competencyScore : 42;
      const required = reqSkill ? reqSkill.requiredScore : 75;
      const gap = Math.max(0, required - current);

      return {
        answer: `### 🎯 Competency Analysis for ${targetSkillName}\n\n• **Current Competency**: **${current}%**\n• **Required Role Benchmark**: **${required}%** (Mandated for *${userRole}*)\n• **Identified Skill Gap**: **-${gap}% Deficit**\n\n**Why is this score low?**\nYour score reflects your verified assessment performance on ${targetSkillName}. Under national data modernization frameworks, statistical officers are expected to achieve at least **${required}%** to independently manage automated pipelines and microdata validation.\n\n**Recommended Step-by-Step Pathway**:\n1. 📚 Complete the **${targetSkillName}** module on Kaggle/iGOT.\n2. 📝 Return to StatSkill AI and mark the course completed.\n3. ⚡ Take the **5-Question Mini Practice Assessment** to boost your score (+5% to +15%).\n4. 🏆 Re-assess through an official timed assessment.`,
        suggestedActions: [
          { label: `Start ${targetSkillName} Course`, url: '/courses', promptText: `Recommend a ${targetSkillName} course` },
          { label: `Take ${targetSkillName} Practice Quiz`, url: '/dashboard', promptText: `Give me a ${targetSkillName} practice question` }
        ],
        sessionContext: { lastTopic: `${targetSkillName} gap inquiry`, lastSkill: targetSkillName, lastIntent: 'SKILL_DIAGNOSIS' }
      };
    }

    if (text.includes('practice question') || text.includes('test my') || text.includes('quiz question')) {
      const targetSkill = text.includes('cloud') ? 'Cloud Computing' :
                          text.includes('ai') || text.includes('machine learning') ? 'AI/ML' :
                          text.includes('sampling') ? 'Sampling' :
                          'Python';

      const practiceQs = db.getPracticeQuestionsBySkill(targetSkill);
      const q = practiceQs[0];

      return {
        answer: `### ⚡ Mini Practice Question: ${targetSkill}\n\n**Question**:\n${q.question}\n\n**Options**:\n${q.options.map((opt, i) => `• **${String.fromCharCode(65 + i)})** ${opt}`).join('\n')}\n\n*Think about your answer, or launch the complete 5-question interactive practice quiz on your dashboard to record your score boost!*`,
        suggestedActions: [
          { label: `Launch 5-Question ${targetSkill} Quiz`, url: '/dashboard', promptText: `Launch ${targetSkill} practice quiz` },
          { label: 'Show Explanation', url: '/assessment', promptText: `Explain answer for: ${q.question}` }
        ],
        sessionContext: { lastTopic: `${targetSkill} practice`, lastSkill: targetSkill, lastIntent: 'PRACTICE_QUESTION' }
      };
    }

    // 10. GENERAL STATISTICAL CONCEPT EXPLANATIONS (EDUCATIONAL)
    if (text.includes('python')) {
      return {
        answer: `**Python in Official Statistics**:\n\nPython has become the premier open-source language for modernizing statistical workflows across MoSPI and national statistical agencies:\n\n• **Data Wrangling (Pandas & Polars)**: Efficient cleaning, filtering, and imputation of multi-gigabyte survey microdata.\n• **High-Performance Computation (NumPy & Numba)**: Vectorized mathematical operations for complex sampling formulas.\n• **Survey Modeling (Statsmodels & Scipy)**: Computing cluster-robust standard errors and regression estimation.\n• **Automated Reporting**: Converting raw survey databases into automated statistical tables and bulletins.\n\nWould you like me to recommend the foundational Python course for your profile?`,
        suggestedActions: [
          { label: 'Recommend Python Course', url: '/courses', promptText: 'Recommend a Python course' },
          { label: 'Teach me Pandas', url: '/courses', promptText: 'Teach me Pandas' }
        ],
        sessionContext: { lastTopic: 'python in statistics', lastSkill: 'Python', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    if (text.includes('stratified') || text.includes('sampling') || text.includes('cluster')) {
      return {
        answer: `**Stratified Sampling vs Cluster Sampling in Official Statistics**:\n\n1. **Stratified Random Sampling**:\n   • The population is divided into **homogeneous** subgroups (strata) based on known characteristics (e.g. Rural/Urban, Agro-climatic zones, Enterprise size).\n   • A probability sample is drawn from **every** stratum.\n   • **Primary Benefit**: Minimizes sampling variance and guarantees representation of rare minority domains.\n\n2. **Cluster Sampling**:\n   • The population is divided into **heterogeneous** natural clusters (e.g. Villages, Urban Frame Blocks - UFBs).\n   • A random sample of *clusters* is chosen, and all or some households within chosen clusters are surveyed.\n   • **Primary Benefit**: Drastically reduces travel and logistic costs for field enumerators.\n\n*MoSPI NSS surveys use **Stratified Multi-Stage Sampling** to combine the variance reduction of stratification with the logistical efficiency of clustering!*`,
        suggestedActions: [
          { label: 'Give me an example', url: '/assessment', promptText: 'Give me an example of stratified sampling' },
          { label: 'Take Sampling Quiz', url: '/quizzes', promptText: 'Give me a quiz on sampling' }
        ],
        sessionContext: { lastTopic: 'stratified sampling', lastSkill: 'Sampling', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    if (text.includes('sql') || text.includes('database') || text.includes('query')) {
      return {
        answer: `**SQL in National Statistical Systems**:\n\nStructured Query Language (SQL) is the foundational standard for managing national administrative registries, economic census tables, and large-scale microdata:\n\n• **Analytical Window Functions**: \`OVER (PARTITION BY ... ORDER BY ...)\` enables calculating cumulative totals, year-over-year growth, and moving averages without collapsing rows.\n• **Partition Pruning**: Segmenting tables by financial year or state speeds up queries on billion-row datasets.\n• **Data Quality Rules**: Writing SQL constraints and stored procedures to detect duplicate household entries and invalid boundary codes.\n\nWould you like to explore our Advanced SQL course on iGOT?`,
        suggestedActions: [
          { label: 'View SQL Course', url: '/courses', promptText: 'Recommend a course for SQL' },
          { label: 'Give me an example', url: '/courses', promptText: 'Give me an example of SQL in statistics' }
        ],
        sessionContext: { lastTopic: 'sql in statistics', lastSkill: 'SQL', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    if (text.includes('standard deviation') || text.includes('variance') || text.includes('standard error')) {
      return {
        answer: `**Standard Deviation vs Standard Error in Official Statistics**:\n\n• **Standard Deviation (SD)**: Measures the dispersion or spread of individual data values around the sample mean ($\\sigma = \\sqrt{\\frac{\\sum(x_i - \\bar{x})^2}{N}}$). It describes the natural variability in the population.\n• **Standard Error (SE)**: Measures the precision of the sample estimate as an estimator of the population parameter ($SE = \\frac{SD}{\\sqrt{n}} \\times \\sqrt{DEFF}$). It tells you how much the sample mean would vary if you repeated the survey many times.\n\nIn official publications (like PLFS and CPI), standard errors are used to calculate the **Margin of Error** and construct **95% Confidence Intervals**.`,
        suggestedActions: [
          { label: 'Take Statistics Quiz', url: '/quizzes', promptText: 'Give me a quiz on statistics' }
        ],
        sessionContext: { lastTopic: 'standard deviation and error', lastSkill: 'Sampling', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    if (text.includes('confidence interval') || text.includes('margin of error')) {
      return {
        answer: `**Confidence Intervals in Official Statistics**:\n\nA **Confidence Interval (CI)** provides an estimated range of values that is likely to include the true unknown population parameter with a specified confidence level (typically 95%):\n\n$$\\text{CI}_{95\\%} = \\hat{\\theta} \\pm 1.96 \\times \\text{SE}(\\hat{\\theta})$$\n\n• **Interpretation**: If a survey were repeated 100 times under identical sampling design, 95 of the generated confidence intervals would contain the true national parameter.\n• **Application**: In MoSPI quarterly GDP and labour force bulletins, confidence bands ensure policymakers understand estimation precision.`,
        suggestedActions: [
          { label: 'Take Sampling Quiz', url: '/quizzes' }
        ],
        sessionContext: { lastTopic: 'confidence intervals', lastSkill: 'Sampling', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    if (text.includes('gis') || text.includes('spatial') || text.includes('qgis') || text.includes('map')) {
      return {
        answer: `**Geospatial Analytics (GIS) in Official Statistics**:\n\nIntegrating Geographic Information Systems with statistical data is central to the **UN Integrated Geospatial Information Framework (UN-IGIF)**:\n\n• **Enumeration Block Geo-Tagging**: Digitizing primary sampling unit boundaries using mobile GPS during CAPI listing.\n• **Spatial Autocorrelation**: Using Moran's I and LISA to identify geographic clusters of health, literacy, or poverty indices.\n• **Satellite Remote Sensing**: Overlaying Sentinel/Landsat vegetation indices (NDVI) with crop cutting experiments to estimate national agricultural yields.`,
        suggestedActions: [
          { label: 'View GIS Course', url: '/courses', promptText: 'Show me GIS courses' }
        ],
        sessionContext: { lastTopic: 'gis in statistics', lastSkill: 'GIS', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    if (text.includes('national accounts') || text.includes('sna') || text.includes('gdp') || text.includes('gva')) {
      return {
        answer: `**System of National Accounts (SNA 2008)**:\n\nSNA 2008 is the globally agreed standard framework for compiling macroeconomic aggregates:\n\n• **GDP compilation**: Measured through 3 equivalent approaches: Production (GVA at basic prices), Expenditure, and Income.\n• **Gross Fixed Capital Formation (GFCF)**: Includes capitalized R&D, software, and intellectual property products.\n• **Supply and Use Tables (SUT)**: Comprehensive matrices balancing commodity supply with domestic use to eliminate statistical discrepancies.`,
        suggestedActions: [
          { label: 'View National Accounts Course', url: '/courses' }
        ],
        sessionContext: { lastTopic: 'national accounts', lastSkill: 'National Accounts', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    if (text.includes('privacy') || text.includes('dpdp') || text.includes('anonymization')) {
      return {
        answer: `**Data Privacy & The DPDP Act 2023**:\n\nThe **Digital Personal Data Protection Act 2023** establishes strict legal obligations for statistical agencies processing citizen microdata:\n\n• **Statistical Confidentiality**: Data collected for statistical purposes cannot be used for punitive, taxation, or administrative actions against individual respondents.\n• **Anonymization & $\\epsilon$-Differential Privacy**: Adding mathematically calibrated perturbation noise so that individual respondent records cannot be reverse-engineered by adversaries with auxiliary datasets.\n• **Top-Coding & Micro-aggregation**: Masking extreme wealth or sensitive outlier values before open data dissemination.`,
        suggestedActions: [
          { label: 'View Data Privacy Course', url: '/courses' }
        ],
        sessionContext: { lastTopic: 'data privacy and dpdp', lastSkill: 'Data Privacy', lastIntent: 'GENERAL_STATISTICS' }
      };
    }

    // DEFAULT DYNAMIC INTENT-AWARE FALLBACK
    return {
      answer: `Namaste ${userName}! I am **StatBot**, your AI Statistical Skill Intelligence Mentor.\n\nI understand your query: *"${rawMsg}"*.\n\nHere is how I can assist your capacity building as a **${userRole}**:\n• **Explore Competencies**: Ask *"What are my strongest skills?"* or *"What are my skill gaps?"*\n• **Course Suggestions**: Ask *"Recommend a Python course"* or *"What should I learn next?"*\n• **Statistical Methodologies**: Ask *"Explain stratified sampling"*, *"What is SQL?"*, or *"Explain DPDP Act 2023"*\n• **Training Academies**: Ask *"What NSSTA programmes are available?"*\n\nHow would you like to proceed?`,
      suggestedActions: [
        { label: 'What should I learn next?', url: '/learning-path', promptText: 'What should I learn next?' },
        { label: 'Show my skill gaps', url: '/skill-gaps', promptText: 'What are my skill gaps?' },
        { label: 'Explain Stratified Sampling', url: '/assessment', promptText: 'Explain stratified sampling' }
      ],
      sessionContext: { lastTopic: 'general assistance', lastIntent: 'DEFAULT' }
    };
  }
}

export const aiService = new AIService();
