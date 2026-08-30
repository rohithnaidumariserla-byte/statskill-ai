import { Router } from 'express';
import { db } from '../data/db';

const router = Router();

router.get('/notifications', (req, res) => {
  const userId = (req.query.userId as string) || 'u-1';
  const notifications = db.getUserNotifications(userId);
  const unreadCount = notifications.filter(n => !n.read).length;
  res.json({ notifications, unreadCount });
});

router.post('/notifications/:id/read', (req, res) => {
  db.markNotificationRead(req.params.id);
  res.json({ success: true });
});

router.post('/notifications/read-all', (req, res) => {
  const { userId = 'u-1' } = req.body;
  db.markAllNotificationsRead(userId);
  res.json({ success: true });
});

export default router;
