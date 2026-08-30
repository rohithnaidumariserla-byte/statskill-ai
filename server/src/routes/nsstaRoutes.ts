import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/programmes', (req, res) => {
  const { mode, domain } = req.query;
  let programmes = db.getAllNSSTAProgrammes();

  if (mode && mode !== 'all') {
    programmes = programmes.filter(p => p.mode.toLowerCase() === (mode as string).toLowerCase());
  }

  if (domain && domain !== 'all') {
    programmes = programmes.filter(p => p.domain.toLowerCase().includes((domain as string).toLowerCase()));
  }

  res.json({
    programmes,
    totalCount: programmes.length,
    academy: 'National Statistical Systems Training Academy (NSSTA), Greater Noida'
  });
});

router.post('/register', (req, res) => {
  const { userId = 'u-1', programmeId } = req.body;
  const prog = db.getNSSTAProgrammeById(programmeId);
  if (!prog) return res.status(404).json({ error: 'Programme not found' });

  db.addNotification({
    userId,
    title: 'NSSTA Nomination Submitted',
    message: `Your nomination for "${prog.title}" has been submitted for Cadre Controlling Authority approval.`,
    type: 'nssta',
    actionUrl: '/nssta'
  });

  res.json({
    success: true,
    message: 'Nomination submitted successfully to NSSTA Training Division',
    programme: prog
  });
});

export default router;
