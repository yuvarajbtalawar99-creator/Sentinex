import express from 'express';
import MoodLog from '../models/MoodLog';
import RiskScore from '../models/RiskScore';
import { User } from '../models/User';
import OrgAnalytics from '../models/OrgAnalytics';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { subDays } from 'date-fns';

const router = express.Router();

// GET /api/org/metrics
router.get('/metrics', authMiddleware, requireRole('org_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const allLogs = await MoodLog.find({ createdAt: { $gte: subDays(new Date(), 30) } });
        const allRisks = await RiskScore.find();

        const avgMood = allLogs.length > 0
            ? (allLogs.reduce((s, l) => s + l.intensity, 0) / allLogs.length).toFixed(1)
            : '5.0';

        const avgBurnout = allRisks.length > 0
            ? Math.round(allRisks.reduce((s, r) => s + r.burnoutProbability, 0) / allRisks.length)
            : 0;

        const climateIndex = Math.round(parseFloat(avgMood) * 10 + (100 - avgBurnout)) / 2;

        res.json({
            climateIndex: Math.min(100, Math.max(0, climateIndex)),
            climateStatus: climateIndex > 60 ? 'Stable' : climateIndex > 40 ? 'Moderate' : 'Critical',
            stats: [
                { label: 'Total Employees', value: totalUsers, trend: '+2%', up: true, weekVsLast: '+1.2%', monthVsLast: '+3.5%' },
                { label: 'Avg Mood', value: avgMood, trend: '+0.4', up: true, weekVsLast: '+0.5%', monthVsLast: '+1.2%' },
                { label: 'Burnout Risk', value: `${avgBurnout}%`, trend: '-5%', up: false, weekVsLast: '-2.1%', monthVsLast: '-4.8%' },
                { label: 'Privacy Score', value: 'A+', trend: 'Stable', up: true, weekVsLast: '0%', monthVsLast: '0%' },
            ],
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/org/heatmap
router.get('/heatmap', authMiddleware, requireRole('org_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const analytics = await OrgAnalytics.find().sort({ weekStart: -1 }).limit(10);

        const heatmap = analytics.map(a => ({
            department: a.orgId,
            stressLevel: Math.round(a.avgStress),
            burnoutRisk: Math.round(a.burnoutRate),
            moodAvg: +(10 - a.avgStress / 10).toFixed(1),
            headcount: a.dataPointsCount,
        }));
        res.json(heatmap);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/org/alerts
router.get('/alerts', authMiddleware, requireRole('org_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const highRiskUsers = await RiskScore.countDocuments({ riskStatus: 'HIGH' });
        const medRiskUsers = await RiskScore.countDocuments({ riskStatus: 'MEDIUM' });

        const alerts: any[] = [];
        if (highRiskUsers > 0) {
            alerts.push({ id: 1, type: 'error', target: 'System-Wide', message: `${highRiskUsers} user(s) flagged as HIGH risk`, time: 'Now' });
        }
        if (medRiskUsers > 0) {
            alerts.push({ id: 2, type: 'warning', target: 'System-Wide', message: `${medRiskUsers} user(s) at MEDIUM risk level`, time: 'Recent' });
        }
        if (alerts.length === 0) {
            alerts.push({ id: 3, type: 'info', target: 'System-Wide', message: 'No elevated risk signals detected', time: 'Now' });
        }

        res.json(alerts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/org/trends
router.get('/trends', authMiddleware, requireRole('org_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const last7 = subDays(new Date(), 7);
        const logs = await MoodLog.find({ createdAt: { $gte: last7 } }).sort({ createdAt: 1 });

        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const trends = dayNames.map((day, idx) => {
            const dayLogs = logs.filter(l => l.createdAt.getDay() === (idx + 1) % 7);
            const avgScore = dayLogs.length > 0
                ? dayLogs.reduce((s, l) => s + l.intensity, 0) / dayLogs.length
                : 5;
            return {
                day,
                stress: Math.round(avgScore * 10),
                mood: Math.round(avgScore),
                burnout: Math.round(Math.max(0, (10 - avgScore) * 6)),
            };
        });

        res.json(trends);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
