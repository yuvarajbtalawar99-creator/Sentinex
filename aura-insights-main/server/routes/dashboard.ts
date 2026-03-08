import express from 'express';
import MoodLog from '../models/MoodLog';
import RiskScore from '../models/RiskScore';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { subDays } from 'date-fns';
import { ForecastingEngine } from '../services/ForecastingEngine';
import { InterventionService } from '../services/InterventionService';
import { User } from '../models/User';
import { InsightEngine } from '../services/InsightEngine';
import { AlertEngine } from '../services/AlertEngine';

const router = express.Router();

// GET /api/dashboard/stats — Aggregated user stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const last30 = subDays(new Date(), 30);

        const logs = await MoodLog.find({ userId, createdAt: { $gte: last30 } });
        const risk = await RiskScore.findOne({ userId });

        const validLogs = logs.filter(l => typeof l.intensity === 'number' && !isNaN(l.intensity));
        const avgMood = validLogs.length > 0
            ? (validLogs.reduce((s, l) => s + l.intensity, 0) / validLogs.length).toFixed(1)
            : '5.0';

        const volatility = risk?.volatility?.toFixed(2) ?? '0.00';
        const burnout = risk ? `${Math.round(risk.burnoutProbability)}%` : '0%';
        const stability = risk ? `${Math.round(100 - risk.volatility * 100)}%` : '50%';
        const resilience = risk?.resilienceScore ?? 70;

        res.json({
            stats: [
                { label: 'Avg Mood', value: avgMood, trend: '+0.3', up: true },
                { label: 'Volatility Index', value: volatility, trend: '-0.08', up: false },
                { label: 'Burnout Probability', value: burnout, trend: '-5%', up: false },
                { label: 'Resilience Score', value: `${resilience}/100`, trend: '+2%', up: true },
            ],
            stressScore: risk?.stressIndex ?? 0.5,
            riskLevel: risk?.riskStatus ?? 'LOW',
            resilienceScore: resilience
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/dashboard/risk — Risk alerts for user with Structured Escalation
router.get('/risk', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const risk = await RiskScore.findOne({ userId });
        const last30 = subDays(new Date(), 30);
        const logs = await MoodLog.find({ userId, createdAt: { $gte: last30 } });

        const alerts: any[] = [];

        // Use InterventionService for structured recommendations
        const interventionLevel = risk?.interventionLevel || 'MINIMAL';
        const recommendations = InterventionService.getRecommendations(interventionLevel);

        if (risk) {
            if (risk.riskStatus === 'HIGH') {
                alerts.push({ id: 1, type: 'error', message: `Risk Status: ${risk.riskStatus} (Critical Intervention)`, time: 'Now' });
            } else if (risk.riskStatus === 'MEDIUM') {
                alerts.push({ id: 2, type: 'warning', message: 'Moderate stress patterns detected', time: 'Recent' });
            } else {
                alerts.push({ id: 4, type: 'info', message: 'Your emotional health is currently stable', time: 'Now' });
            }
        }

        if (logs.length === 0) {
            alerts.push({ id: 5, type: 'info', message: 'Start logging moods to activate risk monitoring', time: 'Now' });
        }

        res.json({
            alerts,
            recommendations,
            interventionLevel
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/dashboard/transparency — Data Transparency Panel
router.get('/transparency', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const user = await User.findById(req.user!.userId).select('monitoringEnabled');

        res.json({
            monitoringEnabled: user?.monitoringEnabled ?? true,
            analyzedData: [
                { field: 'Mood Scores', description: 'Your daily 1-10 inputs', status: 'Active' },
                { field: 'Journal Text', description: 'Sentiment & tone analysis', status: 'Active (Privacy Protected)' },
                { field: 'Pattern Analysis', description: 'Time-series forecasting', status: 'Active' },
            ],
            ignoredData: [
                { field: 'Personal Identity', description: 'Real name and contact info' },
                { field: 'Social Media', description: 'No external platform monitoring' },
                { field: 'Private Files', description: 'Device files and storage' },
            ],
            legalNotice: 'SENTINEX communicates confidence, not certainty. Predictions are advisory and not a medical diagnosis.'
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/dashboard/monitoring — Toggle Monitoring
router.post('/monitoring', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { enabled } = req.body;
        await User.findByIdAndUpdate(req.user!.userId, { monitoringEnabled: enabled });
        res.json({ success: true, monitoringEnabled: enabled });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/dashboard/emotions — Emotion distribution
router.get('/emotions', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const last30 = subDays(new Date(), 30);
        const logs = await MoodLog.find({ userId: req.user!.userId, createdAt: { $gte: last30 } });

        let totalScore = 0;
        const counts: Record<string, number> = {};

        logs.forEach(l => {
            if (l.aiInsights?.extracted_emotions) {
                Object.entries(l.aiInsights.extracted_emotions).forEach(([emotion, score]) => {
                    counts[emotion] = (counts[emotion] || 0) + (score as number);
                    totalScore += (score as number);
                });
            } else {
                // Fallback for older logs without AI insights
                counts[l.mood] = (counts[l.mood] || 0) + 100;
                totalScore += 100;
            }
        });

        const total = totalScore || 1;
        const colorMap: Record<string, string> = {
            anger: 'hsl(0, 70%, 50%)', anxiety: 'hsl(40, 95%, 55%)',
            sadness: 'hsl(210, 100%, 60%)', optimism: 'hsl(150, 80%, 45%)',
            motivation: 'hsl(280, 80%, 60%)',
            // fallbacks
            happy: 'hsl(150, 80%, 45%)', calm: 'hsl(192, 100%, 50%)',
            anxious: 'hsl(40, 95%, 55%)', stressed: 'hsl(340, 85%, 55%)',
            sad: 'hsl(210, 100%, 60%)', energetic: 'hsl(120, 60%, 50%)',
            tired: 'hsl(220, 30%, 40%)', frustrated: 'hsl(0, 70%, 50%)',
        };

        const distribution = Object.entries(counts).map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: Math.round((count / total) * 100),
            color: colorMap[name.toLowerCase()] || 'hsl(220, 30%, 40%)',
        })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);

        res.json(distribution);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/dashboard/forecast — 7-day emotional forecast with Confidence Indicator
router.get('/forecast', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const forecast = await ForecastingEngine.getForecast(userId);

        if (forecast && forecast.length > 0) {
            // Determine aggregate confidence label
            const avgConfidence = forecast.reduce((s, f) => s + f.confidence, 0) / forecast.length;
            let confidenceLabel = 'LOW';
            if (avgConfidence > 80) confidenceLabel = 'HIGH';
            else if (avgConfidence > 50) confidenceLabel = 'MEDIUM';

            return res.json({
                forecast,
                confidenceLabel,
                disclaimer: 'SENTINEX communicates confidence, not certainty.'
            });
        }

        // Fallback if forecast service fails or insufficient data
        const last14 = subDays(new Date(), 14);
        const logs = await MoodLog.find({ userId, createdAt: { $gte: last14 } });

        const avgScore = logs.length > 0
            ? logs.reduce((s, l) => s + l.intensity, 0) / logs.length
            : 5;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const fallbackForecast = days.map((day, i) => ({
            day,
            predicted: Math.max(1, Math.min(10, Math.round(avgScore + Math.sin(i) * 1.5))),
            confidence: Math.round(70 + Math.random() * 20),
        }));

        res.json({
            forecast: fallbackForecast,
            confidenceLabel: 'ESTIMATED',
            disclaimer: 'Insufficient history for high-confidence AI prediction.'
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/dashboard/insights — Fetch Qualitative AI Insights
router.get('/insights', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const insights = await InsightEngine.getInsights(req.user!.userId);
        res.json(insights);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/dashboard/alerts — Fetch Reactive Risk Alerts
router.get('/alerts', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const alerts = await AlertEngine.getAlerts(req.user!.userId);
        res.json(alerts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
