import { Router } from 'express';
import { db } from '../data/db';
import { aiService } from '../services/aiService';

const router = Router();

router.post('/start', (req, res) => {
  const { userId = 'u-1', skill, count = 5 } = req.body;
  let questions = db.getQuestionBank();

  if (skill && skill !== 'all') {
    const matching = questions.filter(q => q.skill.toLowerCase().includes(skill.toLowerCase()));
    if (matching.length > 0) questions = matching;
  }

  const selected = questions.slice(0, Math.min(count, questions.length));

  res.json({
    assessmentId: `asmt-${Date.now()}`,
    userId,
    totalQuestions: selected.length,
    questions: selected.map(q => ({
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

  const isCorrect = Number(selectedAnswer) === q.correctAnswer;

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
  const questions = db.getQuestionBank().slice(0, 5);

  let correctCount = 0;
  let answeredCount = 0;
  const skillPerformance: Record<string, { total: number; correct: number }> = {};
  const questionResults: any[] = [];

  questions.forEach(q => {
    const userAns = answers ? answers[q.id] : undefined;
    const isAnswered = userAns !== undefined && userAns !== null;
    if (isAnswered) answeredCount++;
    const isCorrect = isAnswered && Number(userAns) === q.correctAnswer;
    if (isCorrect) correctCount++;

    if (!skillPerformance[q.skill]) {
      skillPerformance[q.skill] = { total: 0, correct: 0 };
    }
    skillPerformance[q.skill].total += 1;
    if (isCorrect) skillPerformance[q.skill].correct += 1;

    questionResults.push({
      questionId: q.id,
      question: q.question,
      options: q.options,
      userAnswer: isAnswered ? Number(userAns) : null,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      sourceRef: q.sourceRef,
      skill: q.skill
    });
  });

  const total = questions.length;
  const unansweredCount = Math.max(0, total - answeredCount);
  const incorrectCount = Math.max(0, answeredCount - correctCount);
  const overallPercentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const updatedSkills: any[] = [];
  Object.keys(skillPerformance).forEach(skillName => {
    const perf = skillPerformance[skillName];
    const skillScore = Math.round((perf.correct / perf.total) * 100);
    const existing = db.getUserSkills(userId).find(s => s.skillName.toLowerCase() === skillName.toLowerCase());
    const blendedScore = existing ? Math.round(0.7 * skillScore + 0.3 * existing.competencyScore) : skillScore;

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
    attemptId: `asmt-${Date.now()}`,
    score: overallPercentage,
    correctCount,
    incorrectCount,
    answeredCount,
    unansweredCount,
    totalQuestions: total,
    questionResults,
    skillPerformance,
    updatedSkills,
    aiFeedback
  });
});

export default router;
