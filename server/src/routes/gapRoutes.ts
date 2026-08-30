import { Router } from 'express';
import { gapAnalysisService } from '../services/gapAnalysisService';

const router = Router();

router.get('/skill-gaps', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const report = gapAnalysisService.analyzeUserGaps(userId);
  if (!report) return res.status(404).json({ error: 'User not found' });
  res.json(report);
});

export default router;
