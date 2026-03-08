import axios from 'axios';
import RiskScore from '../models/RiskScore';
import MoodLog from '../models/MoodLog';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export class RiskEngine {
    /**
     * Recalculates the risk score for a user by fetching their history
     * and sending it to the ML microservice.
     */
    static async recalculateUserRisk(userId: string): Promise<void> {
        try {
            // 1. Fetch the user's last 30 mood logs (same window as dashboard)
            const logs = await MoodLog.find({ userId })
                .sort({ createdAt: -1 })
                .limit(30);

            // 2. Format logs for the ML service
            const formattedLogs = logs.map(log => ({
                mood: log.mood,
                intensity: log.intensity,
                sentimentScore: log.aiInsights?.sentiment === 'positive' ? 1 : log.aiInsights?.sentiment === 'negative' ? -1 : 0,
                createdAt: log.createdAt.toISOString(),
            }));

            // 3. Call the Python ML Microservice
            const response = await axios.post(`${ML_SERVICE_URL}/api/v1/risk-score`, {
                userId,
                logs: formattedLogs
            });

            const { stressIndex, volatility, burnoutProbability, riskStatus } = response.data;

            // 4. Calculate Resilience Score and Intervention Level
            // Resilience = (1 - Volatility) * 50 + (AvgMood * 5)
            const avgMood = logs.length > 0 ? logs.reduce((sum, l) => sum + l.intensity, 0) / logs.length : 5;
            const resilienceScore = Math.max(0, Math.min(100, Math.round((1 - volatility) * 50 + (avgMood * 5))));

            const interventionLevel = this.determineInterventionLevel(riskStatus, stressIndex, burnoutProbability);

            // 5. Calculate Emotional Stability Index (ESI)
            // ESI = 100 - (Volatility * 50) - (StressIndex * 30) + (AvgMood * 2) - Clamp at 0-100
            const emotionalStabilityIndex = Math.max(0, Math.min(100, Math.round(100 - (volatility * 50) - (stressIndex * 100 * 0.3) + (avgMood * 2))));

            // 6. Calculate Emotional Acceleration
            // Acceleration = (RecentStress - PreviousStress) / Time
            const emotionalAcceleration = this.calculateAcceleration(logs);

            // 7. Detection Anomaly
            const hasAnomaly = this.detectAnomaly(logs);

            // 8. Update the RiskScore in MongoDB
            await RiskScore.findOneAndUpdate(
                { userId },
                {
                    stressIndex,
                    volatility,
                    burnoutProbability,
                    riskStatus,
                    interventionLevel,
                    resilienceScore,
                    emotionalStabilityIndex,
                    emotionalAcceleration,
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );

            console.log(`[RiskEngine] Successfully updated risk score and resilience for user ${userId}`);
        } catch (error) {
            console.error(`[RiskEngine] Failed to recalculate risk for user ${userId}:`, error);
        }
    }

    private static determineInterventionLevel(riskStatus: string, stress: number, burnout: number): 'MINIMAL' | 'MODERATE' | 'CRITICAL' {
        if (riskStatus === 'HIGH' || stress > 0.8 || burnout > 70) return 'CRITICAL';
        if (stress > 0.5 || burnout > 40) return 'MODERATE';
        return 'MINIMAL';
    }

    private static calculateAcceleration(logs: any[]): number {
        if (logs.length < 5) return 0;
        const recent = logs.slice(0, 3).reduce((s, l) => s + l.intensity, 0) / 3;
        const previous = logs.slice(3, 10).reduce((s, l) => s + l.intensity, 0) / (logs.length >= 10 ? 7 : logs.length - 3);
        return parseFloat((recent - previous).toFixed(2));
    }

    private static detectAnomaly(logs: any[]): boolean {
        if (logs.length < 2) return false;
        const current = logs[0].intensity;
        const last = logs[1].intensity;
        return (last - current) >= 4; // Sudden drop of 4 or more points
    }
}
