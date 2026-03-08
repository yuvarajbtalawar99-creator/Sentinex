import express from 'express';
import Notification from '../models/Notification';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { WeeklySummaryService } from '../services/WeeklySummaryService';

const router = express.Router();

// Get all notifications for the user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user?.userId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Mark notification as read
router.patch('/:id/read', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user?.userId },
            { readStatus: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// DEBUG/DEMO: Trigger a weekly summary generation for the current user
router.post('/trigger-summary', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const notification = await WeeklySummaryService.generateWeeklySummary(req.user!.userId);
        if (!notification) {
            return res.status(404).json({ message: 'No mood data found to generate summary' });
        }
        res.status(201).json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
