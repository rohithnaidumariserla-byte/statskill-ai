import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/profile', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const skills = db.getUserSkills(userId);
  const enrollments = db.getUserEnrollments(userId);

  res.json({
    user,
    skills,
    enrollments
  });
});

router.put('/profile', (req, res) => {
  const userId = (req.body.userId as string) || 'u-1';
  const updates = req.body;

  const updatedUser = db.updateUserProfile(userId, updates);
  if (!updatedUser) return res.status(404).json({ error: 'User not found' });

  if (updates.skills && Array.isArray(updates.skills)) {
    updates.skills.forEach((s: any) => {
      if (s.skillName && typeof s.competencyScore === 'number') {
        db.setUserSkillScore(userId, s.skillName, s.competencyScore, s.category);
      }
    });
  }

  res.json({
    success: true,
    user: updatedUser,
    skills: db.getUserSkills(userId)
  });
});

router.get('/skills', (req, res) => {
  const skills = db.getAllSkills();
  res.json({ skills });
});

router.get('/competencies', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const userSkills = db.getUserSkills(userId);
  res.json({ userSkills });
});

export default router;
