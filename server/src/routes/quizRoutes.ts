import { Router } from 'express';
import multer from 'multer';
import { db } from '../data/db';
import { aiService } from '../services/aiService';
import { questionBankService } from '../services/questionBankService';

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

// 1. Question Bank Management Routes (Admin & System)
router.get('/bank/questions', (req, res) => {
  const { subject, topic, difficulty, type, status, search } = req.query;
  const questions = db.getAllBankQuestions({
    subject: subject as string,
    topic: topic as string,
    difficulty: difficulty as string,
    type: type as string,
    status: status as string,
    search: search as string
  });
  res.json({ questions, total: questions.length });
});

router.get('/bank/stats', (req, res) => {
  const stats = db.getBankStats();
  res.json(stats);
});

router.post('/bank/generate', async (req, res) => {
  try {
    const {
      targetSkill = 'Sampling',
      questionCount = 10,
      difficulty = 'Mixed',
      questionTypes
    } = req.body;

    const generated = await aiService.generateQuiz({
      targetSkill,
      questionCount: parseInt(questionCount, 10) || 10,
      difficulty: difficulty as any,
      questionTypes: questionTypes || ['Conceptual', 'Application', 'Scenario-based']
    });

    res.json({ success: true, count: generated.length, questions: generated });
  } catch (error: any) {
    console.error('Bank generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/bank/:id', (req, res) => {
  const updated = db.updateBankQuestion(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Question not found' });
  res.json({ success: true, question: updated });
});

router.post('/bank/:id/approve', (req, res) => {
  const q = db.getBankQuestionById(req.params.id);
  if (!q) return res.status(404).json({ error: 'Question not found' });
  const updated = db.updateBankQuestion(req.params.id, {
    status: q.status === 'approved' ? 'pending' : 'approved'
  });
  res.json({ success: true, question: updated });
});

router.delete('/bank/:id', (req, res) => {
  const success = db.deleteBankQuestion(req.params.id);
  res.json({ success });
});

// 2. AI Quiz Generator Endpoint
router.post('/generate', upload.single('file'), async (req, res) => {
  try {
    const {
      targetSkill = 'Sampling',
      questionCount = '10',
      difficulty = 'Mixed',
      questionTypes,
      content = '',
      userId = 'u-1',
      startAt,
      endAt,
      timeLimitMinutes,
      passingScorePercentage,
      timezone = 'IST (UTC+05:30)',
      targetCadres,
      status = 'draft'
    } = req.body;

    let typesArray: string[] = ['MCQ', 'Scenario-based'];
    if (typeof questionTypes === 'string') {
      try { typesArray = JSON.parse(questionTypes); } catch (e) { typesArray = [questionTypes]; }
    } else if (Array.isArray(questionTypes)) {
      typesArray = questionTypes;
    }

    const fileName = req.file ? req.file.originalname : undefined;
    const count = parseInt(questionCount, 10) || 10;
    const duration = parseInt(timeLimitMinutes, 10) || 15;
    const passPercentage = parseInt(passingScorePercentage, 10) || 60;

    // Validate schedule if provided
    if (startAt && endAt) {
      const startMs = new Date(startAt).getTime();
      const endMs = new Date(endAt).getTime();
      if (isNaN(startMs) || isNaN(endMs)) {
        return res.status(400).json({ error: 'Invalid start or deadline date/time format.' });
      }
      if (endMs <= startMs) {
        return res.status(400).json({ error: 'Deadline must be after the start date and time.' });
      }
      if (endMs <= Date.now()) {
        return res.status(400).json({ error: 'Deadline must be in the future.' });
      }
    }

    const generatedQuestions = await aiService.generateQuiz({
      targetSkill,
      questionCount: count,
      difficulty: difficulty as any,
      questionTypes: typesArray,
      sourceMaterialName: fileName,
      content: content || (req.file ? `Extracted textual concepts from ${req.file.originalname}` : ''),
      userId
    });

    const newQuiz = db.createQuiz({
      title: `${targetSkill} AI Skill Assessment`,
      description: `AI-synthesized examination evaluating ${targetSkill} competencies for statistical officers based on official curriculum & trusted sources.`,
      targetSkill,
      domain: 'Statistical Competencies',
      topic: `${targetSkill} Competency Assessment`,
      difficulty: difficulty as any,
      sourceMaterialName: fileName || 'Official Guidelines & Web Sources',
      createdBy: 'AI Assessment Generator',
      status: status || 'draft',
      questions: generatedQuestions,
      timeLimitMinutes: duration,
      passingScorePercentage: passPercentage,
      startAt: startAt || new Date().toISOString(),
      endAt: endAt || '',
      timezone: timezone || 'IST (UTC+05:30)',
      targetCadres: targetCadres ? (Array.isArray(targetCadres) ? targetCadres : [targetCadres]) : ['All']
    });

    res.json({
      success: true,
      quiz: newQuiz
    });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz: ' + error.message });
  }
});

router.get('/list', (req, res) => {
  const { role, userId, includeDeleted } = req.query;
  const quizzes = db.getAllQuizzes({
    role: role as string,
    userId: userId as string,
    includeDeleted: includeDeleted === 'true'
  });
  res.json({ quizzes });
});

router.get('/', (req, res) => {
  const { role, userId, includeDeleted } = req.query;
  const quizzes = db.getAllQuizzes({
    role: role as string,
    userId: userId as string,
    includeDeleted: includeDeleted === 'true'
  });
  res.json({ quizzes });
});

// Admin Quiz Stats
router.get('/admin/stats', (req, res) => {
  const stats = db.getAdminQuizStats();
  res.json(stats);
});

// Admin Quiz Participants Monitoring
router.get('/admin/:id/participants', (req, res) => {
  const participants = db.getQuizParticipants(req.params.id);
  res.json({ participants, total: participants.length });
});

// Admin Create Quiz Manually
router.post('/', (req, res) => {
  try {
    const newQuiz = db.createQuiz(req.body);
    res.json({ success: true, quiz: newQuiz });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Admin Publish Quiz (with validation)
router.post('/:id/publish', (req, res) => {
  const result = db.publishQuiz(req.params.id);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Admin Unpublish Quiz
router.post('/:id/unpublish', (req, res) => {
  const quiz = db.unpublishQuiz(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json({ success: true, quiz });
});

// Admin Edit Deadline for Active/Upcoming Quiz
router.post('/:id/deadline', (req, res) => {
  const { newEndAt } = req.body;
  if (!newEndAt) return res.status(400).json({ error: 'newEndAt is required' });

  const quiz = db.getQuizById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  if (quiz.computedStatus === 'CLOSED') {
    return res.status(400).json({
      error: 'Cannot edit deadline for a closed quiz. Please use the Reopen Assessment option instead.',
      isClosed: true
    });
  }

  const endMs = new Date(newEndAt).getTime();
  if (isNaN(endMs)) {
    return res.status(400).json({ error: 'Invalid deadline format' });
  }
  if (endMs <= Date.now()) {
    return res.status(400).json({ error: 'New deadline must be in the future' });
  }
  const startMs = quiz.startAt ? new Date(quiz.startAt).getTime() : 0;
  if (startMs && endMs <= startMs) {
    return res.status(400).json({ error: 'New deadline must be after the start date and time' });
  }

  const updated = db.updateQuiz(req.params.id, { endAt: newEndAt });
  res.json({ success: true, quiz: updated });
});

// Admin Manually Close Quiz
router.post('/:id/close', (req, res) => {
  const result = db.closeQuizManually(req.params.id);
  if (!result.success) return res.status(404).json({ error: 'Quiz not found' });
  res.json(result);
});

// Admin Reopen Quiz
router.post('/:id/reopen', (req, res) => {
  const { newEndAt } = req.body;
  if (!newEndAt) return res.status(400).json({ error: 'newEndAt is required' });
  const result = db.reopenQuiz(req.params.id, newEndAt);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Quiz Attempt Real-time and Auto-submit Endpoints
router.post('/attempt/start', (req, res) => {
  const { userId = 'u-1', quizId } = req.body;
  if (!quizId) return res.status(400).json({ error: 'quizId is required' });

  // Deadline & Availability Validation
  const quiz = db.getQuizById(quizId);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  if (quiz.computedStatus === 'UPCOMING') {
    return res.status(403).json({
      error: 'This assessment is not available yet. It is scheduled to start on ' + (quiz.startAt || 'the specified date'),
      code: 'QUIZ_NOT_STARTED',
      startAt: quiz.startAt
    });
  }

  if (quiz.computedStatus === 'CLOSED') {
    return res.status(403).json({
      error: 'This assessment deadline has passed or the examination has been closed by administration.',
      code: 'QUIZ_CLOSED',
      endAt: quiz.endAt
    });
  }

  if (quiz.computedStatus === 'DRAFT') {
    return res.status(403).json({
      error: 'This assessment is currently in draft mode and not available for officials.',
      code: 'QUIZ_DRAFT'
    });
  }

  const attempt = db.createOrGetActiveQuizAttempt(userId, quizId);
  res.json({ success: true, attempt });
});

router.post('/attempt/answer', (req, res) => {
  const { attemptId, questionId, selectedAnswer } = req.body;
  if (!attemptId || !questionId) return res.status(400).json({ error: 'attemptId and questionId required' });
  const attempt = db.updateQuizAttemptAnswer(attemptId, questionId, selectedAnswer !== undefined ? selectedAnswer : null);
  res.json({ success: !!attempt, attempt });
});

router.post('/attempt/submit', (req, res) => {
  const {
    attemptId,
    quizId,
    userId = 'u-1',
    userAnswers = {},
    submissionType = 'Manual',
    submissionReason = 'MANUAL_SUBMISSION',
    timeSpentSeconds
  } = req.body;

  if (!quizId) return res.status(400).json({ error: 'quizId is required' });

  try {
    const attempt = db.finalizeQuizAttempt({
      attemptId,
      quizId,
      userId,
      answers: userAnswers,
      submissionType,
      submissionReason,
      timeSpentSeconds
    });

    res.json({
      success: true,
      attempt,
      score: attempt.score,
      correctCount: attempt.correctCount,
      incorrectCount: attempt.incorrectCount,
      unansweredCount: attempt.unansweredCount,
      totalQuestions: attempt.totalQuestions,
      submissionType: attempt.submissionType,
      submissionReason: attempt.submissionReason,
      questionResults: attempt.questionResults,
      aiFeedback: attempt.aiFeedback
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/attempt/active/:userId/:quizId', (req, res) => {
  const attempt = db.getActiveQuizAttempt(req.params.userId, req.params.quizId);
  res.json({ attempt: attempt || null });
});

router.get('/attempt/:attemptId', (req, res) => {
  const attempt = db.getQuizAttemptById(req.params.attemptId);
  if (!attempt) return res.status(404).json({ error: 'Attempt not found' });
  res.json({ attempt });
});

router.get('/:id', (req, res) => {
  const quiz = db.getQuizById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json({ quiz });
});

router.put('/:id', (req, res) => {
  const updated = db.updateQuiz(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Quiz not found' });
  res.json({ success: true, quiz: updated });
});

router.delete('/:id', (req, res) => {
  const success = db.deleteQuiz(req.params.id);
  res.json({ success });
});

router.post('/:id/submit', (req, res) => {
  const {
    userId = 'u-1',
    userAnswers,
    submissionType = 'Manual',
    submissionReason = 'MANUAL_SUBMISSION',
    attemptId,
    timeSpentSeconds
  } = req.body;

  try {
    const attempt = db.finalizeQuizAttempt({
      attemptId,
      quizId: req.params.id,
      userId,
      answers: userAnswers,
      submissionType,
      submissionReason,
      timeSpentSeconds
    });

    res.json({
      score: attempt.score,
      correctCount: attempt.correctCount,
      incorrectCount: attempt.incorrectCount,
      unansweredCount: attempt.unansweredCount,
      totalQuestions: attempt.totalQuestions,
      submissionType: attempt.submissionType,
      submissionReason: attempt.submissionReason,
      questionResults: attempt.questionResults,
      aiFeedback: attempt.aiFeedback,
      attempt
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;

