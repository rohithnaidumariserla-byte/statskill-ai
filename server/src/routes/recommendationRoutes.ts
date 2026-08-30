import { Router } from 'express';
import { recommendationEngine } from '../services/recommendationEngine';

const router = Router();

router.get('/recommendations', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const recommendations = recommendationEngine.getRecommendationsForUser(userId);
  res.json({ recommendations });
});

export default router;
