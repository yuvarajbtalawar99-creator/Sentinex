import express from 'express';
import { authMiddleware, requireRole, AuthRequest } from '../middleware/auth';
import { OrgAggregationService } from '../services/OrgAggregationService';

const router = express.Router();

router.get('/metrics', authMiddleware, requireRole('government_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const orgId = req.user!.organizationId;
        if (!orgId) return res.status(400).json({ message: 'User not associated with an organization' });

        const metrics = await OrgAggregationService.getOrgMetrics(orgId.toString());

        res.json({
            ...metrics,
            regionalVolatility: [
                { region: 'Northern State', volatility: 25, trend: 'decreasing' },
                { region: 'Southern District', volatility: 45, trend: 'increasing' },
                { region: 'Central Capital', volatility: 55, trend: 'stable' },
                { region: 'Western Province', volatility: 30, trend: 'stable' },
            ],
            sectorSentiment: [
                { name: 'Public Education', value: 35 },
                { name: 'Healthcare Workers', value: 25 },
                { name: 'Infrastructure', value: 20 },
                { name: 'Emergency Services', value: 20 }
            ],
            populationVolatility: 34.2
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/heatmap', authMiddleware, requireRole('government_admin', 'super_admin'), async (req: AuthRequest, res) => {
    try {
        const orgId = req.user!.organizationId;
        if (!orgId) return res.status(400).json({ message: 'User not associated with an organization' });

        const heatmap = await OrgAggregationService.getOrgHeatmap(orgId.toString());
        res.json(heatmap);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/impact', authMiddleware, requireRole('government_admin', 'super_admin'), async (req: AuthRequest, res) => {
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
