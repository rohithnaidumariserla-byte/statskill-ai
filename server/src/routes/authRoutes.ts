import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.post('/login', (req, res) => {
  const { email, role } = req.body;
  let user = email ? db.getUserByEmail(email) : null;
  if (!user && role) {
    const allUsers = [db.getUserById('u-1'), db.getUserById('u-2')].filter(Boolean);
    user = allUsers.find(u => u?.role === role) || null;
  }
  if (!user) {
    return res.status(404).json({ error: 'User not found in demo records' });
  }
  res.json({ success: true, user });
});

router.get('/me', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const user = db.getUserById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

router.post('/switch-user', (req, res) => {
  const { userId } = req.body;
  const user = db.getUserById(userId || 'u-1');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, user });
});

export default router;
