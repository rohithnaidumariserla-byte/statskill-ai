-- ====================================================================
-- STATSKILL AI - SUPABASE / POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Ministry of Statistics and Programme Implementation (MoSPI)
-- Smart India Hackathon (SIH) Prototype
-- ====================================================================

-- 1. USERS & CADRES
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'official',
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    ministry VARCHAR(255) DEFAULT 'Ministry of Statistics & Programme Implementation (MoSPI)',
    cadre VARCHAR(255),
    state VARCHAR(128) DEFAULT 'National / New Delhi',
    avatar VARCHAR(512),
    courses_completed INT DEFAULT 0,
    courses_in_progress INT DEFAULT 0,
    learning_hours INT DEFAULT 0,
    streak_days INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SKILLS ARCHITECTURE
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(128) NOT NULL,
    description TEXT,
    importance VARCHAR(32) DEFAULT 'High',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER SKILL COMPETENCIES & BENCHMARK GAPS
CREATE TABLE IF NOT EXISTS user_skills (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    skill_id VARCHAR(64) REFERENCES skills(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL,
    competency_score INT NOT NULL CHECK (competency_score BETWEEN 0 AND 100),
    initial_score INT DEFAULT 40,
    competency_level VARCHAR(32) NOT NULL,
    last_assessed DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

-- 4. ROLE COMPETENCY BENCHMARKS
CREATE TABLE IF NOT EXISTS role_benchmarks (
    id VARCHAR(64) PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    cadre VARCHAR(255) NOT NULL,
    target_overall_score INT DEFAULT 75,
    required_skills JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. LEARNING COURSES & MATRIX
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    skill VARCHAR(255) NOT NULL,
    skill_category VARCHAR(128),
    difficulty VARCHAR(32) NOT NULL,
    duration VARCHAR(64) NOT NULL,
    duration_hours INT DEFAULT 8,
    rating NUMERIC(3, 1) DEFAULT 4.8,
    enrolled_count INT DEFAULT 0,
    source VARCHAR(32) DEFAULT 'iGOT',
    description TEXT,
    syllabus JSONB,
    thumbnail VARCHAR(512),
    external_url VARCHAR(512),
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. QUIZZES & ASSESSMENTS
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_skill VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    topic VARCHAR(255),
    difficulty VARCHAR(32) NOT NULL,
    source_material_name VARCHAR(255),
    created_by VARCHAR(255) DEFAULT 'AI Assessment Generator',
    status VARCHAR(32) DEFAULT 'active',
    time_limit_minutes INT DEFAULT 15,
    passing_score_percentage INT DEFAULT 60,
    start_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_at TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(64) DEFAULT 'IST (UTC+05:30)',
    target_cadres JSONB DEFAULT '["All"]'::jsonb,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. QUIZ ATTEMPTS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    quiz_id VARCHAR(64) REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    score_percentage INT NOT NULL,
    passed BOOLEAN NOT NULL,
    skill_before INT,
    skill_after INT,
    improvement INT,
    benchmark_achieved BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. MINI PRACTICE QUESTIONS
CREATE TABLE IF NOT EXISTS practice_questions (
    id VARCHAR(64) PRIMARY KEY,
    skill VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INT NOT NULL,
    explanation TEXT,
    difficulty VARCHAR(32) DEFAULT 'Medium'
);

-- 9. MINI PRACTICE QUIZ RESULTS
CREATE TABLE IF NOT EXISTS practice_results (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    accuracy INT NOT NULL,
    previous_score INT NOT NULL,
    new_score INT NOT NULL,
    improvement INT NOT NULL,
    benchmark_achieved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(32) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INITIAL PRODUCTION SEED DATA (MoSPI CADRE PROTOTYPE)
-- ====================================================================

INSERT INTO users (id, name, email, role, designation, department, ministry, cadre, courses_completed, courses_in_progress, learning_hours, streak_days)
VALUES
('u-admin', 'Dr. Alok Verma', 'admin@mospi.gov.in', 'admin', 'Director (Training & Capacity Building)', 'National Statistical Systems Training Academy (NSSTA)', 'Ministry of Statistics & Programme Implementation', 'Indian Statistical Service (ISS - SAG)', 42, 3, 210, 18),
('u-1', 'Rajesh Sharma', 'rajesh.sharma@mospi.gov.in', 'official', 'Senior Statistical Officer (SSO)', 'Field Operations Division (FOD) - Sample Survey Wing', 'Ministry of Statistics & Programme Implementation', 'Subordinate Statistical Service (SSS)', 6, 2, 48, 14),
('u-2', 'Priya Patel', 'priya.patel@mospi.gov.in', 'official', 'Assistant Director (Statistics)', 'National Accounts Division (NAD)', 'Ministry of Statistics & Programme Implementation', 'Indian Statistical Service (ISS)', 12, 1, 95, 21),
('u-3', 'Amit Kumar', 'amit.kumar@mospi.gov.in', 'official', 'Junior Statistical Officer (JSO)', 'Data Processing Division (DPD)', 'Ministry of Statistics & Programme Implementation', 'Subordinate Statistical Service (SSS)', 4, 3, 32, 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO role_benchmarks (id, role_name, cadre, target_overall_score, required_skills)
VALUES
('rb-1', 'Statistical Officer', 'Subordinate Statistical Service (SSS)', 75, '[
  {"skillId": "sk-2", "skillName": "Sampling", "requiredScore": 80, "level": "Advanced"},
  {"skillId": "sk-3", "skillName": "National Accounts", "requiredScore": 80, "level": "Advanced"},
  {"skillId": "sk-11", "skillName": "Python", "requiredScore": 75, "level": "Proficient"},
  {"skillId": "sk-13", "skillName": "SQL", "requiredScore": 75, "level": "Proficient"},
  {"skillId": "sk-18", "skillName": "Data Visualization", "requiredScore": 70, "level": "Intermediate"},
  {"skillId": "sk-19", "skillName": "AI/ML", "requiredScore": 65, "level": "Intermediate"},
  {"skillId": "sk-20", "skillName": "Cloud Computing", "requiredScore": 55, "level": "Developing"},
  {"skillId": "sk-23", "skillName": "Cybersecurity", "requiredScore": 75, "level": "Proficient"}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

SELECT COUNT(*) AS total_users FROM users;