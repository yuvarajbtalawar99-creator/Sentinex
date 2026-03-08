import express from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { OrgAggregationService } from '../services/OrgAggregationService';

const router = express.Router();

router.get('/metrics', authMiddleware, requireRole('university_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const orgId = req.user!.organizationId;
        if (!orgId) return res.status(400).json({ message: 'User not associated with an organization' });

        const metrics = await OrgAggregationService.getOrgMetrics(orgId.toString());

        // Custom additions for University
        res.json({
            ...metrics,
            semesterTrend: [
                { month: 'Sep', stress: 30, risk: 10 },
                { month: 'Oct', stress: 45, risk: 20 },
                { month: 'Nov', stress: 65, risk: 35 },
                { month: 'Dec', stress: 85, risk: 55 },
                { month: 'Jan', stress: 40, risk: 15 },
            ],
            examSpikes: [
                { period: 'Midterms', risk: 65, date: 'Oct 15-22' },
                { period: 'Finals', risk: 88, date: 'Dec 10-18' }
            ]
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/heatmap', authMiddleware, requireRole('university_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const orgId = req.user!.organizationId;
        if (!orgId) return res.status(400).json({ message: 'User not associated with an organization' });

        const heatmap = await OrgAggregationService.getOrgHeatmap(orgId.toString());
        res.json(heatmap);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/impact', authMiddleware, requireRole('university_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const orgId = req.user!.organizationId;
        if (!orgId) return res.status(400).json({ message: 'User not associated with an organization' });

        const impact = await OrgAggregationService.getImpactModeling(orgId.toString());
        res.json(impact);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
