/// <reference types="vite/client" />
import { User, Skill, UserSkill, CourseRecommendation, NSSTAProgramme, Quiz, QuizAttempt, AdminQuizStats, GapAnalysisReport, NotificationItem, BankQuestion, BankStats } from '../types';

// Dynamic API Base URL: supports production Vercel deployment with VITE_API_URL or local proxy fallback
const getApiBase = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return `${envUrl.trim().replace(/\/+$/, '')}/api`;
  }
  return '/api';
};

const API_BASE = getApiBase();

export const api = {
  // Auth
  async login(email?: string, role?: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    return res.json();
  },

  async switchUser(userId: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/switch-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async getMe(userId: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me?userId=${userId}`);
    return res.json();
  },

  // Profile & Skills
  async getProfile(userId: string): Promise<{ user: User; skills: UserSkill[]; enrollments: any[] }> {
    const res = await fetch(`${API_BASE}/users/profile?userId=${userId}`);
    return res.json();
  },

  async updateProfile(userId: string, data: any): Promise<{ success: boolean; user: User; skills: UserSkill[] }> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data })
    });
    return res.json();
  },

  async getAllSkills(): Promise<{ skills: Skill[] }> {
    const res = await fetch(`${API_BASE}/users/skills`);
    return res.json();
  },

  // Gap Analysis & Recommendations
  async getSkillGaps(userId: string): Promise<GapAnalysisReport> {
    const res = await fetch(`${API_BASE}/skill-gaps?userId=${userId}`);
    return res.json();
  },

  async getRecommendations(userId: string): Promise<{ recommendations: CourseRecommendation[] }> {
    const res = await fetch(`${API_BASE}/recommendations?userId=${userId}`);
    return res.json();
  },

  async getLearningPath(userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/learning-path?userId=${userId}`);
    return res.json();
  },

  // iGOT & NSSTA
  async getIgotCourses(userId: string, filters?: { skill?: string; difficulty?: string; search?: string }): Promise<any> {
    const params = new URLSearchParams({ userId, ...filters });
    const res = await fetch(`${API_BASE}/igot/courses?${params}`);
    return res.json();
  },

  async enrollIgotCourse(userId: string, courseId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/igot/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId })
    });
    return res.json();
  },

  async updateIgotProgress(userId: string, courseId: string, progress: number): Promise<any> {
    const res = await fetch(`${API_BASE}/igot/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, progress })
    });
    return res.json();
  },

  async getNsstaProgrammes(filters?: { mode?: string; domain?: string }): Promise<{ programmes: NSSTAProgramme[] }> {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/nssta/programmes?${params}`);
    return res.json();
  },

  async registerNsstaProgramme(userId: string, programmeId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/nssta/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, programmeId })
    });
    return res.json();
  },

  // Assessment & Adaptive Engine
  async startAssessment(userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/assessment/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async evaluateQuestion(questionId: string, selectedAnswer: number): Promise<any> {
    const res = await fetch(`${API_BASE}/assessment/evaluate-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selectedAnswer })
    });
    return res.json();
  },

  async submitAssessment(userId: string, answers: Record<string, number>): Promise<any> {
    const res = await fetch(`${API_BASE}/assessment/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, answers })
    });
    return res.json();
  },

  // Quizzes & Generator
  async getQuizzes(options?: { role?: string; userId?: string; includeDeleted?: boolean }): Promise<{ quizzes: Quiz[] }> {
    const params = new URLSearchParams();
    if (options?.role) params.set('role', options.role);
    if (options?.userId) params.set('userId', options.userId);
    if (options?.includeDeleted) params.set('includeDeleted', 'true');
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/quiz/list${qs}`);
    return res.json();
  },

  async getAdminQuizStats(): Promise<AdminQuizStats> {
    const res = await fetch(`${API_BASE}/quiz/admin/stats`);
    return res.json();
  },

  async getQuizParticipants(quizId: string): Promise<{ participants: any[]; total: number }> {
    const res = await fetch(`${API_BASE}/quiz/admin/${quizId}/participants`);
    return res.json();
  },

  async createQuiz(quizData: Partial<Quiz>): Promise<{ success: boolean; quiz: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData)
    });
    return res.json();
  },

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<{ success: boolean; quiz: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async publishQuiz(id: string): Promise<{ success: boolean; error?: string; quiz?: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/${id}/publish`, {
      method: 'POST'
    });
    return res.json();
  },

  async unpublishQuiz(id: string): Promise<{ success: boolean; quiz: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/${id}/unpublish`, {
      method: 'POST'
    });
    return res.json();
  },

  async closeQuiz(id: string): Promise<{ success: boolean; closedAttemptsCount: number; quiz: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/${id}/close`, {
      method: 'POST'
    });
    return res.json();
  },

  async updateQuizDeadline(id: string, newEndAt: string): Promise<{ success: boolean; error?: string; quiz?: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/${id}/deadline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newEndAt })
    });
    return res.json();
  },

  async reopenQuiz(id: string, newEndAt: string): Promise<{ success: boolean; error?: string; quiz?: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/${id}/reopen`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newEndAt })
    });
    return res.json();
  },

  async deleteQuiz(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/quiz/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getQuizById(id: string): Promise<{ quiz: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/${id}`);
    return res.json();
  },

  async generateQuiz(formData: FormData): Promise<{ success: boolean; quiz: Quiz }> {
    const res = await fetch(`${API_BASE}/quiz/generate`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  async submitQuiz(
    quizId: string,
    userId: string,
    userAnswers: Record<string, number | null>,
    submissionType: 'Manual' | 'Auto-submitted' = 'Manual',
    submissionReason: string = 'MANUAL_SUBMISSION',
    attemptId?: string,
    timeSpentSeconds?: number
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userAnswers, submissionType, submissionReason, attemptId, timeSpentSeconds })
    });
    return res.json();
  },

  async startQuizAttempt(quizId: string, userId: string): Promise<{ success: boolean; attempt: QuizAttempt }> {
    const res = await fetch(`${API_BASE}/quiz/attempt/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId, userId })
    });
    return res.json();
  },

  async recordQuizAnswer(attemptId: string, questionId: string, selectedAnswer: number | null): Promise<any> {
    const res = await fetch(`${API_BASE}/quiz/attempt/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, questionId, selectedAnswer })
    });
    return res.json();
  },

  async submitQuizAttempt(payload: {
    attemptId?: string;
    quizId: string;
    userId: string;
    userAnswers?: Record<string, number | null>;
    submissionType?: 'Manual' | 'Auto-submitted';
    submissionReason?: string;
    timeSpentSeconds?: number;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/quiz/attempt/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getActiveQuizAttempt(userId: string, quizId: string): Promise<{ attempt: QuizAttempt | null }> {
    const res = await fetch(`${API_BASE}/quiz/attempt/active/${userId}/${quizId}`);
    return res.json();
  },

  async getQuizAttemptById(attemptId: string): Promise<{ attempt: QuizAttempt }> {
    const res = await fetch(`${API_BASE}/quiz/attempt/${attemptId}`);
    return res.json();
  },

  // Question Bank API
  async getBankQuestions(filters?: Record<string, string>): Promise<{ questions: BankQuestion[]; total: number }> {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/quiz/bank/questions?${params}`);
    return res.json();
  },

  async getBankStats(): Promise<BankStats> {
    const res = await fetch(`${API_BASE}/quiz/bank/stats`);
    return res.json();
  },

  async generateBankQuestions(payload: { targetSkill: string; questionCount: number; difficulty: string; questionTypes?: string[] }): Promise<any> {
    const res = await fetch(`${API_BASE}/quiz/bank/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async updateBankQuestion(id: string, updates: Partial<BankQuestion>): Promise<any> {
    const res = await fetch(`${API_BASE}/quiz/bank/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async approveBankQuestion(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/quiz/bank/${id}/approve`, {
      method: 'POST'
    });
    return res.json();
  },

  async deleteBankQuestion(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/quiz/bank/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Bot & Chat
  async sendChatMessage(
    message: string,
    userId: string,
    conversationHistory?: any[],
    sessionState?: any
  ): Promise<any> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId, conversationHistory, sessionState })
    });
    return res.json();
  },

  // Admin Analytics
  async getAdminAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    return res.json();
  },

  async getAdminSkillGaps(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/skill-gaps`);
    return res.json();
  },

  async getCompetencyFrameworks(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/competency-frameworks`);
    return res.json();
  },

  async updateCompetencyFramework(framework: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/competency-frameworks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(framework)
    });
    return res.json();
  },

  // Notifications
  async getNotifications(userId: string): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/notifications?userId=${userId}`);
    return res.json();
  },

  async markNotificationRead(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
    return res.json();
  },

  async markAllNotificationsRead(userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Learning Cycle & Practice Quizzes
  async completeCourse(userId: string, courseId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/igot/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId })
    });
    return res.json();
  },

  async getPracticeQuestions(skill: string): Promise<any> {
    const res = await fetch(`${API_BASE}/igot/practice/${encodeURIComponent(skill)}`);
    return res.json();
  },

  async submitPracticeQuiz(userId: string, skillName: string, selectedAnswers: { [questionId: string]: number }): Promise<any> {
    const res = await fetch(`${API_BASE}/igot/practice/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, skillName, selectedAnswers })
    });
    return res.json();
  },

  async getPracticeHistory(userId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/igot/practice/history?userId=${userId}`);
    return res.json();
  },

  // Admin Course Management
  async getAdminCourses(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/courses`);
    return res.json();
  },

  async createAdminCourse(course: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return res.json();
  },

  async updateAdminCourse(id: string, course: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    return res.json();
  },

  async deleteAdminCourse(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/courses/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async toggleAdminCourseStatus(id: string, status: 'active' | 'inactive'): Promise<any> {
    const res = await fetch(`${API_BASE}/igot/courses/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Admin Skill & Benchmark Management
  async getAdminSkills(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/skills`);
    return res.json();
  },

  async createAdminSkill(skill: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    });
    return res.json();
  },

  async updateAdminSkill(id: string, skill: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skill)
    });
    return res.json();
  },

  async deleteAdminSkill(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async updateSkillBenchmark(roleName: string, skillId: string, requiredScore: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/benchmarks/skill`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleName, skillId, requiredScore })
    });
    return res.json();
  }
};
