import {
  User, Skill, UserSkill, RoleBenchmark, Course, UserEnrollment,
  NSSTAProgramme, AssessmentQuestion, Quiz, QuizDynamicStatus, NotificationItem,
  BankQuestion, UserQuestionHistory, QuizAttempt, QuizSubmissionReason,
  PracticeQuestion, PracticeQuizResult,
  seedUsers, seedSkills, seedUserSkills, seedRoleBenchmarks,
  seedCourses, seedEnrollments, seedNSSTAProgrammes, seedAssessmentQuestions,
  seedFutureSkillPredictions, seedDepartmentAnalytics, seedTrainingEffectiveness,
  seedNotifications, seedQuizzes, seedPracticeQuestions
} from './seedData';

export function computeQuizStatus(quiz: Quiz, now: Date = new Date()): QuizDynamicStatus {
  if (quiz.isDeleted || quiz.status === 'archived') {
    return 'ARCHIVED';
  }
  if (quiz.status === 'draft') {
    return 'DRAFT';
  }
  if (quiz.manuallyClosed) {
    return 'CLOSED';
  }
  const nowMs = now.getTime();
  const startMs = quiz.startAt ? new Date(quiz.startAt).getTime() : 0;
  const endMs = quiz.endAt ? new Date(quiz.endAt).getTime() : Infinity;

  if (startMs && nowMs < startMs) {
    return 'UPCOMING';
  }
  if (endMs && nowMs > endMs) {
    return 'CLOSED';
  }
  return 'ACTIVE';
}

class Database {
  private users: User[] = [...seedUsers];
  private skills: Skill[] = [...seedSkills];
  private userSkills: UserSkill[] = [...seedUserSkills];
  private roleBenchmarks: RoleBenchmark[] = [...seedRoleBenchmarks];
  private courses: Course[] = [...seedCourses];
  private enrollments: UserEnrollment[] = [...seedEnrollments];
  private nsstaProgrammes: NSSTAProgramme[] = [...seedNSSTAProgrammes];
  private questionBank: AssessmentQuestion[] = [...seedAssessmentQuestions];
  private quizzes: Quiz[] = [...seedQuizzes];
  private notifications: NotificationItem[] = [...seedNotifications];
  private futureSkillPredictions = [...seedFutureSkillPredictions];
  private departmentAnalytics = [...seedDepartmentAnalytics];
  private trainingEffectiveness = [...seedTrainingEffectiveness];
  private practiceQuestions: PracticeQuestion[] = [...seedPracticeQuestions];
  private practiceResults: PracticeQuizResult[] = [];

  private bankQuestions: BankQuestion[] = seedAssessmentQuestions.map((q, idx) => ({
    ...q,
    subject: q.skill === 'Sampling' || q.skill === 'Survey Design' || q.skill === 'National Accounts' ? 'Statistics' : q.skill,
    topic: q.skill,
    source: q.sourceRef,
    sourceUrl: q.skill === 'Sampling' ? 'https://unstats.un.org/unsd/methodology/surveys/' :
               q.skill === 'Python' ? 'https://docs.python.org/3/library/statistics.html' :
               q.skill === 'Data Privacy' ? 'https://www.meity.gov.in/data-protection-framework' :
               'https://mospi.gov.in/sample-survey-methodology',
    concepts: [q.skill],
    tags: [q.skill, q.category, q.difficulty],
    usageCount: idx + 1,
    status: 'approved' as const,
    generatedAt: '2026-08-25T10:00:00Z'
  }));

  private userQuestionHistory: UserQuestionHistory[] = [];
  private quizAttempts: QuizAttempt[] = [];

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  updateUserProfile(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    return this.users[idx];
  }

  getAllSkills(): Skill[] {
    return this.skills;
  }

  getUserSkills(userId: string): UserSkill[] {
    return this.userSkills.filter(us => us.userId === userId);
  }

  setUserSkillScore(userId: string, skillName: string, score: number, category?: string): UserSkill {
    const existing = this.userSkills.find(
      us => us.userId === userId && us.skillName.toLowerCase() === skillName.toLowerCase()
    );

    let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
    if (score >= 80) level = 'Advanced';
    else if (score >= 60) level = 'Intermediate';

    const today = new Date().toISOString().split('T')[0];

    if (existing) {
      existing.competencyScore = score;
      existing.competencyLevel = level;
      existing.lastAssessed = today;
      return existing;
    } else {
      const skillObj = this.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
      const newUS: UserSkill = {
        userId,
        skillId: skillObj ? skillObj.id : `sk-custom-${Date.now()}`,
        skillName,
        category: category || (skillObj ? skillObj.category : 'Technical'),
        competencyScore: score,
        competencyLevel: level,
        lastAssessed: today
      };
      this.userSkills.push(newUS);
      return newUS;
    }
  }

  getRoleBenchmark(roleName: string): RoleBenchmark | undefined {
    return this.roleBenchmarks.find(r => r.roleName.toLowerCase().includes(roleName.toLowerCase())) || this.roleBenchmarks[0];
  }

  getAllRoleBenchmarks(): RoleBenchmark[] {
    return this.roleBenchmarks;
  }

  saveRoleBenchmark(benchmark: RoleBenchmark): void {
    const idx = this.roleBenchmarks.findIndex(r => r.roleName === benchmark.roleName);
    if (idx >= 0) {
      this.roleBenchmarks[idx] = benchmark;
    } else {
      this.roleBenchmarks.push(benchmark);
    }
  }

  getAllCourses(): Course[] {
    return this.courses;
  }

  getCourseById(id: string): Course | undefined {
    return this.courses.find(c => c.id === id);
  }

  addCourse(courseData: Partial<Course>): Course {
    const newCourse: Course = {
      id: courseData.id || `c-${Date.now()}`,
      title: courseData.title || 'Untitled Course',
      provider: courseData.provider || 'iGOT Karmayogi',
      skill: courseData.skill || 'Statistical',
      skillCategory: courseData.skillCategory || 'Technical',
      difficulty: courseData.difficulty || 'Intermediate',
      duration: courseData.duration || '6 hours',
      durationHours: courseData.durationHours || 6,
      rating: courseData.rating || 4.8,
      enrolledCount: courseData.enrolledCount || 0,
      source: courseData.source || 'iGOT',
      description: courseData.description || '',
      syllabus: courseData.syllabus || [],
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      externalUrl: courseData.externalUrl || 'https://www.kaggle.com/learn/python'
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<Course>): Course | null {
    const idx = this.courses.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.courses[idx] = { ...this.courses[idx], ...updates };
    return this.courses[idx];
  }

  deleteCourse(id: string): boolean {
    const idx = this.courses.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.courses.splice(idx, 1);
    return true;
  }

  getUserEnrollments(userId: string): (UserEnrollment & { course?: Course })[] {
    return this.enrollments
      .filter(e => e.userId === userId)
      .map(e => ({
        ...e,
        course: this.courses.find(c => c.id === e.courseId)
      }));
  }

  enrollCourse(userId: string, courseId: string): UserEnrollment {
    const existing = this.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (existing) return existing;

    const newEnrollment: UserEnrollment = {
      id: `en-${Date.now()}`,
      userId,
      courseId,
      progress: 0,
      status: 'enrolled',
      enrolledAt: new Date().toISOString().split('T')[0]
    };
    this.enrollments.push(newEnrollment);

    const u = this.getUserById(userId);
    if (u) {
      u.coursesInProgress += 1;
    }
    return newEnrollment;
  }

  updateEnrollmentProgress(userId: string, courseId: string, progress: number): UserEnrollment | null {
    const enrollment = this.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!enrollment) return null;
    enrollment.progress = progress;
    if (progress >= 100) {
      enrollment.status = 'completed';
      const u = this.getUserById(userId);
      if (u) {
        u.coursesCompleted += 1;
        u.coursesInProgress = Math.max(0, u.coursesInProgress - 1);
        u.learningHours += 8;
      }
    }
    return enrollment;
  }

  completeCourse(userId: string, courseId: string): { enrollment: UserEnrollment; updatedSkill?: UserSkill; achievement?: string } {
    let enrollment = this.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!enrollment) {
      enrollment = this.enrollCourse(userId, courseId);
    }
    enrollment.progress = 100;
    enrollment.status = 'completed';

    const course = this.getCourseById(courseId);
    const user = this.getUserById(userId);
    if (user) {
      user.coursesCompleted += 1;
      user.coursesInProgress = Math.max(0, user.coursesInProgress - 1);
      user.learningHours += course ? course.durationHours : 8;
    }

    // Boost corresponding skill competency (+8 points)
    let updatedSkill: UserSkill | undefined;
    if (course) {
      const uSkill = this.getUserSkill(userId, course.skill);
      if (uSkill) {
        uSkill.competencyScore = Math.min(100, uSkill.competencyScore + 8);
        uSkill.lastAssessed = new Date().toISOString().split('T')[0];
        updatedSkill = uSkill;
      }
    }

    this.addNotification({
      userId,
      title: '📚 Course Completed!',
      message: `You have successfully completed "${course ? course.title : 'Course'}". Next step: Take a 5-question mini practice assessment to consolidate your mastery.`,
      type: 'course',
      actionUrl: '/dashboard'
    });

    return { enrollment, updatedSkill, achievement: 'Course Completed' };
  }

  getPracticeQuestionsBySkill(skillName: string): PracticeQuestion[] {
    const s = skillName.toLowerCase();
    let matches = this.practiceQuestions.filter(q =>
      q.skill.toLowerCase() === s ||
      q.skill.toLowerCase().includes(s) ||
      s.includes(q.skill.toLowerCase())
    );
    if (matches.length === 0) {
      matches = this.practiceQuestions.slice(0, 5);
    }
    return matches.slice(0, 5);
  }

  getUserSkill(userId: string, skillName: string): UserSkill | undefined {
    const s = skillName.toLowerCase();
    return this.getUserSkills(userId).find(sk =>
      sk.skillName.toLowerCase() === s ||
      sk.skillName.toLowerCase().includes(s) ||
      s.includes(sk.skillName.toLowerCase())
    );
  }

  submitPracticeQuiz(userId: string, skillName: string, selectedAnswers: { [questionId: string]: number }): PracticeQuizResult {
    const questions = this.getPracticeQuestionsBySkill(skillName);
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] !== undefined && Number(selectedAnswers[q.id]) === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length || 5;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);

    const userSkill = this.getUserSkill(userId, skillName);
    const prevScore = userSkill ? userSkill.competencyScore : 50;

    // Boost competency score based on practice accuracy: +4% to +15%
    const scoreBoost = Math.max(3, Math.round((accuracy / 100) * 12));
    const newScore = Math.min(100, prevScore + scoreBoost);
    const improvement = newScore - (userSkill?.initialScore || prevScore);

    if (userSkill) {
      userSkill.competencyScore = newScore;
      userSkill.lastAssessed = new Date().toISOString().split('T')[0];
      userSkill.competencyLevel = newScore >= 80 ? 'Advanced' : newScore >= 60 ? 'Intermediate' : 'Beginner';
    }

    const user = this.getUserById(userId);
    const benchmark = user ? this.getRoleBenchmark(user.designation) : null;
    const reqSkill = benchmark?.requiredSkills.find(s => s.skillName.toLowerCase() === skillName.toLowerCase());
    const requiredScore = reqSkill ? reqSkill.requiredScore : 75;
    const benchmarkAchieved = newScore >= requiredScore;

    const result: PracticeQuizResult = {
      id: `pqr-${Date.now()}`,
      userId,
      skillName,
      score: correctCount,
      totalQuestions,
      accuracy,
      previousScore: prevScore,
      newScore,
      improvement,
      benchmarkAchieved,
      timestamp: new Date().toISOString()
    };

    this.practiceResults.push(result);

    if (benchmarkAchieved) {
      this.addNotification({
        userId,
        title: '🏆 Competency Benchmark Achieved!',
        message: `Congratulations! Your ${skillName} score is now ${newScore}%, fulfilling the required ${requiredScore}% benchmark for your role.`,
        type: 'competency',
        actionUrl: '/dashboard'
      });
    } else {
      this.addNotification({
        userId,
        title: '⭐ Practice Assessment Completed',
        message: `You scored ${accuracy}% on ${skillName} practice. Competency updated from ${prevScore}% to ${newScore}%.`,
        type: 'assessment',
        actionUrl: '/dashboard'
      });
    }

    return result;
  }

  getPracticeHistory(userId: string): PracticeQuizResult[] {
    return this.practiceResults.filter(r => r.userId === userId);
  }

  getSkills(): Skill[] {
    return this.skills;
  }

  addSkill(skillData: Partial<Skill>): Skill {
    const newSkill: Skill = {
      id: skillData.id || `sk-${Date.now()}`,
      name: skillData.name || 'New Skill',
      category: skillData.category || 'Technical',
      description: skillData.description || '',
      importance: skillData.importance || 'High'
    };
    this.skills.push(newSkill);
    return newSkill;
  }

  updateSkill(id: string, updates: Partial<Skill>): Skill | null {
    const idx = this.skills.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.skills[idx] = { ...this.skills[idx], ...updates };
    return this.skills[idx];
  }

  deleteSkill(id: string): boolean {
    const idx = this.skills.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.skills.splice(idx, 1);
    return true;
  }

  updateRoleBenchmarkSkill(roleName: string, skillId: string, requiredScore: number): boolean {
    const benchmark = this.roleBenchmarks.find(b =>
      b.roleName.toLowerCase().includes(roleName.toLowerCase()) ||
      roleName.toLowerCase().includes(b.roleName.toLowerCase())
    );
    if (!benchmark) {
      if (this.roleBenchmarks.length > 0) {
        const req = this.roleBenchmarks[0].requiredSkills.find(s => s.skillId === skillId);
        if (req) {
          req.requiredScore = requiredScore;
          return true;
        }
      }
      return false;
    }
    const req = benchmark.requiredSkills.find(s => s.skillId === skillId);
    if (req) {
      req.requiredScore = requiredScore;
      return true;
    } else {
      const skill = this.skills.find(s => s.id === skillId);
      benchmark.requiredSkills.push({
        skillId,
        skillName: skill ? skill.name : 'Custom Skill',
        requiredScore,
        level: requiredScore >= 80 ? 'Advanced' : requiredScore >= 60 ? 'Intermediate' : 'Beginner'
      });
      return true;
    }
  }

  getAllNSSTAProgrammes(): NSSTAProgramme[] {
    return this.nsstaProgrammes;
  }

  getNSSTAProgrammeById(id: string): NSSTAProgramme | undefined {
    return this.nsstaProgrammes.find(p => p.id === id);
  }

  computeQuizStatus(quiz: Quiz, now: Date = new Date()): QuizDynamicStatus {
    return computeQuizStatus(quiz, now);
  }

  getAllQuizzes(options?: { role?: string; userId?: string; includeDeleted?: boolean }): Quiz[] {
    const now = new Date();
    let list = this.quizzes;

    if (!options?.includeDeleted && options?.role !== 'admin') {
      list = list.filter(q => !q.isDeleted);
    }

    if (options?.userId && options?.role !== 'admin') {
      const user = this.getUserById(options.userId);
      list = list.filter(q => {
        if (q.status === 'draft') return false;
        if (q.isDeleted) return false;
        if (q.targetCadres && q.targetCadres.length > 0 && !q.targetCadres.includes('All')) {
          if (user && !(user.cadre && q.targetCadres.includes(user.cadre)) && !q.targetCadres.includes(user.designation)) {
            return false;
          }
        }
        return true;
      });
    }

    return list.map(q => {
      const computed = computeQuizStatus(q, now);
      const attempts = this.quizAttempts.filter(a => a.quizId === q.id && a.status !== 'IN_PROGRESS');
      const participantsCount = q.participantsCount || attempts.length;
      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
        : (q.averageScore || 0);

      return {
        ...q,
        computedStatus: computed,
        participantsCount,
        averageScore: avgScore
      };
    });
  }

  getQuizzes(options?: { role?: string; userId?: string; includeDeleted?: boolean }): Quiz[] {
    return this.getAllQuizzes(options);
  }

  getQuizById(id: string, options?: { forOfficial?: boolean; userId?: string }): Quiz | undefined {
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) return undefined;
    if (quiz.isDeleted && options?.forOfficial) return undefined;

    const computed = computeQuizStatus(quiz);
    const attempts = this.quizAttempts.filter(a => a.quizId === quiz.id && a.status !== 'IN_PROGRESS');
    const participantsCount = quiz.participantsCount || attempts.length;
    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length)
      : (quiz.averageScore || 0);

    return {
      ...quiz,
      computedStatus: computed,
      participantsCount,
      averageScore: avgScore
    };
  }

  createQuiz(quiz: Partial<Quiz>): Quiz {
    const now = new Date();
    const startAt = quiz.startAt || now.toISOString();
    const endAt = quiz.endAt || '';

    const newQuiz: Quiz = {
      id: quiz.id || `quiz-${Date.now()}`,
      title: quiz.title || 'Untitled Assessment',
      description: quiz.description || '',
      targetSkill: quiz.targetSkill || 'Statistical Methodology',
      domain: quiz.domain || 'Statistical Competencies',
      topic: quiz.topic || quiz.targetSkill || 'General Statistics',
      difficulty: quiz.difficulty || 'Mixed',
      sourceMaterialName: quiz.sourceMaterialName || 'Official Statistical Training Guidelines',
      createdBy: quiz.createdBy || 'Dr. Sunita Rao (NSSTA)',
      createdAt: quiz.createdAt || now.toISOString().split('T')[0],
      status: quiz.status || 'draft',
      timeLimitMinutes: quiz.timeLimitMinutes || 15,
      passingScorePercentage: quiz.passingScorePercentage || 60,
      startAt,
      endAt,
      timezone: quiz.timezone || 'IST (UTC+05:30)',
      targetCadres: quiz.targetCadres || ['All'],
      targetDepartments: quiz.targetDepartments || ['All'],
      isDeleted: false,
      manuallyClosed: false,
      questions: quiz.questions || [],
      participantsCount: 0,
      averageScore: 0
    };

    newQuiz.computedStatus = computeQuizStatus(newQuiz, now);
    this.quizzes.unshift(newQuiz);
    return newQuiz;
  }

  updateQuiz(id: string, updates: Partial<Quiz>): Quiz | null {
    const idx = this.quizzes.findIndex(q => q.id === id);
    if (idx === -1) return null;
    this.quizzes[idx] = { ...this.quizzes[idx], ...updates };
    this.quizzes[idx].computedStatus = computeQuizStatus(this.quizzes[idx]);
    return this.quizzes[idx];
  }

  publishQuiz(id: string): { success: boolean; error?: string; quiz?: Quiz } {
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) return { success: false, error: 'Quiz not found' };

    // Validations
    if (!quiz.title || quiz.title.trim() === '') {
      return { success: false, error: 'Quiz title is required' };
    }
    if (!quiz.questions || quiz.questions.length === 0) {
      return { success: false, error: 'At least one question is required to publish a quiz' };
    }
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.options || q.options.length !== 4) {
        return { success: false, error: `Question ${i + 1} must have exactly 4 options` };
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        return { success: false, error: `Question ${i + 1} has an invalid correct answer index` };
      }
    }
    if (!quiz.timeLimitMinutes || quiz.timeLimitMinutes <= 0) {
      return { success: false, error: 'Duration must be greater than 0 minutes' };
    }
    if (!quiz.startAt) {
      return { success: false, error: 'Start date and time are required' };
    }
    if (!quiz.endAt) {
      return { success: false, error: 'Deadline date and time are required' };
    }
    const startMs = new Date(quiz.startAt).getTime();
    const endMs = new Date(quiz.endAt).getTime();
    if (isNaN(startMs) || isNaN(endMs)) {
      return { success: false, error: 'Invalid start or end date/time format' };
    }
    if (endMs <= startMs) {
      return { success: false, error: 'Deadline must be after start date/time' };
    }
    if (quiz.passingScorePercentage && (quiz.passingScorePercentage < 1 || quiz.passingScorePercentage > 100)) {
      return { success: false, error: 'Passing percentage must be between 1% and 100%' };
    }

    quiz.status = 'published';
    quiz.manuallyClosed = false;
    quiz.computedStatus = computeQuizStatus(quiz);
    return { success: true, quiz };
  }

  unpublishQuiz(id: string): Quiz | null {
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) return null;
    quiz.status = 'draft';
    quiz.computedStatus = computeQuizStatus(quiz);
    return quiz;
  }

  closeQuizManually(id: string): { success: boolean; closedAttemptsCount: number; quiz: Quiz | null } {
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) return { success: false, closedAttemptsCount: 0, quiz: null };

    quiz.manuallyClosed = true;
    quiz.closedAt = new Date().toISOString();
    quiz.computedStatus = 'CLOSED';

    // Auto-finalize any active attempts in progress with ADMIN_CLOSED_QUIZ
    let closedCount = 0;
    const activeAttempts = this.quizAttempts.filter(a => a.quizId === id && a.status === 'IN_PROGRESS');
    activeAttempts.forEach(att => {
      this.finalizeQuizAttempt({
        attemptId: att.id,
        quizId: id,
        userId: att.userId,
        answers: att.answers,
        submissionType: 'Auto-submitted',
        submissionReason: 'ADMIN_CLOSED_QUIZ',
        timeSpentSeconds: att.timeSpentSeconds || 60
      });
      closedCount++;
    });

    return { success: true, closedAttemptsCount: closedCount, quiz };
  }

  reopenQuiz(id: string, newEndAt: string): { success: boolean; error?: string; quiz?: Quiz | null } {
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) return { success: false, error: 'Quiz not found' };

    const endMs = new Date(newEndAt).getTime();
    if (isNaN(endMs)) {
      return { success: false, error: 'Invalid deadline format' };
    }
    if (endMs <= Date.now()) {
      return { success: false, error: 'New deadline must be in the future' };
    }

    quiz.manuallyClosed = false;
    quiz.closedAt = undefined;
    quiz.endAt = newEndAt;
    quiz.status = 'published';
    quiz.computedStatus = computeQuizStatus(quiz);
    return { success: true, quiz };
  }

  deleteQuiz(id: string): boolean {
    return this.softDeleteQuiz(id);
  }

  softDeleteQuiz(id: string): boolean {
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) return false;
    quiz.isDeleted = true;
    quiz.deletedAt = new Date().toISOString();
    quiz.computedStatus = 'ARCHIVED';
    return true;
  }

  getQuizParticipants(quizId: string): any[] {
    const attempts = this.quizAttempts.filter(a => a.quizId === quizId);
    return attempts.map(att => {
      const user = this.getUserById(att.userId);
      return {
        attemptId: att.id,
        userId: att.userId,
        name: user?.name || 'Statistical Official',
        employeeId: user?.employeeId || 'MOSPI-SSO',
        cadre: user?.cadre || 'Indian Statistical Service',
        department: user?.department || 'National Statistical Office',
        score: att.score || 0,
        correctCount: att.correctCount || 0,
        incorrectCount: att.incorrectCount || 0,
        unansweredCount: att.unansweredCount || 0,
        status: att.status,
        submissionType: att.submissionType,
        submissionReason: att.submissionReason,
        timeSpentSeconds: att.timeSpentSeconds || 0,
        startedAt: att.startedAt,
        submittedAt: att.submittedAt
      };
    });
  }

  getAdminQuizStats(): { total: number; published: number; drafts: number; active: number; closed: number; upcoming: number } {
    const now = new Date();
    const nonDeleted = this.quizzes.filter(q => !q.isDeleted);
    let drafts = 0;
    let published = 0;
    let active = 0;
    let closed = 0;
    let upcoming = 0;

    nonDeleted.forEach(q => {
      const st = computeQuizStatus(q, now);
      if (q.status === 'draft') drafts++;
      if (q.status === 'published') published++;
      if (st === 'ACTIVE') active++;
      if (st === 'CLOSED') closed++;
      if (st === 'UPCOMING') upcoming++;
    });

    return {
      total: nonDeleted.length,
      published,
      drafts,
      active,
      closed,
      upcoming
    };
  }

  getQuestionBank(): AssessmentQuestion[] {
    return this.questionBank;
  }

  addQuestion(question: AssessmentQuestion): void {
    this.questionBank.push(question);
  }

  getAllBankQuestions(filters?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
    type?: string;
    status?: string;
    search?: string;
  }): BankQuestion[] {
    let result = this.bankQuestions;

    if (filters?.subject && filters.subject !== 'all') {
      result = result.filter(q =>
        q.subject.toLowerCase() === filters.subject!.toLowerCase() ||
        q.skill.toLowerCase() === filters.subject!.toLowerCase()
      );
    }
    if (filters?.topic && filters.topic !== 'all') {
      result = result.filter(q =>
        q.topic.toLowerCase().includes(filters.topic!.toLowerCase()) ||
        q.skill.toLowerCase().includes(filters.topic!.toLowerCase())
      );
    }
    if (filters?.difficulty && filters.difficulty !== 'all') {
      result = result.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters?.type && filters.type !== 'all') {
      result = result.filter(q => q.type.toLowerCase().includes(filters.type!.toLowerCase()));
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(q => q.status === filters.status);
    }
    if (filters?.search) {
      const qLower = filters.search.toLowerCase();
      result = result.filter(q =>
        q.question.toLowerCase().includes(qLower) ||
        q.explanation.toLowerCase().includes(qLower) ||
        q.source.toLowerCase().includes(qLower) ||
        (q.concepts && q.concepts.some(c => c.toLowerCase().includes(qLower)))
      );
    }

    return result;
  }

  getBankQuestionById(id: string): BankQuestion | undefined {
    return this.bankQuestions.find(q => q.id === id);
  }

  addBankQuestion(question: BankQuestion): BankQuestion {
    const existingIdx = this.bankQuestions.findIndex(q => q.id === question.id || q.question === question.question);
    if (existingIdx >= 0) {
      this.bankQuestions[existingIdx].usageCount = (this.bankQuestions[existingIdx].usageCount || 0) + 1;
      return this.bankQuestions[existingIdx];
    }
    this.bankQuestions.unshift(question);
    this.questionBank.push(question);
    return question;
  }

  updateBankQuestion(id: string, updates: Partial<BankQuestion>): BankQuestion | null {
    const idx = this.bankQuestions.findIndex(q => q.id === id);
    if (idx === -1) return null;
    this.bankQuestions[idx] = { ...this.bankQuestions[idx], ...updates };
    return this.bankQuestions[idx];
  }

  deleteBankQuestion(id: string): boolean {
    const lenBefore = this.bankQuestions.length;
    this.bankQuestions = this.bankQuestions.filter(q => q.id !== id);
    this.questionBank = this.questionBank.filter(q => q.id !== id);
    return this.bankQuestions.length < lenBefore;
  }

  getBankStats() {
    const total = this.bankQuestions.length;
    const approved = this.bankQuestions.filter(q => q.status === 'approved').length;
    const pending = this.bankQuestions.filter(q => q.status === 'pending').length;

    const subjects = Array.from(new Set(this.bankQuestions.map(q => q.subject)));
    const topics = Array.from(new Set(this.bankQuestions.map(q => q.topic)));
    const concepts = Array.from(new Set(this.bankQuestions.flatMap(q => q.concepts || [])));

    const difficultyCounts = {
      Easy: this.bankQuestions.filter(q => q.difficulty === 'Easy').length,
      Medium: this.bankQuestions.filter(q => q.difficulty === 'Medium').length,
      Hard: this.bankQuestions.filter(q => q.difficulty === 'Hard').length
    };

    const typeCounts: Record<string, number> = {};
    this.bankQuestions.forEach(q => {
      typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    });

    return {
      totalQuestions: total,
      approvedQuestions: approved,
      pendingQuestions: pending,
      subjectsCount: subjects.length,
      topicsCount: topics.length,
      uniqueConceptsCount: concepts.length,
      difficultyCounts,
      typeCounts,
      subjects
    };
  }

  getUserQuestionHistory(userId: string): UserQuestionHistory[] {
    return this.userQuestionHistory.filter(h => h.userId === userId);
  }

  recordUserQuestionAttempt(userId: string, questionId: string, quizId?: string, isCorrect?: boolean): void {
    this.userQuestionHistory.push({
      id: `uqh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      questionId,
      quizId,
      attemptedAt: new Date().toISOString(),
      isCorrect
    });
  }

  getUserAttemptedQuestionIds(userId: string, cooldownDays: number = 30): Set<string> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - cooldownDays);
    const cutoffStr = cutoff.toISOString();

    const recent = this.userQuestionHistory.filter(
      h => h.userId === userId && h.attemptedAt >= cutoffStr
    );

    return new Set(recent.map(h => h.questionId));
  }

  getUserNotifications(userId: string): NotificationItem[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  markNotificationRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
  }

  markAllNotificationsRead(userId: string): void {
    this.notifications.filter(n => n.userId === userId).forEach(n => {
      n.read = true;
    });
  }

  addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  createOrGetActiveQuizAttempt(userId: string, quizId: string): QuizAttempt {
    const existing = this.quizAttempts.find(
      a => a.userId === userId && a.quizId === quizId && a.status === 'IN_PROGRESS'
    );
    if (existing) return existing;

    const quiz = this.getQuizById(quizId);
    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      quizId,
      startedAt: new Date().toISOString(),
      status: 'IN_PROGRESS',
      submissionType: 'Manual',
      submissionReason: 'MANUAL_SUBMISSION',
      answers: {},
      totalQuestions: quiz ? quiz.questions.length : 10
    };
    this.quizAttempts.unshift(newAttempt);
    return newAttempt;
  }

  updateQuizAttemptAnswer(attemptId: string, questionId: string, selectedAnswer: number | null): QuizAttempt | null {
    const attempt = this.quizAttempts.find(a => a.id === attemptId);
    if (!attempt || attempt.status !== 'IN_PROGRESS') return null;
    attempt.answers[questionId] = selectedAnswer;
    return attempt;
  }

  getQuizAttemptById(id: string): QuizAttempt | undefined {
    return this.quizAttempts.find(a => a.id === id);
  }

  getActiveQuizAttempt(userId: string, quizId: string): QuizAttempt | undefined {
    return this.quizAttempts.find(
      a => a.userId === userId && a.quizId === quizId && a.status === 'IN_PROGRESS'
    );
  }

  getRecentQuizAttempt(userId: string, quizId: string): QuizAttempt | undefined {
    return this.quizAttempts.find(
      a => a.userId === userId && a.quizId === quizId
    );
  }

  finalizeQuizAttempt(params: {
    attemptId?: string;
    quizId: string;
    userId: string;
    answers?: Record<string, number | null>;
    submissionType?: 'Manual' | 'Auto-submitted';
    submissionReason?: QuizSubmissionReason;
    timeSpentSeconds?: number;
  }): QuizAttempt {
    const {
      attemptId,
      quizId,
      userId,
      answers = {},
      submissionType = 'Manual',
      submissionReason = 'MANUAL_SUBMISSION',
      timeSpentSeconds
    } = params;

    // Idempotency: If attempt is already finalized, return existing attempt immediately
    if (attemptId) {
      const existing = this.quizAttempts.find(a => a.id === attemptId);
      if (existing && (existing.status === 'SUBMITTED' || existing.status === 'AUTO_SUBMITTED')) {
        return existing;
      }
    }

    const quiz = this.getQuizById(quizId);
    if (!quiz) {
      throw new Error(`Quiz with id ${quizId} not found`);
    }

    let attempt = attemptId ? this.quizAttempts.find(a => a.id === attemptId) : undefined;
    if (!attempt) {
      attempt = this.createOrGetActiveQuizAttempt(userId, quizId);
    }

    // Merge answers
    const mergedAnswers = { ...attempt.answers, ...answers };

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const questionResults = quiz.questions.map(q => {
      const userAns = mergedAnswers[q.id];
      const isAnswered = userAns !== undefined && userAns !== null;
      const isCorrect = isAnswered && userAns === q.correctAnswer;

      if (isCorrect) {
        correctCount++;
      } else if (isAnswered) {
        incorrectCount++;
      } else {
        unansweredCount++;
      }

      // Record in user history
      if (isAnswered) {
        try {
          this.recordUserQuestionAttempt(userId, q.id, quiz.id, isCorrect);
        } catch (e) {}
      }

      return {
        questionId: q.id,
        question: q.question,
        userAnswer: isAnswered ? userAns : null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        sourceRef: q.sourceRef,
        source: q.source,
        sourceUrl: q.sourceUrl
      };
    });

    const total = Math.max(1, quiz.questions.length);
    const score = Math.round((correctCount / total) * 100);

    const isAuto = submissionReason !== 'MANUAL_SUBMISSION';
    const status = isAuto ? 'AUTO_SUBMITTED' : 'SUBMITTED';
    const finalSubmissionType = isAuto ? 'Auto-submitted' : 'Manual';

    attempt.answers = mergedAnswers;
    attempt.status = status;
    attempt.submissionType = finalSubmissionType;
    attempt.submissionReason = submissionReason;
    attempt.submittedAt = new Date().toISOString();
    attempt.score = score;
    attempt.correctCount = correctCount;
    attempt.incorrectCount = incorrectCount;
    attempt.unansweredCount = unansweredCount;
    attempt.totalQuestions = total;
    attempt.timeSpentSeconds = timeSpentSeconds;
    attempt.questionResults = questionResults;

    // Feedback
    let feedback = '';
    if (score >= 80) {
      feedback = `Outstanding competency demonstrated in ${quiz.targetSkill} (${score}%: ${correctCount}/${total} correct). Advanced mastery shown in official statistical methodology.`;
    } else if (score >= 60) {
      feedback = `Good conceptual grasp in ${quiz.targetSkill} (${score}%: ${correctCount}/${total} correct). Focus on complex sampling error formulas to achieve top-tier proficiency.`;
    } else {
      feedback = `Identified foundational skill gap in ${quiz.targetSkill} (${score}%: ${correctCount}/${total} correct). Priority recommendation: Review NSSTA training modules to meet cadre benchmarks.`;
    }
    attempt.aiFeedback = feedback;

    // Update user competency score blend
    const priorUserSkill = this.getUserSkills(userId).find(
      s => s.skillName.toLowerCase() === quiz.targetSkill.toLowerCase()
    );
    const blendedScore = priorUserSkill ? Math.round(0.7 * score + 0.3 * priorUserSkill.competencyScore) : score;
    this.setUserSkillScore(userId, quiz.targetSkill, blendedScore);

    // Notification
    this.addNotification({
      userId,
      title: `${isAuto ? '⚡ Auto-Submitted' : 'Quiz Result'}: ${quiz.title}`,
      message: `${isAuto ? `Assessment automatically finalized (${submissionReason.replace('_', ' ')}). ` : ''}You scored ${score}% (${correctCount}/${total} correct). Competency updated to ${blendedScore}%.`,
      type: 'competency',
      actionUrl: '/skill-gaps'
    });

    return attempt;
  }

  getFutureSkillPredictions() {
    return this.futureSkillPredictions;
  }

  getDepartmentAnalytics() {
    return this.departmentAnalytics;
  }

  getTrainingEffectiveness() {
    return this.trainingEffectiveness;
  }
}

export const db = new Database();
