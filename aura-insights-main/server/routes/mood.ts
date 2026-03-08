import express from 'express';
import MoodLog from '../models/MoodLog';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { subDays, format, startOfWeek, endOfWeek } from 'date-fns';
import { NLPEngine } from '../services/NLPEngine';

const router = express.Router();

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'); // Must be 32 bytes
const IV_LENGTH = 16; // For AES, this is always 16

function encryptText(text: string) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptText(text: string) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift()!, 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// POST /api/mood/log-mood — Log a mood entry
router.post('/log-mood', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { mood, intensity, note, timestamp } = req.body;

        let encryptedNote = '';
        let aiInsights = null;

        if (note && note.length > 0) {
            encryptedNote = encryptText(note);
            // Pass raw text to ML for analysis, but save encrypted to DB
            aiInsights = await NLPEngine.analyzeText(mood, intensity, note);
        } else {
            // Default insights if no text provided
            aiInsights = {
                emotional_state: `Feeling ${mood}`,
                stress_level: intensity * 10,
                burnout_risk: intensity > 7 ? 'medium' : 'low',
                sentiment: 'neutral',
                recommendation: 'Track your mood consistently to see trends.',
                extracted_emotions: {}
            };
        }

        const log = new MoodLog({
            userId: req.user!.userId,
            mood,
            intensity,
            note: encryptedNote,
            aiInsights,
            timestamp: timestamp || new Date()
        });
        await log.save();
        res.status(201).json({ message: 'Mood logged successfully', log });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/mood/history?days=30
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const days = parseInt(req.query.days as string) || 30;
        const since = subDays(new Date(), days);
        const logs = await MoodLog.find({
            userId: req.user!.userId,
            createdAt: { $gte: since }
        }).sort({ createdAt: 1 });

        const history = logs.map(log => ({
            date: format(log.createdAt, 'MMM dd'),
            fullDate: log.createdAt,
            score: log.intensity,
            emotion: log.mood,
            sentiment: log.aiInsights?.sentiment === 'positive' ? 1 : log.aiInsights?.sentiment === 'negative' ? -1 : 0,
        }));

        res.json(history);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/mood/weekly — Weekly stress pattern
router.get('/weekly', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

        const logs = await MoodLog.find({
            userId: req.user!.userId,
            createdAt: { $gte: weekStart, $lte: weekEnd }
        }).sort({ createdAt: 1 });

        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyData = dayNames.map((day, idx) => {
            const dayLogs = logs.filter(l => l.createdAt.getDay() === (idx + 1) % 7);
            const avgScore = dayLogs.length > 0
                ? dayLogs.reduce((sum, l) => sum + l.intensity, 0) / dayLogs.length
                : 5;
            return {
                day,
                stress: Math.round(avgScore * 10),
                mood: Math.round(avgScore),
                burnout: Math.round(Math.max(0, (10 - avgScore) * 6)),
            };
        });

        res.json(weeklyData);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
