import { Router } from 'express';
import { db } from '../data/db';
import { recommendationEngine } from '../services/recommendationEngine';

const router = Router();

router.get('/courses', (req, res) => {
  const { skill, difficulty, search } = req.query;
  const userId = (req.query.userId as string) || 'u-1';
  const user = db.getUserById(userId);
  const userSkills = db.getUserSkills(userId);
  const benchmark = (user ? db.getRoleBenchmark(user.designation) : null) || db.getAllRoleBenchmarks()[0];

  let courses = db.getAllCourses();

  if (skill && skill !== 'all') {
    courses = courses.filter(c => c.skill.toLowerCase() === (skill as string).toLowerCase() || c.skillCategory.toLowerCase() === (skill as string).toLowerCase());
  }

  if (difficulty && difficulty !== 'all') {
    courses = courses.filter(c => c.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    courses = courses.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.skill.toLowerCase().includes(q));
  }

  const enriched = courses.map(course => {
    if (user) {
      return recommendationEngine.calculateCourseRecommendation(course, user, userSkills, benchmark);
    }
    return {
      course,
      matchScore: 85,
      reason: 'Aligned with official statistical modernization.',
      isEnrolled: false,
      progress: 0,
      breakdown: { skillGapWeight: 30, roleRelevanceWeight: 25, previousLearningWeight: 15, careerRequirementWeight: 10, deptPriorityWeight: 10, emergingDemandWeight: 5 }
    };
  });

  res.json({
    courses: enriched,
    _apiNotice: 'MOCK iGOT KARMAYOGI API INTEGRATION LAYER (Ready for live government SSO/API plug-in)'
  });
});

router.post('/enroll', (req, res) => {
  const { userId = 'u-1', courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });

  const enrollment = db.enrollCourse(userId, courseId);
  const course = db.getCourseById(courseId);

  db.addNotification({
    userId,
    title: 'Course Enrolled Successfully',
    message: `You are now enrolled in "${course ? course.title : 'iGOT Course'}".`,
    type: 'course',
    actionUrl: '/courses'
  });

  res.json({ success: true, enrollment, course });
});

router.post('/progress', (req, res) => {
  const { userId = 'u-1', courseId, progress } = req.body;
  const updated = db.updateEnrollmentProgress(userId, courseId, progress);
  if (!updated) return res.status(404).json({ error: 'Enrollment not found' });
  res.json({ success: true, enrollment: updated });
});

router.post('/courses', (req, res) => {
  try {
    const course = db.addCourse(req.body);
    res.status(201).json({ success: true, course });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/courses/:id', (req, res) => {
  try {
    const updated = db.updateCourse(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true, course: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/courses/:id', (req, res) => {
  try {
    const deleted = db.deleteCourse(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/complete', (req, res) => {
  const { userId = 'u-1', courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });

  try {
    const result = db.completeCourse(userId, courseId);
    res.json({ success: true, ...result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/practice/:skill', (req, res) => {
  const { skill } = req.params;
  const questions = db.getPracticeQuestionsBySkill(skill);
  res.json({ skill, questions });
});

router.post('/practice/submit', (req, res) => {
  const { userId = 'u-1', skillName, selectedAnswers = {} } = req.body;
  if (!skillName) return res.status(400).json({ error: 'skillName required' });

  try {
    const result = db.submitPracticeQuiz(userId, skillName, selectedAnswers);
    res.json({ success: true, result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/practice/history', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const history = db.getPracticeHistory(userId);
  res.json({ history });
});

router.patch('/courses/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const updated = db.updateCourse(req.params.id, { status });
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json({ success: true, course: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
