import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/analytics', (req, res) => {
  const futureSkills = db.getFutureSkillPredictions();
  const departmentAnalytics = db.getDepartmentAnalytics();
  const trainingEffectiveness = db.getTrainingEffectiveness();
  const quizStats = db.getAdminQuizStats();

  // 8 Core Statistical Competencies Gap Analysis
  const coreCompetencyGaps = [
    {
      competency: 'Sampling & Survey Design',
      currentScore: 72,
      requiredScore: 80,
      gap: 8,
      proficiencyLevel: 'Proficient',
      status: 'Good Progress',
      officialsAffected: 1840,
      severity: 'Low',
      category: 'Statistical Methodology'
    },
    {
      competency: 'Statistical Analysis',
      currentScore: 69,
      requiredScore: 78,
      gap: 9,
      proficiencyLevel: 'Intermediate',
      status: 'Good Progress',
      officialsAffected: 2150,
      severity: 'Low',
      category: 'Statistical Theory'
    },
    {
      competency: 'Statistical Computing',
      currentScore: 46,
      requiredScore: 75,
      gap: 29,
      proficiencyLevel: 'Developing',
      status: 'Needs Improvement',
      officialsAffected: 4850,
      severity: 'High',
      category: 'Computational & Programming'
    },
    {
      competency: 'Data Visualization',
      currentScore: 55,
      requiredScore: 70,
      gap: 15,
      proficiencyLevel: 'Developing',
      status: 'Needs Improvement',
      officialsAffected: 3620,
      severity: 'Medium',
      category: 'Analytics & Dissemination'
    },
    {
      competency: 'Survey Methodology',
      currentScore: 48,
      requiredScore: 75,
      gap: 27,
      proficiencyLevel: 'Developing',
      status: 'Critical Attention',
      officialsAffected: 4320,
      severity: 'High',
      category: 'Field & Survey Operations'
    },
    {
      competency: 'Statistical Inference',
      currentScore: 64,
      requiredScore: 75,
      gap: 11,
      proficiencyLevel: 'Intermediate',
      status: 'Moderate',
      officialsAffected: 2890,
      severity: 'Medium',
      category: 'Applied Statistics'
    },
    {
      competency: 'Data Quality',
      currentScore: 62,
      requiredScore: 75,
      gap: 13,
      proficiencyLevel: 'Intermediate',
      status: 'Moderate',
      officialsAffected: 3100,
      severity: 'Medium',
      category: 'Governance & Auditing'
    },
    {
      competency: 'Official Statistics Concepts',
      currentScore: 78,
      requiredScore: 82,
      gap: 4,
      proficiencyLevel: 'Proficient',
      status: 'Well Aligned',
      officialsAffected: 950,
      severity: 'Mastered',
      category: 'Institutional Framework'
    }
  ];

  // Critical Skill Gaps with Actions
  const criticalSkillGaps = [
    {
      competency: 'Survey Methodology',
      currentLevel: 48,
      requiredLevel: 75,
      gap: 27,
      severity: 'Critical Gap',
      recommendedAction: 'Advanced Survey Methodology & CAPI Protocols Training',
      affectedCadre: 'Field Operations & Survey Division (4,320 Officers)',
      priority: 'Urgent'
    },
    {
      competency: 'Statistical Computing',
      currentLevel: 46,
      requiredLevel: 75,
      gap: 29,
      severity: 'High Gap',
      recommendedAction: 'Python for Statistical Modeling & Big Data Bootcamps',
      affectedCadre: 'Data Processing & Economic Statistics (4,850 Officers)',
      priority: 'High'
    },
    {
      competency: 'Data Visualization',
      currentLevel: 55,
      requiredLevel: 70,
      gap: 15,
      severity: 'Moderate Gap',
      recommendedAction: 'Official Statistical Dashboards with PowerBI & R-Shiny',
      affectedCadre: 'Dissemination & Publications Division (3,620 Officers)',
      priority: 'Medium'
    },
    {
      competency: 'AI & Machine Learning',
      currentLevel: 34,
      requiredLevel: 65,
      gap: 31,
      severity: 'Emerging Gap',
      recommendedAction: 'NSSTA AI-Driven Modernization Specialization',
      affectedCadre: 'All Statistical Cadres (7,720 Officers)',
      priority: 'High'
    }
  ];

  res.json({
    workforceOverview: {
      totalOfficials: 12450,
      officialsAssessed: 10820,
      averageCompetency: 68,
      officialsRequiringUpskilling: 3840,
      criticalSkillGapsCount: 4,
      activeAssessments: quizStats.active || 3,
      trainingCompletionRate: 78,
      totalTrainingHours: '3.2M',
      coursesCompleted: 78420
    },
    coreCompetencyGaps,
    criticalSkillGaps,
    skillDistribution: coreCompetencyGaps.map(c => ({
      name: c.competency,
      score: c.currentScore,
      benchmark: c.requiredScore,
      gap: c.gap,
      officialsCount: c.officialsAffected
    })),
    departmentAnalytics,
    trainingEffectiveness,
    futureSkills
  });
});

router.get('/skill-gaps', (req, res) => {
  res.json({
    organizationGaps: [
      { skill: 'Survey Methodology & CAPI Protocols', gapPercent: 27, severity: 'High', cadre: 'Field Operations Division', affectedOfficials: 4320 },
      { skill: 'Statistical Computing & Python', gapPercent: 29, severity: 'High', cadre: 'Data Processing Division', affectedOfficials: 4850 },
      { skill: 'Data Visualization & PowerBI', gapPercent: 15, severity: 'Medium', cadre: 'Dissemination Division', affectedOfficials: 3620 },
      { skill: 'AI/ML for Official Statistics', gapPercent: 31, severity: 'High', cadre: 'All Statistical Cadres', affectedOfficials: 7720 },
      { skill: 'Data Quality & National NQAF', gapPercent: 13, severity: 'Medium', cadre: 'Coordination & Audit Cadre', affectedOfficials: 3100 }
    ]
  });
});

router.get('/future-skills', (req, res) => {
  const futureSkills = db.getFutureSkillPredictions();
  res.json({ futureSkills });
});

router.get('/competency-frameworks', (req, res) => {
  const frameworks = db.getAllRoleBenchmarks();
  res.json({ frameworks });
});

router.get('/courses', (req, res) => {
  res.json({ courses: db.getAllCourses() });
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

router.get('/skills', (req, res) => {
  res.json({ skills: db.getSkills() });
});

router.post('/skills', (req, res) => {
  try {
    const skill = db.addSkill(req.body);
    res.status(201).json({ success: true, skill });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/skills/:id', (req, res) => {
  try {
    const updated = db.updateSkill(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Skill not found' });
    res.json({ success: true, skill: updated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/skills/:id', (req, res) => {
  try {
    const deleted = db.deleteSkill(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Skill not found' });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/benchmarks/skill', (req, res) => {
  const { roleName = 'Statistical Officer', skillId, requiredScore } = req.body;
  if (!skillId || requiredScore === undefined) {
    return res.status(400).json({ error: 'skillId and requiredScore required' });
  }
  const ok = db.updateRoleBenchmarkSkill(roleName, skillId, Number(requiredScore));
  res.json({ success: ok, frameworks: db.getAllRoleBenchmarks() });
});

export default router;
