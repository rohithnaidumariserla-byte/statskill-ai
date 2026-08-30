import { Router } from 'express';
import { db } from '../data/db';
import { aiService } from '../services/aiService';

const router = Router();

router.post('/start', (req, res) => {
  const { userId = 'u-1' } = req.body;
  const questions = db.getQuestionBank();

  res.json({
    assessmentId: `asmt-${Date.now()}`,
    userId,
    totalQuestions: questions.length,
    questions: questions.map(q => ({
      id: q.id,
      skill: q.skill,
      category: q.category,
      difficulty: q.difficulty,
      type: q.type,
      question: q.question,
      options: q.options,
      sourceRef: q.sourceRef
    }))
  });
});

router.post('/evaluate-question', (req, res) => {
  const { questionId, selectedAnswer } = req.body;
  const questions = db.getQuestionBank();
  const q = questions.find(item => item.id === questionId);

  if (!q) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const isCorrect = q.correctAnswer === selectedAnswer;

  res.json({
    isCorrect,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    skillTested: q.skill,
    difficulty: q.difficulty
  });
});

router.post('/submit', (req, res) => {
  const { userId = 'u-1', answers } = req.body;
  const questions = db.getQuestionBank();

  let correctCount = 0;
  const skillPerformance: Record<string, { total: number; correct: number }> = {};

  questions.forEach(q => {
    const userAns = answers ? answers[q.id] : undefined;
    const isCorrect = userAns !== undefined && userAns === q.correctAnswer;
    if (isCorrect) correctCount++;

    if (!skillPerformance[q.skill]) {
      skillPerformance[q.skill] = { total: 0, correct: 0 };
    }
    skillPerformance[q.skill].total += 1;
    if (isCorrect) skillPerformance[q.skill].correct += 1;
  });

  const total = questions.length;
  const overallPercentage = Math.round((correctCount / Math.max(1, total)) * 100);

  const updatedSkills: any[] = [];
  Object.keys(skillPerformance).forEach(skillName => {
    const perf = skillPerformance[skillName];
    const skillScore = Math.round((perf.correct / perf.total) * 100);
    const existing = db.getUserSkills(userId).find(s => s.skillName.toLowerCase() === skillName.toLowerCase());
    const blendedScore = existing ? Math.round(0.6 * skillScore + 0.4 * existing.competencyScore) : skillScore;

    const us = db.setUserSkillScore(userId, skillName, blendedScore);
    updatedSkills.push(us);
  });

  const aiFeedback = aiService.generateAssessmentFeedback(overallPercentage, 'Statistical & Technical Competencies', correctCount, total);

  db.addNotification({
    userId,
    title: 'Adaptive Assessment Completed',
    message: `You scored ${overallPercentage}% (${correctCount}/${total}). Competency index updated dynamically.`,
    type: 'assessment',
    actionUrl: '/skill-gaps'
  });

  res.json({
    score: overallPercentage,
    correctCount,
    incorrectCount: total - correctCount,
    totalQuestions: total,
    skillPerformance,
    updatedSkills,
    aiFeedback
  });
});

export default router;
