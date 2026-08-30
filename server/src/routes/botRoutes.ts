import { Router } from 'express';
import { aiService } from '../services/aiService';

const router = Router();

router.post('/chat', async (req, res) => {
  try {
    const { message, userId = 'u-1', conversationHistory = [], sessionState } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const response = await aiService.getChatbotResponse(message, {
      userId,
      conversationHistory,
      sessionState
    });

    res.json(response);
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;
