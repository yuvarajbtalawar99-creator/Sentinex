import express from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { OrgAggregationService } from '../services/OrgAggregationService';

const router = express.Router();

router.get('/metrics', authMiddleware, requireRole('healthcare_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const orgId = req.user!.organizationId;
        if (!orgId) return res.status(400).json({ message: 'User not associated with an organization' });

        const metrics = await OrgAggregationService.getOrgMetrics(orgId.toString());

        res.json({
            ...metrics,
            shiftStress: [
                { shift: 'Morning', stress: 40, fatigue: 30 },
                { shift: 'Afternoon', stress: 65, fatigue: 55 },
                { shift: 'Night', stress: 85, fatigue: 88 },
            ],
            emergencyVolatility: 78.4
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/heatmap', authMiddleware, requireRole('healthcare_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const orgId = req.user!.organizationId;
        if (!orgId) return res.status(400).json({ message: 'User not associated with an organization' });

        const heatmap = await OrgAggregationService.getOrgHeatmap(orgId.toString());
        res.json(heatmap);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/impact', authMiddleware, requireRole('healthcare_admin', 'super_admin'), async (req: AuthRequest, res) => {
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
