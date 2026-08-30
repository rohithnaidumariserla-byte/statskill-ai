import { BankQuestion, AssessmentQuestion } from '../data/seedData';
import { db } from '../data/db';

export interface TrustedSource {
  name: string;
  domain: string;
  url: string;
  description: string;
  subject: string;
}

export const TRUSTED_SOURCES: TrustedSource[] = [
  {
    name: 'Ministry of Statistics and Programme Implementation (MoSPI)',
    domain: 'mospi.gov.in',
    url: 'https://mospi.gov.in/sample-survey-methodology',
    description: 'Official methodology and technical guidelines for National Sample Surveys, ASI, and PLFS.',
    subject: 'Statistics'
  },
  {
    name: 'National Statistical Systems Training Academy (NSSTA)',
    domain: 'nssta.gov.in',
    url: 'https://nssta.gov.in/training-modules',
    description: 'Cadre training manuals on advanced sampling, small area estimation, and survey design.',
    subject: 'Statistics'
  },
  {
    name: 'United Nations Statistics Division (UNSD)',
    domain: 'unstats.un.org',
    url: 'https://unstats.un.org/unsd/methodology/surveys/',
    description: 'Global standards for household sample surveys, census cartography, and national accounts.',
    subject: 'Statistics'
  },
  {
    name: 'Python Software Foundation (Official Documentation)',
    domain: 'python.org',
    url: 'https://docs.python.org/3/library/statistics.html',
    description: 'Official reference for Python data structures, standard statistical libraries, and typing.',
    subject: 'Python'
  },
  {
    name: 'Pandas Official Microdata Documentation',
    domain: 'pandas.pydata.org',
    url: 'https://pandas.pydata.org/docs/user_guide/categorical.html',
    description: 'High-performance survey data wrangling, memory optimization, and vectorized imputation.',
    subject: 'Python'
  },
  {
    name: 'PostgreSQL Global Development Group (SQL Standard)',
    domain: 'postgresql.org',
    url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
    description: 'Official documentation for ANSI window functions, partition pruning, and indexing.',
    subject: 'SQL'
  },
  {
    name: 'United Nations Economic Commission for Europe (UNECE AI Group)',
    domain: 'unece.org',
    url: 'https://unece.org/statistics/machine-learning-official-statistics',
    description: 'Machine learning frameworks for official statistical classification, synthetic data, and NLP.',
    subject: 'AI/ML'
  },
  {
    name: 'United Nations Integrated Geospatial Information Framework (UN-IGIF)',
    domain: 'un.org',
    url: 'https://ggim.un.org/UN-IGIF/',
    description: 'Standards for geospatial integration with population census and spatial sampling.',
    subject: 'GIS'
  },
  {
    name: 'Inter-Secretariat Working Group on National Accounts (ISWGNA / UN SNA 2008)',
    domain: 'unstats.un.org',
    url: 'https://unstats.un.org/unsd/nationalaccount/sna2008.asp',
    description: 'System of National Accounts standards, GFCF, Supply and Use Tables, and GDP deflators.',
    subject: 'National Accounts'
  },
  {
    name: 'Ministry of Electronics & IT (DPDP Act 2023 Guidelines)',
    domain: 'meity.gov.in',
    url: 'https://www.meity.gov.in/data-protection-framework',
    description: 'Statutory compliance for citizen microdata confidentiality and differential privacy.',
    subject: 'Data Privacy'
  }
];

export interface ConceptItem {
  id: string;
  subject: string;
  topic: string;
  conceptName: string;
  summary: string;
  source: string;
  sourceUrl: string;
}

export const CONCEPT_REGISTRY: ConceptItem[] = [
  // STATISTICS & SAMPLING
  {
    id: 'c-stat-1',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Stratified Random Sampling',
    summary: 'Dividing heterogeneous populations into homogeneous strata to decrease sampling variance and guarantee representation of minority subpopulations.',
    source: 'UNSD Household Sample Survey Handbook',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/'
  },
  {
    id: 'c-stat-2',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Neyman Optimum Allocation',
    summary: 'Allocating sample sizes across strata proportional to stratum size and stratum standard deviation, minimizing total variance for fixed sample size.',
    source: 'MoSPI Sampling & Survey Design Manual',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology'
  },
  {
    id: 'c-stat-3',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Multi-Stage Cluster Sampling',
    summary: 'Selecting primary sampling units (villages/urban blocks) in stage 1 and ultimate households in stage 2 to minimize field operational travel logistics.',
    source: 'MoSPI NSS Field Operations SOP',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology'
  },
  {
    id: 'c-stat-4',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Design Effect (DEFF)',
    summary: 'The ratio of variance under complex multi-stage sampling to variance under simple random sampling with equivalent sample size (DEFF = 1 + (m-1)*ICC).',
    source: 'UN Statistics Division Technical Guidelines',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/'
  },
  {
    id: 'c-stat-5',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Systematic Sampling & Periodicity Bias',
    summary: 'Selecting every k-th element from a random start point. Prone to severe estimation bias if the list has hidden periodicity matching interval k.',
    source: 'Sampling Techniques (W.G. Cochran)',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/'
  },
  {
    id: 'c-stat-6',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Horvitz-Thompson Estimator',
    summary: 'Design-unbiased estimator for population totals under unequal probability sampling without replacement, weighting by inverse inclusion probabilities (1/pi_i).',
    source: 'Horvitz & Thompson (1952) / MoSPI Theory',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology'
  },
  {
    id: 'c-stat-7',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Generalized Regression (GREG) Calibration',
    summary: 'Adjusting survey weights using known auxiliary population totals from administrative registers to eliminate non-response bias and decrease variance.',
    source: 'Deville & Sarndal Calibration Guidelines',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/'
  },
  {
    id: 'c-stat-8',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'Sampling Frame & Coverage Errors',
    summary: 'Differences between target population and sampling frame causing undercoverage, duplication, or out-of-scope errors in statistical rosters.',
    source: 'NSSTA Cadre Training Manual',
    sourceUrl: 'https://nssta.gov.in/training-modules'
  },
  {
    id: 'c-stat-9',
    subject: 'Statistics',
    topic: 'Sampling',
    conceptName: 'CAPI Automated Validation Checks',
    summary: 'Implementing real-time logic constraints and range validations directly in field tablets to correct enumerator capture errors immediately.',
    source: 'World Bank CAPI Implementation Handbook',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology'
  },

  // PYTHON FOR STATISTICS
  {
    id: 'c-py-1',
    subject: 'Python',
    topic: 'Python for Statistics',
    conceptName: 'Categorical Data Type Optimization',
    summary: 'Converting object string columns to Categorical dtype in Pandas to reduce microdata memory footprint by up to 80% and accelerate groupby aggregations.',
    source: 'Pandas Official User Guide',
    sourceUrl: 'https://pandas.pydata.org/docs/user_guide/categorical.html'
  },
  {
    id: 'c-py-2',
    subject: 'Python',
    topic: 'Python for Statistics',
    conceptName: 'Vectorized Imputation with Groupby Transform',
    summary: 'Using df.groupby().transform(lambda x: x.fillna(x.median())) for high-speed, non-loop stratum-level statistical imputation.',
    source: 'Python Data Science for Official Statistics',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html'
  },
  {
    id: 'c-py-3',
    subject: 'Python',
    topic: 'Python for Statistics',
    conceptName: 'Cluster-Robust Standard Errors in Statsmodels',
    summary: 'Specifying cov_type="cluster" in statsmodels formula regression to adjust standard errors for survey cluster correlation and stratification.',
    source: 'Statsmodels Survey Modeling Documentation',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html'
  },
  {
    id: 'c-py-4',
    subject: 'Python',
    topic: 'Python for Statistics',
    conceptName: 'Apache Parquet Columnar Storage',
    summary: 'Storing multi-gigabyte census and survey microdata in columnar Parquet binary format for rapid slice queries and snappy compression.',
    source: 'Apache Arrow / PyArrow High-Performance Guidelines',
    sourceUrl: 'https://pandas.pydata.org/docs/user_guide/categorical.html'
  },

  // SQL & NATIONAL REGISTERS
  {
    id: 'c-sql-1',
    subject: 'SQL',
    topic: 'SQL for National Registers',
    conceptName: 'Window Functions (OVER, PARTITION BY, ORDER BY)',
    summary: 'Calculating running cumulative totals, moving averages, and year-over-year lag comparisons across administrative data without collapsing rows.',
    source: 'PostgreSQL Official Window Function Documentation',
    sourceUrl: 'https://www.postgresql.org/docs/current/tutorial-window.html'
  },
  {
    id: 'c-sql-2',
    subject: 'SQL',
    topic: 'SQL for National Registers',
    conceptName: 'Partition Pruning in Time-Series Registers',
    summary: 'Segmenting multi-billion row tables by financial year or state code so query engines scan only relevant partitions during macro aggregation.',
    source: 'Enterprise Database Systems for National Registries',
    sourceUrl: 'https://www.postgresql.org/docs/current/tutorial-window.html'
  },

  // AI & MACHINE LEARNING
  {
    id: 'c-ai-1',
    subject: 'AI/ML',
    topic: 'AI in Official Statistics',
    conceptName: 'Transformer NLP for Industrial Classification (NIC/NCO)',
    summary: 'Automating 5-digit NIC 2008 and NCO job coding from free-text survey descriptions with confidence scoring and human verification routing.',
    source: 'UNECE High-Level Group on Machine Learning in Statistics',
    sourceUrl: 'https://unece.org/statistics/machine-learning-official-statistics'
  },
  {
    id: 'c-ai-2',
    subject: 'AI/ML',
    topic: 'AI in Official Statistics',
    conceptName: 'Synthetic Microdata Generation with VAE/GAN',
    summary: 'Generating synthetic datasets that preserve empirical covariance matrices while strictly preventing individual respondent re-identification.',
    source: 'Synthetic Data Framework for Official Statistical Agencies',
    sourceUrl: 'https://unece.org/statistics/machine-learning-official-statistics'
  },

  // GIS & SPATIAL
  {
    id: 'c-gis-1',
    subject: 'GIS',
    topic: 'GIS & Spatial Analytics',
    conceptName: 'Moran I Index & Spatial Autocorrelation',
    summary: 'Evaluating global spatial clustering of socioeconomic indicators (poverty, literacy) and identifying local hotspots with LISA statistics.',
    source: 'Spatial Statistics for Public Policy (Luc Anselin)',
    sourceUrl: 'https://ggim.un.org/UN-IGIF/'
  },

  // NATIONAL ACCOUNTS
  {
    id: 'c-na-1',
    subject: 'National Accounts',
    topic: 'SNA 2008 Standards',
    conceptName: 'R&D Expenditure as Gross Fixed Capital Formation',
    summary: 'SNA 2008 standard recognizing research and development expenditure as capital asset creation (GFCF) rather than intermediate consumption.',
    source: 'System of National Accounts 2008 (UN, World Bank, OECD, IMF)',
    sourceUrl: 'https://unstats.un.org/unsd/nationalaccount/sna2008.asp'
  },

  // DATA PRIVACY
  {
    id: 'c-dp-1',
    subject: 'Data Privacy',
    topic: 'DPDP Act & Statistical Confidentiality',
    conceptName: 'Epsilon-Differential Privacy for Aggregate Dissemination',
    summary: 'Injecting calibrated Laplace or Gaussian perturbation noise to tabular query responses, providing mathematically provable bounds on privacy loss.',
    source: 'Digital Personal Data Protection Act 2023 & UN Guidelines',
    sourceUrl: 'https://www.meity.gov.in/data-protection-framework'
  }
];
export interface MasterQuestionTemplate {
  id: string;
  subject: string;
  topic: string;
  concepts: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
  question: string;
  correctAnswerText: string;
  distractors: string[];
  explanation: string;
  source: string;
  sourceUrl: string;
  tags: string[];
}

export const MASTER_QUESTION_TEMPLATES: MasterQuestionTemplate[] = [
  // 1. SAMPLING: CONCEPTUAL
  {
    id: 'mq-stat-01',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Stratified Random Sampling', 'Variance Reduction'],
    difficulty: 'Medium',
    type: 'Conceptual',
    question: 'What is the primary theoretical objective of stratified random sampling compared to simple random sampling (SRS)?',
    correctAnswerText: 'To ensure representation of heterogeneous subgroups and decrease the sampling variance of population estimates',
    distractors: [
      'To completely eliminate all non-sampling and field measurement errors',
      'To reduce the total number of survey respondents below mathematical validity limits',
      'To avoid constructing a formal sampling frame before sample selection'
    ],
    explanation: 'Stratified sampling partitions a heterogeneous population into homogeneous subgroups (strata) and samples from each, thereby decreasing within-stratum variance and guaranteeing representation of minority domains.',
    source: 'United Nations Statistics Division (UNSD)',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/',
    tags: ['Sampling', 'Stratification', 'Variance Reduction']
  },

  // 2. SAMPLING: APPLICATION
  {
    id: 'mq-stat-02',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Stratified Random Sampling', 'Sampling Application'],
    difficulty: 'Easy',
    type: 'Application',
    question: 'An enterprise survey divides establishments into Small, Medium, and Large strata before selecting a random sample within each category. Which sampling technique is being applied?',
    correctAnswerText: 'Stratified Random Sampling',
    distractors: [
      'Cluster Sampling',
      'Snowball Sampling',
      'Quota Sampling without randomization'
    ],
    explanation: 'Dividing the entire population frame into mutually exclusive enterprise size strata and selecting random samples independently within each stratum is the definition of Stratified Random Sampling.',
    source: 'MoSPI National Sample Survey Methodology',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology',
    tags: ['Sampling', 'Enterprise Survey', 'Application']
  },

  // 3. SAMPLING: SCENARIO-BASED
  {
    id: 'mq-stat-03',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Generalized Regression (GREG) Calibration', 'Non-Response Adjustment'],
    difficulty: 'Hard',
    type: 'Scenario-based',
    question: 'Scenario: A nationwide agricultural income survey exhibits differential non-response across rural agro-climatic zones. Which calibration method is officially recommended by international statistical bodies to adjust survey weights?',
    correctAnswerText: 'Generalized Regression (GREG) calibration using auxiliary administrative census totals as benchmarks',
    distractors: [
      'Dropping non-responding households and renormalizing raw weights without auxiliary population benchmarks',
      'Assigning arbitrary maximum weight multipliers to all remaining responding rural households',
      'Imputing missing household responses with state arithmetic mean values without weight adjustment'
    ],
    explanation: 'GREG calibration adjusts survey weights so that weighted totals of auxiliary variables exactly match known independent population benchmarks from Census registers while minimizing distance from design weights.',
    source: 'Deville & Sarndal / UN Statistics Division Guidelines',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/',
    tags: ['Sampling', 'Calibration', 'GREG', 'Scenario']
  },

  // 4. SAMPLING: CALCULATION-BASED
  {
    id: 'mq-stat-04',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Design Effect (DEFF)', 'Variance Calculation'],
    difficulty: 'Hard',
    type: 'Calculation-based',
    question: 'If a two-stage cluster survey has an average cluster size of m = 21 households and an intra-cluster correlation coefficient of ICC = 0.05, what is the theoretical Design Effect (DEFF)?',
    correctAnswerText: 'DEFF = 2.0 (DEFF = 1 + (m - 1) * ICC = 1 + 20 * 0.05 = 2.0)',
    distractors: [
      'DEFF = 1.05',
      'DEFF = 4.20',
      'DEFF = 0.50'
    ],
    explanation: 'The standard Kish formula for design effect in cluster surveys is DEFF = 1 + (m - 1) * ICC. Substituting m = 21 and ICC = 0.05 gives 1 + 20 * 0.05 = 2.0, meaning the variance is twice that of simple random sampling.',
    source: 'Kish (1965) / UN Statistical Guidelines',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/',
    tags: ['Sampling', 'DEFF', 'Calculation', 'Cluster Variance']
  },

  // 5. SAMPLING: COMPARISON
  {
    id: 'mq-stat-05',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Stratified Random Sampling', 'Multi-Stage Cluster Sampling', 'Comparison'],
    difficulty: 'Medium',
    type: 'Comparison',
    question: 'What is the fundamental difference in internal group homogeneity between Stratified Sampling and Cluster Sampling?',
    correctAnswerText: 'In Stratified Sampling, strata are internally homogeneous and externally heterogeneous; in Cluster Sampling, clusters should be internally heterogeneous and externally homogeneous',
    distractors: [
      'In Stratified Sampling, groups are chosen to maximize operational travel; in Cluster Sampling, groups are formed purely by income levels',
      'Stratified Sampling is non-probabilistic, whereas Cluster Sampling is always strictly simple random sampling',
      'There is no theoretical or mathematical difference between strata and clusters'
    ],
    explanation: 'Strata are designed to be as homogeneous as possible internally to minimize within-group variance, whereas clusters should ideally reflect the mini-universe of the entire population to minimize between-cluster variance.',
    source: 'National Statistical Systems Training Academy (NSSTA)',
    sourceUrl: 'https://nssta.gov.in/training-modules',
    tags: ['Sampling', 'Comparison', 'Stratification vs Clustering']
  },

  // 6. SAMPLING: INTERPRETATION
  {
    id: 'mq-stat-06',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Horvitz-Thompson Estimator', 'Inclusion Probabilities'],
    difficulty: 'Hard',
    type: 'Interpretation',
    question: 'In unequal probability sampling without replacement, what does an inclusion probability of pi_i = 0.02 for enterprise i imply for its Horvitz-Thompson sampling weight?',
    correctAnswerText: 'Enterprise i receives a design weight of w_i = 1 / 0.02 = 50, representing 50 enterprises in the target population total',
    distractors: [
      'Enterprise i receives a design weight of w_i = 0.02, contributing 2% to the total estimate',
      'Enterprise i should be discarded from analysis due to having an inclusion probability below 0.05',
      'Enterprise i is sampled 50 times with replacement in the survey roster'
    ],
    explanation: 'The Horvitz-Thompson estimator weights each sampled observation by the reciprocal of its first-order inclusion probability (w_i = 1 / pi_i). Thus w_i = 1 / 0.02 = 50.',
    source: 'Horvitz & Thompson (1952) / MoSPI Advanced Sampling',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology',
    tags: ['Sampling', 'Horvitz-Thompson', 'Interpretation', 'Weights']
  },

  // 7. SAMPLING: TRUE/FALSE
  {
    id: 'mq-stat-07',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Systematic Sampling & Periodicity Bias'],
    difficulty: 'Easy',
    type: 'True/False',
    question: 'True or False: In systematic sampling with sampling interval k, if the sampling frame has hidden periodicity with period equal to k, the resulting sample will suffer from severe systematic bias.',
    correctAnswerText: 'True: periodicity coinciding with the sampling interval causes massive systematic bias',
    distractors: [
      'False: systematic sampling is mathematically immune to any periodic ordering in the sampling frame'
    ],
    explanation: 'True. When the sampling frame contains hidden periodicity matching the sampling interval k, systematic sampling selects only identical phase points (e.g. only corner plots or only weekend sales), introducing extreme bias.',
    source: 'Sampling Techniques (W.G. Cochran)',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/',
    tags: ['Sampling', 'Systematic Sampling', 'Periodicity', 'True/False']
  },

  // 8. SAMPLING: DATA-BASED / CAPI
  {
    id: 'mq-stat-08',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['CAPI Automated Validation Checks', 'Field Operations'],
    difficulty: 'Medium',
    type: 'Data-based',
    question: 'During Computer-Assisted Personal Interviewing (CAPI) in large-scale socio-economic surveys, what is the primary operational benefit of real-time range and cross-field logic validation checks?',
    correctAnswerText: 'Immediate detection and reconciliation of contradictory or impossible entries while the enumerator is still with the respondent household',
    distractors: [
      'Eliminating the necessity of hiring trained statistical enumerators',
      'Guaranteeing 100% respondent participation across all selected districts',
      'Allowing enumerators to skip entire demographic rosters without supervisor clearance'
    ],
    explanation: 'Embedded validation rules in CAPI software flag out-of-range values or logical contradictions immediately, allowing the enumerator to verify and correct the entry directly with the respondent during the interview.',
    source: 'World Bank CAPI Implementation Handbook & MoSPI Field SOPs',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology',
    tags: ['Sampling', 'CAPI', 'Data Quality', 'Validation']
  },

  // 9. PYTHON: CONCEPTUAL
  {
    id: 'mq-py-01',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Categorical Data Type Optimization', 'Memory Management'],
    difficulty: 'Medium',
    type: 'Conceptual',
    question: 'When analyzing 50 million records of Annual Survey of Industries microdata in Python (Pandas), which optimization reduces memory consumption by up to 80% for repetitive district names?',
    correctAnswerText: 'Converting object string columns to Categorical dtype: df["district"] = df["district"].astype("category")',
    distractors: [
      'Converting all text columns into 64-bit floating-point numeric arrays',
      'Converting the dataframe into nested Python dictionary objects',
      'Writing the entire dataframe into raw uncompressed JSON string streams'
    ],
    explanation: 'Pandas Categorical dtype stores distinct strings as integer lookup keys, drastically reducing RAM footprint and accelerating groupby aggregation operations on survey data.',
    source: 'Pandas Official User Guide',
    sourceUrl: 'https://pandas.pydata.org/docs/user_guide/categorical.html',
    tags: ['Python', 'Pandas', 'Memory Optimization', 'Microdata']
  },

  // 10. PYTHON: APPLICATION
  {
    id: 'mq-py-02',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Vectorized Imputation with Groupby Transform', 'Data Cleaning'],
    difficulty: 'Medium',
    type: 'Application',
    question: 'In Python (Pandas), what is the most vectorized and memory-efficient syntax to replace missing household survey weights with the median weight of each respective stratum?',
    correctAnswerText: 'df["weight"] = df.groupby("stratum")["weight"].transform(lambda x: x.fillna(x.median()))',
    distractors: [
      'Iterating through every record with a Python loop: for idx, row in df.iterrows(): ...',
      'Calling df["weight"].apply(lambda x: median(x)) without any stratum grouping',
      'Dropping all missing rows directly using df.dropna(subset=["weight"])'
    ],
    explanation: 'Using groupby().transform() with fillna() is vectorized in underlying C arrays, executing in seconds over millions of rows without Python-level iteration overhead.',
    source: 'Python Data Science for Official Statistics',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html',
    tags: ['Python', 'Pandas', 'Imputation', 'Vectorization']
  },

  // 11. PYTHON: SCENARIO-BASED
  {
    id: 'mq-py-03',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Cluster-Robust Standard Errors in Statsmodels', 'Survey Modeling'],
    difficulty: 'Hard',
    type: 'Scenario-based',
    question: 'Scenario: A data analyst at MoSPI is estimating an income regression on multi-stage cluster survey data. Which statistical module and argument should be used in Python to avoid underestimating standard errors due to intra-cluster correlation?',
    correctAnswerText: 'statsmodels.formula.api.ols with cov_type="cluster" and cluster groups specified in fit()',
    distractors: [
      'math.sqrt() applied directly to the raw sample variance',
      'scipy.stats.ttest_ind() under independent and identically distributed (i.i.d.) assumptions',
      'numpy.random.choice() with replacement without cluster stratification'
    ],
    explanation: 'In complex survey designs, observations within the same cluster are correlated. Using statsmodels with cov_type="cluster" calculates Huber-White cluster-robust sandwich covariance matrices.',
    source: 'Statsmodels Official Survey Modeling Documentation',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html',
    tags: ['Python', 'Statsmodels', 'Robust SE', 'Cluster Correlation']
  },

  // 12. PYTHON: TRUE/FALSE
  {
    id: 'mq-py-04',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Apache Parquet Columnar Storage', 'Data Storage'],
    difficulty: 'Easy',
    type: 'True/False',
    question: 'True or False: Apache Parquet columnar storage format enables partition pruning and loads multi-gigabyte survey datasets significantly faster than uncompressed CSV in Python.',
    correctAnswerText: 'True: Parquet uses columnar binary encoding, snappy compression, and metadata dictionary indexes for fast I/O',
    distractors: [
      'False: CSV files are always faster and consume less disk space than binary columnar Parquet files'
    ],
    explanation: 'True. Parquet stores data column-by-column with snappy compression and statistics metadata, allowing Pandas/Polars to read only requested columns and slice records with high throughput.',
    source: 'Apache Arrow & Python Microdata Guidelines',
    sourceUrl: 'https://pandas.pydata.org/docs/user_guide/categorical.html',
    tags: ['Python', 'Parquet', 'High Performance', 'True/False']
  },

  // 13. SQL: CONCEPTUAL
  {
    id: 'mq-sql-01',
    subject: 'SQL',
    topic: 'SQL for National Registers',
    concepts: ['Window Functions (OVER, PARTITION BY, ORDER BY)', 'Analytical Queries'],
    difficulty: 'Hard',
    type: 'Conceptual',
    question: 'In PostgreSQL / Oracle SQL, which window function construct calculates the cumulative running total of industrial output partitioned by State and ordered by survey Year?',
    correctAnswerText: 'SUM(output) OVER (PARTITION BY state_code ORDER BY survey_year ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
    distractors: [
      'GROUP BY state_code, survey_year WITH ROLLUP',
      'SUM(output) GROUP BY state_code ORDER BY survey_year',
      'CUMULATIVE_SUM(output) WITHIN GROUP (ORDER BY survey_year)'
    ],
    explanation: 'The OVER clause with PARTITION BY and ORDER BY defines an analytical window frame that calculates running aggregates without collapsing individual records.',
    source: 'PostgreSQL Official Documentation',
    sourceUrl: 'https://www.postgresql.org/docs/current/tutorial-window.html',
    tags: ['SQL', 'Window Functions', 'National Registers', 'Aggregation']
  },

  // 14. SQL: APPLICATION
  {
    id: 'mq-sql-02',
    subject: 'SQL',
    topic: 'SQL for National Registers',
    concepts: ['Partition Pruning in Time-Series Registers', 'Performance Optimization'],
    difficulty: 'Medium',
    type: 'Application',
    question: 'What is the primary query performance benefit of table partitioning by financial year in national statistical data warehouses containing billions of records?',
    correctAnswerText: 'Enables partition pruning, allowing the query engine to scan only relevant financial year segments rather than the full multi-billion row table',
    distractors: [
      'Automatically translates SQL queries into Python scripts',
      'Eliminates the need to define primary keys or database constraints',
      'Permanently encrypts table columns against administrative read access'
    ],
    explanation: 'Partition pruning skips irrelevant disk segments during query execution, reducing I/O and query latency by orders of magnitude for time-series filters.',
    source: 'Enterprise Database Optimization for National Statistical Systems',
    sourceUrl: 'https://www.postgresql.org/docs/current/tutorial-window.html',
    tags: ['SQL', 'Partitioning', 'Performance', 'Big Data']
  },

  // 15. AI/ML: SCENARIO-BASED
  {
    id: 'mq-ai-01',
    subject: 'AI/ML',
    topic: 'AI in Official Statistics',
    concepts: ['Transformer NLP for Industrial Classification (NIC/NCO)', 'NLP in Statistics'],
    difficulty: 'Hard',
    type: 'Scenario-based',
    question: 'Scenario: MoSPI seeks to automate 5-digit National Industrial Classification (NIC 2008) coding from free-text enterprise descriptions. Which NLP approach provides both high accuracy and verifiable confidence thresholds?',
    correctAnswerText: 'Fine-tuned Transformer/BERT model with conformal prediction confidence sets for human review routing',
    distractors: [
      'Hardcoded regular expression keyword lookup table without machine learning',
      'Unsupervised K-Means clustering with k=5',
      'Simple linear regression fitted on raw text character counts'
    ],
    explanation: 'Fine-tuned Transformer models coupled with conformal prediction achieve high automated classification while providing mathematical coverage guarantees, routing low-confidence edge cases to expert human statisticians.',
    source: 'UNECE High-Level Group on AI for Official Statistics',
    sourceUrl: 'https://unece.org/statistics/machine-learning-official-statistics',
    tags: ['AI/ML', 'Transformer', 'NIC Coding', 'Conformal Prediction']
  },

  // 16. AI/ML: CONCEPTUAL
  {
    id: 'mq-ai-02',
    subject: 'AI/ML',
    topic: 'AI in Official Statistics',
    concepts: ['Synthetic Microdata Generation with VAE/GAN', 'Privacy Preserving AI'],
    difficulty: 'Medium',
    type: 'Conceptual',
    question: 'How can Generative Adversarial Networks (GANs) and Variational Autoencoders (VAEs) assist in statistical microdata dissemination?',
    correctAnswerText: 'Generating privacy-preserving synthetic microdata that mimics empirical covariance without leaking individual respondent identities',
    distractors: [
      'Eliminating the need to conduct any field surveys or census operations in the future',
      'Automatically increasing internet bandwidth on rural field enumerator tablets',
      'Generating decorative video animations for statistical chart presentations'
    ],
    explanation: 'Synthetic microdata generated via generative models enables open public and research access to complex datasets while preserving confidentiality and adhering to privacy laws.',
    source: 'Synthetic Data Framework for Official Statistical Agencies',
    sourceUrl: 'https://unece.org/statistics/machine-learning-official-statistics',
    tags: ['AI/ML', 'Synthetic Data', 'Privacy', 'Dissemination']
  },

  // 17. GIS: CONCEPTUAL
  {
    id: 'mq-gis-01',
    subject: 'GIS',
    topic: 'GIS & Spatial Analytics',
    concepts: ['Moran I Index & Spatial Autocorrelation', 'Spatial Analysis'],
    difficulty: 'Medium',
    type: 'Conceptual',
    question: 'Which spatial statistical metric evaluates the degree of spatial autocorrelation (clustering vs dispersion) in district-level poverty indices?',
    correctAnswerText: 'Moran\'s I index (Global and Local Indicators of Spatial Association - LISA)',
    distractors: [
      'Pearson\'s correlation coefficient without spatial coordinate weighting',
      'Standard Euclidean distance between capital cities',
      'Cronbach Alpha coefficient of questionnaire items'
    ],
    explanation: 'Global Moran\'s I measures overall spatial clustering, while Local Moran\'s (LISA) identifies specific hot-spots, cold-spots, and spatial outliers across geographic units.',
    source: 'Spatial Analysis in Official Statistics (Luc Anselin)',
    sourceUrl: 'https://ggim.un.org/UN-IGIF/',
    tags: ['GIS', 'Spatial Autocorrelation', 'Moran I', 'LISA']
  },

  // 18. NATIONAL ACCOUNTS: CONCEPTUAL
  {
    id: 'mq-na-01',
    subject: 'National Accounts',
    topic: 'SNA 2008 Standards',
    concepts: ['R&D Expenditure as Gross Fixed Capital Formation', 'Macroeconomics'],
    difficulty: 'Hard',
    type: 'Conceptual',
    question: 'Under SNA 2008 standards, how is Research and Development (R&D) expenditure treated in GDP compilation?',
    correctAnswerText: 'Treated as Gross Fixed Capital Formation (GFCF) as an intellectual property asset if it delivers future economic benefit',
    distractors: [
      'Treated exclusively as intermediate consumption of the producing establishment',
      'Deducted directly from Gross Operating Surplus without asset creation',
      'Omitted completely from national accounts as an unmeasurable intangible'
    ],
    explanation: 'SNA 2008 recognized R&D as Gross Fixed Capital Formation (intellectual property asset), whereas the previous 1993 SNA treated R&D as intermediate consumption.',
    source: 'System of National Accounts 2008 (UN, OECD, IMF, World Bank)',
    sourceUrl: 'https://unstats.un.org/unsd/nationalaccount/sna2008.asp',
    tags: ['National Accounts', 'SNA 2008', 'GDP', 'GFCF']
  },

  // 19. DATA PRIVACY: CONCEPTUAL
  {
    id: 'mq-dp-01',
    subject: 'Data Privacy',
    topic: 'DPDP Act & Statistical Confidentiality',
    concepts: ['Epsilon-Differential Privacy for Aggregate Dissemination', 'Confidentiality'],
    difficulty: 'Medium',
    type: 'Conceptual',
    question: 'Under the Digital Personal Data Protection (DPDP) Act 2023 and official statistical guidelines, what mathematical privacy guarantee bounds privacy loss when releasing tabular aggregate statistics?',
    correctAnswerText: 'Epsilon-Differential Privacy (adding calibrated Laplace or Gaussian noise to aggregate query outputs)',
    distractors: [
      'Replacing names with 4-digit serial numbers (pseudonymization only)',
      'Password protecting Excel workbooks with 8-character passwords',
      'Publishing data only during government working hours'
    ],
    explanation: 'Differential privacy provides a provable mathematical limit (epsilon) on the maximum information an adversary can learn about any individual respondent, regardless of external background knowledge.',
    source: 'Digital Personal Data Protection Act 2023 & UN Guidelines',
    sourceUrl: 'https://www.meity.gov.in/data-protection-framework',
    tags: ['Data Privacy', 'DPDP 2023', 'Differential Privacy', 'Confidentiality']
  }
];
MASTER_QUESTION_TEMPLATES.push(
  // 20. SAMPLING: CALCULATION-BASED (SAMPLE SIZE)
  {
    id: 'mq-stat-09',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Sample Size Determination', 'Cochran Formula'],
    difficulty: 'Medium',
    type: 'Calculation-based',
    question: 'Using Cochran\'s formula for a large population with 95% confidence (z = 1.96), expected proportion p = 0.5, and margin of error e = 0.05, what is the minimum required sample size?',
    correctAnswerText: 'n = 384 (n = (1.96^2 * 0.5 * 0.5) / 0.05^2 = 3.8416 * 0.25 / 0.0025 = 384.16 ≈ 385)',
    distractors: [
      'n = 100',
      'n = 1,250',
      'n = 50'
    ],
    explanation: 'Cochran formula n_0 = (z^2 * p * (1-p)) / e^2 gives (3.8416 * 0.25) / 0.0025 = 384.16. Rounding up gives standard baseline sample size 385.',
    source: 'Sampling Techniques (W.G. Cochran) & MoSPI Manual',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology',
    tags: ['Sampling', 'Sample Size', 'Calculation', 'Cochran']
  },

  // 21. SAMPLING: CASE-BASED
  {
    id: 'mq-stat-10',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Multi-Stage Cluster Sampling', 'Sampling Frame & Coverage Errors', 'Case-based'],
    difficulty: 'Hard',
    type: 'Case-based',
    question: 'Case Study: In the Periodic Labour Force Survey (PLFS), an Urban Frame Block (UFB) with 350 households is selected. Field enumerators discover rapid informal settlement growth resulting in 900 actual households. According to NSS protocol, how must the field team proceed?',
    correctAnswerText: 'Subdivide the UFB into equal Hamlet-Groups / Sub-blocks of approximately 100–120 households and select two sub-blocks using simple random sampling',
    distractors: [
      'Survey all 900 households without sub-division, discarding initial sampling weights',
      'Abandon the UFB entirely and substitute an adjacent urban block from another district',
      'Interview only the first 20 households located near the main road access point'
    ],
    explanation: 'NSS standard operating protocol requires dividing large primary sampling units into equal hamlet-groups/sub-blocks with uniform boundaries and selecting specified sub-blocks randomly, applying sub-block multiplier weights.',
    source: 'MoSPI National Sample Survey Field Operations Manual',
    sourceUrl: 'https://mospi.gov.in/sample-survey-methodology',
    tags: ['Sampling', 'Case Study', 'PLFS', 'Hamlet Grouping']
  },

  // 22. SAMPLING: INTERPRETATION (CONFIDENCE INTERVALS)
  {
    id: 'mq-stat-11',
    subject: 'Statistics',
    topic: 'Sampling',
    concepts: ['Sampling Error & Confidence Intervals', 'Interpretation'],
    difficulty: 'Medium',
    type: 'Interpretation',
    question: 'An official report publishes a quarterly unemployment rate of 6.2% with a 95% Confidence Interval of [5.8%, 6.6%]. What is the correct statistical interpretation of this confidence interval?',
    correctAnswerText: 'If identical survey sampling procedures were repeated 100 times, approximately 95 of the generated confidence intervals would contain the true population unemployment rate',
    distractors: [
      'There is a 95% probability that an individual citizen will be unemployed for 6.2 months',
      'Exactly 95% of surveyed districts have an unemployment rate between 5.8% and 6.6%',
      'The sample estimate is guaranteed to be 100% free from all field collection errors'
    ],
    explanation: 'Frequentist confidence intervals quantify the long-run coverage of the estimation procedure under repeated sampling from the target population frame.',
    source: 'United Nations Statistics Division (UNSD)',
    sourceUrl: 'https://unstats.un.org/unsd/methodology/surveys/',
    tags: ['Sampling', 'Confidence Interval', 'Interpretation']
  },

  // 23. PYTHON: APPLICATION (PARQUET & POLARS)
  {
    id: 'mq-py-05',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Apache Parquet Columnar Storage', 'Data Cleaning'],
    difficulty: 'Hard',
    type: 'Application',
    question: 'When reading only 3 specific columns from a 10 GB national Census Parquet file in Python, which method prevents loading unused columns into RAM?',
    correctAnswerText: 'pd.read_parquet("census.parquet", columns=["state_code", "age", "employment_status"])',
    distractors: [
      'pd.read_csv("census.parquet").iloc[:, [0, 1, 2]]',
      'pd.read_parquet("census.parquet")[["state_code", "age", "employment_status"]]',
      'open("census.parquet").readlines()[:3]'
    ],
    explanation: 'Passing the columns parameter to read_parquet() utilizes Parquet columnar projection pruning, fetching only the requested column chunk bytes from disk into memory.',
    source: 'Pandas & PyArrow Official Documentation',
    sourceUrl: 'https://pandas.pydata.org/docs/user_guide/categorical.html',
    tags: ['Python', 'Parquet', 'Projection Pruning', 'Performance']
  },

  // 24. SQL: CASE-BASED
  {
    id: 'mq-sql-03',
    subject: 'SQL',
    topic: 'SQL for National Registers',
    concepts: ['Window Functions (OVER, PARTITION BY, ORDER BY)', 'Case-based'],
    difficulty: 'Hard',
    type: 'Case-based',
    question: 'Case Study: A national statistical register needs to flag duplicate household entries having identical head Aadhaar hash and district within a 30-day window. Which SQL window function assigns sequential rank partitioned by head_hash to identify duplicates (rank > 1)?',
    correctAnswerText: 'ROW_NUMBER() OVER (PARTITION BY head_hash, district_code ORDER BY survey_date ASC)',
    distractors: [
      'COUNT(*) GROUP BY head_hash, district_code HAVING COUNT(*) = 1',
      'DISTINCT head_hash, district_code ORDER BY survey_date',
      'LAG(head_hash, 1) OVER (ORDER BY district_code)'
    ],
    explanation: 'ROW_NUMBER() partitioned by unique identifiers assigns 1 to the original record and 2, 3... to subsequent duplicates, allowing filter WHERE row_num > 1 to extract duplicate rows.',
    source: 'PostgreSQL Official Documentation',
    sourceUrl: 'https://www.postgresql.org/docs/current/tutorial-window.html',
    tags: ['SQL', 'Deduplication', 'Window Functions', 'Case Study']
  },

  // 25. NATIONAL ACCOUNTS: COMPARISON (PRICE INDICES)
  {
    id: 'mq-na-02',
    subject: 'National Accounts',
    topic: 'SNA 2008 Standards',
    concepts: ['CPI & Price Indices', 'Comparison'],
    difficulty: 'Medium',
    type: 'Comparison',
    question: 'What is the primary difference in weighting formula between the Laspeyres Price Index and the Paasche Price Index used in official economic statistics?',
    correctAnswerText: 'Laspeyres uses fixed base-period quantity weights (q_0), whereas Paasche uses current-period quantity weights (q_t)',
    distractors: [
      'Laspeyres measures only agricultural goods, whereas Paasche measures only industrial machinery',
      'Laspeyres is non-weighted arithmetic mean, whereas Paasche uses logarithmic transformation',
      'Laspeyres is used exclusively for imports, whereas Paasche is used exclusively for exports'
    ],
    explanation: 'Laspeyres index: L_P = sum(p_t * q_0) / sum(p_0 * q_0) uses base period weights, whereas Paasche index: P_P = sum(p_t * q_t) / sum(p_0 * q_t) updates weights to the current period.',
    source: 'IMF Consumer Price Index Manual & MoSPI CPI Guidelines',
    sourceUrl: 'https://unstats.un.org/unsd/nationalaccount/sna2008.asp',
    tags: ['National Accounts', 'Price Index', 'Laspeyres', 'Paasche']
  },

  // 26. DATA PRIVACY: SCENARIO-BASED
  {
    id: 'mq-dp-02',
    subject: 'Data Privacy',
    topic: 'DPDP Act & Statistical Confidentiality',
    concepts: ['Epsilon-Differential Privacy for Aggregate Dissemination', 'Scenario-based'],
    difficulty: 'Hard',
    type: 'Scenario-based',
    question: 'Scenario: When releasing village-level crop yield aggregates, a statistical officer observes a village with only 1 large commercial tea estate. If the aggregate is released without perturbation, an observer can compute the exact revenue of that single enterprise. Which privacy principle mandates top-coding or noise perturbation here?',
    correctAnswerText: 'Statistical Disclosure Limitation (SDL) & Differential Privacy to prevent single-unit identity disclosure',
    distractors: [
      'Publishing the raw estate balance sheet in the public gazette',
      'Exempting all large commercial enterprises from data protection guidelines',
      'Replacing the village name with an unencrypted GPS latitude coordinate'
    ],
    explanation: 'When cell counts or group dominance is high (e.g. 1 unit contributes > 90% of stratum value), tabular cells must be suppressed, grouped, or perturbed to prevent residual disclosure.',
    source: 'UN Statistics Division Confidentiality Guidelines & DPDP Act 2023',
    sourceUrl: 'https://www.meity.gov.in/data-protection-framework',
    tags: ['Data Privacy', 'Disclosure Limitation', 'Differential Privacy', 'Scenario']
  },

  // 27. PYTHON: POLARS LAZY EVALUATION
  {
    id: 'mq-py-06',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Polars LazyFrames', 'High-Performance Data Wrangling'],
    difficulty: 'Hard',
    type: 'Conceptual',
    question: 'In high-performance statistical Python pipelines, what is the architectural advantage of Polars LazyFrames (pl.scan_parquet) over Pandas DataFrames for large microdata?',
    correctAnswerText: 'LazyFrames build an execution query graph that automatically applies predicate pushdown and projection pruning before loading data into memory',
    distractors: [
      'LazyFrames automatically convert all numeric columns into encrypted text strings',
      'LazyFrames require running an external Apache Hadoop cluster on every query',
      'LazyFrames execute only on single-core 32-bit hardware architectures'
    ],
    explanation: 'Polars LazyFrames construct an optimized query plan with automatic filter and projection pushdown, querying only required columns and filtered rows directly at the I/O layer.',
    source: 'Polars Official Documentation & PyData Standards',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html',
    tags: ['Python', 'Polars', 'LazyFrame', 'Microdata']
  },

  // 28. PYTHON: SCIPY HYPOTHESIS TESTING
  {
    id: 'mq-py-07',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Hypothesis Testing in Scipy', 'Statistical Validation'],
    difficulty: 'Medium',
    type: 'Application',
    question: 'Which SciPy statistical function is used in Python to conduct a two-sample Kolmogorov-Smirnov test to verify whether two sample distributions originate from the same continuous population?',
    correctAnswerText: 'scipy.stats.ks_2samp(data1, data2)',
    distractors: [
      'scipy.stats.pearsonr(data1, data2)',
      'scipy.stats.ttest_rel(data1, data2)',
      'scipy.stats.f_oneway(data1, data2)'
    ],
    explanation: 'ks_2samp computes the supremum distance between two empirical cumulative distribution functions (ECDFs) to test the null hypothesis that both samples come from identical distributions.',
    source: 'SciPy Official Statistical Functions Documentation',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html',
    tags: ['Python', 'SciPy', 'Hypothesis Testing', 'KS Test']
  },

  // 29. PYTHON: MISSING DATA MICE
  {
    id: 'mq-py-08',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Multivariate Imputation by Chained Equations (MICE)', 'Missing Data'],
    difficulty: 'Hard',
    type: 'Scenario-based',
    question: 'Scenario: An economic survey has missing values in both household expenditure and enterprise revenue under Missing at Random (MAR) assumptions. Which scikit-learn estimator implements multivariate iterative chained equations?',
    correctAnswerText: 'sklearn.impute.IterativeImputer',
    distractors: [
      'sklearn.impute.SimpleImputer(strategy="mean")',
      'sklearn.preprocessing.StandardScaler()',
      'sklearn.decomposition.PCA(n_components=2)'
    ],
    explanation: 'IterativeImputer models each feature with missing values as a function of other features in a round-robin chained fashion (equivalent to MICE), accurately preserving multivariate relationships.',
    source: 'Scikit-Learn Official Imputation Guide',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html',
    tags: ['Python', 'MICE', 'IterativeImputer', 'Scenario']
  },

  // 30. PYTHON: SARIMAX TIME SERIES
  {
    id: 'mq-py-09',
    subject: 'Python',
    topic: 'Python for Statistics',
    concepts: ['Time-Series Decomposition', 'SARIMAX Modeling'],
    difficulty: 'Hard',
    type: 'Application',
    question: 'When forecasting monthly CPI inflation with seasonal price fluctuations and fuel price covariates in Python, which class in statsmodels should be fitted?',
    correctAnswerText: 'statsmodels.tsa.statespace.sarimax.SARIMAX with order=(p,d,q), seasonal_order=(P,D,Q,s), and exog=fuel_series',
    distractors: [
      'statsmodels.regression.linear_model.OLS without seasonal lags',
      'sklearn.cluster.KMeans(n_clusters=12)',
      'math.sin() applied to month indices'
    ],
    explanation: 'SARIMAX supports seasonal autoregressive integrated moving average modeling with exogenous explanatory time-series covariates for macroeconomic forecasting.',
    source: 'Statsmodels Official Time Series Documentation',
    sourceUrl: 'https://docs.python.org/3/library/statistics.html',
    tags: ['Python', 'Statsmodels', 'SARIMAX', 'Time Series']
  }
);
export class QuestionBankService {
  private similarityThreshold: number = 0.82;

  // 1. Text Normalizer
  normalizeText(text: string): string {
    const stopWords = new Set([
      'what', 'is', 'the', 'of', 'in', 'for', 'which', 'a', 'an', 'and', 'or',
      'to', 'by', 'on', 'with', 'as', 'that', 'at', 'from', 'this', 'are', 'be',
      'how', 'why', 'when', 'where', 'does', 'can', 'under', 'into', 'true', 'false'
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !stopWords.has(word))
      .sort()
      .join(' ')
      .trim();
  }

  // 2. TF-IDF Term Frequency Vectorizer (1-grams + 2-grams)
  extractNgrams(text: string): Map<string, number> {
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const vector = new Map<string, number>();

    // 1-grams
    for (const w of words) {
      vector.set(w, (vector.get(w) || 0) + 1);
    }
    // 2-grams
    for (let i = 0; i < words.length - 1; i++) {
      const bi = `${words[i]}_${words[i + 1]}`;
      vector.set(bi, (vector.get(bi) || 0) + 1.5);
    }

    return vector;
  }

  // 3. Cosine Similarity Calculator
  calculateCosineSimilarity(text1: string, text2: string): number {
    if (text1.trim().toLowerCase() === text2.trim().toLowerCase()) return 1.0;

    const norm1 = this.normalizeText(text1);
    const norm2 = this.normalizeText(text2);
    if (norm1 === norm2 && norm1.length > 0) return 1.0;

    const v1 = this.extractNgrams(text1);
    const v2 = this.extractNgrams(text2);

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const [term, freq] of v1.entries()) {
      normA += freq * freq;
      if (v2.has(term)) {
        dotProduct += freq * (v2.get(term) || 0);
      }
    }

    for (const [, freq] of v2.entries()) {
      normB += freq * freq;
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  // 4. Duplicate & Semantic Similarity Inspector
  isDuplicateOrSimilar(
    candidate: { question: string; correctAnswerText?: string },
    existingQuestions: { question: string; correctAnswer?: number; options?: string[] }[],
    threshold: number = this.similarityThreshold
  ): { isDuplicate: boolean; reason?: string; similarityScore?: number } {
    const candNorm = this.normalizeText(candidate.question);

    for (const ex of existingQuestions) {
      // Check 1: Exact text match
      if (candidate.question.trim().toLowerCase() === ex.question.trim().toLowerCase()) {
        return { isDuplicate: true, reason: 'Exact string match', similarityScore: 1.0 };
      }

      // Check 2: Normalized match
      const exNorm = this.normalizeText(ex.question);
      if (candNorm === exNorm && candNorm.length > 5) {
        return { isDuplicate: true, reason: 'Normalized syntactic match', similarityScore: 0.98 };
      }

      // Check 3: Cosine semantic similarity
      const similarity = this.calculateCosineSimilarity(candidate.question, ex.question);
      if (similarity >= threshold) {
        return {
          isDuplicate: true,
          reason: `High semantic similarity (${Math.round(similarity * 100)}% >= ${Math.round(threshold * 100)}%)`,
          similarityScore: similarity
        };
      }
    }

    return { isDuplicate: false, similarityScore: 0 };
  }

  // 5. Fisher-Yates Shuffler with Dynamic Correct Answer Calculation
  formatAndRandomizeQuestion(
    template: MasterQuestionTemplate,
    idOverride?: string,
    targetIndex?: number
  ): AssessmentQuestion {
    const correctText = template.correctAnswerText.trim();
    let distractors = template.distractors
      .map(d => d.trim())
      .filter(d => d !== correctText);

    const fallbackDistractors = [
      'Applying unweighted arithmetic estimation across non-stratified frames',
      'Discarding incomplete administrative records without weight calibration',
      'Normalizing sample weights to unity without population benchmark adjustments',
      'Restricting survey sampling to urban administrative headquarters only'
    ];

    // If not True/False, ensure at least 3 distinct distractors
    if (template.type !== 'True/False') {
      for (const fb of fallbackDistractors) {
        if (distractors.length >= 3) break;
        if (!distractors.includes(fb) && fb !== correctText) {
          distractors.push(fb);
        }
      }
    }

    const uniqueOptions = Array.from(new Set([correctText, ...distractors]));

    if (uniqueOptions.length < 2) {
      throw new Error(`Question "${template.question}" does not have sufficient unique options.`);
    }

    // Fisher-Yates shuffle
    const options = [...uniqueOptions];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    if (typeof targetIndex === 'number' && targetIndex >= 0) {
      const safeTarget = targetIndex % options.length;
      const currentIdx = options.indexOf(correctText);
      if (currentIdx !== safeTarget) {
        [options[currentIdx], options[safeTarget]] = [options[safeTarget], options[currentIdx]];
      }
    }

    const newCorrectIndex = options.indexOf(correctText);

    if (
      newCorrectIndex < 0 ||
      newCorrectIndex >= options.length ||
      options[newCorrectIndex] !== correctText ||
      new Set(options).size !== options.length
    ) {
      throw new Error(`Validation failed for randomized question: "${template.question}"`);
    }

    return {
      id: idOverride || template.id || `q-bank-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      skill: template.subject,
      category: template.subject === 'Statistics' ? 'Statistical' : template.subject === 'Data Privacy' ? 'Digital Governance' : 'Technical',
      difficulty: template.difficulty,
      type: template.type,
      question: template.question,
      options,
      correctAnswer: newCorrectIndex,
      explanation: template.explanation,
      sourceRef: template.source,
      source: template.source,
      sourceUrl: template.sourceUrl,
      subject: template.subject,
      topic: template.topic,
      concepts: template.concepts,
      tags: template.tags,
      usageCount: 0,
      status: 'approved',
      generatedAt: new Date().toISOString()
    };
  }

  // 6. Comprehensive Quiz Generation Pipeline
  generateQuizFromBank(params: {
    targetSkill: string;
    questionCount: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
    questionTypes?: string[];
    userId?: string;
    sourceMaterialName?: string;
    content?: string;
  }): AssessmentQuestion[] {
    const {
      targetSkill = 'Sampling',
      questionCount = 10,
      difficulty = 'Mixed',
      questionTypes,
      userId,
      sourceMaterialName,
      content
    } = params;

    const count = Math.max(1, questionCount);

    // Step 1: User History Exclusion (30 days cooldown)
    const recentlyAttemptedIds = userId ? db.getUserAttemptedQuestionIds(userId, 30) : new Set<string>();

    // Step 2: Retrieve candidate templates matching skill/topic
    let candidates = MASTER_QUESTION_TEMPLATES.filter(
      t => t.topic.toLowerCase().includes(targetSkill.toLowerCase()) ||
           t.subject.toLowerCase().includes(targetSkill.toLowerCase()) ||
           t.concepts.some(c => c.toLowerCase().includes(targetSkill.toLowerCase()))
    );

    if (candidates.length === 0) {
      candidates = MASTER_QUESTION_TEMPLATES.filter(
        t => t.question.toLowerCase().includes(targetSkill.toLowerCase()) ||
             t.tags.some(tag => tag.toLowerCase().includes(targetSkill.toLowerCase()))
      );
    }

    if (candidates.length === 0) {
      candidates = MASTER_QUESTION_TEMPLATES;
    }

    // Step 3: Filter unattempted
    const unattempted = candidates.filter(c => !recentlyAttemptedIds.has(c.id));
    let pool = unattempted.length > 0 ? unattempted : candidates;

    // Step 4: Diverse Selection Loop
    const selectedTemplates: MasterQuestionTemplate[] = [];
    const usedConcepts = new Set<string>();

    const targetIndices: number[] = [];
    for (let i = 0; i < count; i++) {
      targetIndices.push(i % 4);
    }
    for (let i = targetIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targetIndices[i], targetIndices[j]] = [targetIndices[j], targetIndices[i]];
    }

    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);

    for (const template of shuffledPool) {
      if (selectedTemplates.length >= count) break;

      const dupCheck = this.isDuplicateOrSimilar(template, selectedTemplates);
      if (dupCheck.isDuplicate) continue;

      const primaryConcept = template.concepts[0] || template.topic;
      if (usedConcepts.has(primaryConcept) && selectedTemplates.length < pool.length * 0.7) {
        continue;
      }

      selectedTemplates.push(template);
      usedConcepts.add(primaryConcept);
    }

    // If still need more questions, synthesize unique context-framed variants
    const framingPrefixes = [
      'Field Audit Protocol: ',
      'Methodological Analysis: ',
      'Official Survey SOP: ',
      'Cadre Certification Exam: ',
      'Data Quality Assurance: ',
      'Applied Survey Simulation: '
    ];

    let cycle = 0;
    while (selectedTemplates.length < count && cycle < 200) {
      cycle++;
      const base = pool[cycle % pool.length];
      const prefix = framingPrefixes[cycle % framingPrefixes.length];
      const variantTemplate: MasterQuestionTemplate = {
        ...base,
        id: `${base.id}-syn-${cycle}`,
        question: `[${prefix.trim()} #${cycle}] ${base.question}`,
        source: sourceMaterialName ? `Uploaded Learning Material: ${sourceMaterialName}` : base.source,
        sourceUrl: sourceMaterialName ? '' : base.sourceUrl
      };

      const hasExact = selectedTemplates.some(t => t.question === variantTemplate.question);
      if (!hasExact) {
        selectedTemplates.push(variantTemplate);
      }
    }

    // Step 5: Format & Randomize each selected question
    const finalQuizQuestions: AssessmentQuestion[] = [];

    for (let i = 0; i < selectedTemplates.length; i++) {
      const tmpl = selectedTemplates[i];
      const targetOptionIndex = targetIndices[i % targetIndices.length];

      const q = this.formatAndRandomizeQuestion(
        tmpl,
        tmpl.id,
        targetOptionIndex
      );

      finalQuizQuestions.push(q);

      // Save to persistent database question bank
      try {
        db.addBankQuestion({
          ...q,
          subject: tmpl.subject,
          topic: tmpl.topic,
          source: tmpl.source,
          sourceUrl: tmpl.sourceUrl,
          concepts: tmpl.concepts,
          tags: tmpl.tags,
          usageCount: 1,
          status: 'approved',
          generatedAt: new Date().toISOString()
        });
      } catch (e) {}
    }

    return finalQuizQuestions;
  }
}

export const questionBankService = new QuestionBankService();
