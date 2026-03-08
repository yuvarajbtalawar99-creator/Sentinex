import RiskScore from '../models/RiskScore';
import MoodLog from '../models/MoodLog';

export interface Alert {
    type: 'BURNOUT' | 'ANOMALY' | 'STRESS';
    severity: 'HIGH' | 'MEDIUM';
    message: string;
}

export class AlertEngine {
    static async getAlerts(userId: string): Promise<Alert[]> {
        const alerts: Alert[] = [];
        const risk = await RiskScore.findOne({ userId });
        const logs = await MoodLog.find({ userId }).sort({ createdAt: -1 }).limit(2);

        if (!risk) return [];

        // Rule: Burnout Risk
        if (risk.burnoutProbability > 70) {
            alerts.push({
                type: 'BURNOUT',
                severity: 'HIGH',
                message: 'CRITICAL: High Burnout Probability detected. Immediate intervention recommended.'
            });
        } else if (risk.burnoutProbability > 40) {
            alerts.push({
                type: 'BURNOUT',
                severity: 'MEDIUM',
                message: 'Caution: Rising burnout patterns detected in your profile.'
            });
        }

        // Rule: Anomaly detection (sudden drop)
        if (logs.length >= 2) {
            const drop = logs[1].intensity - logs[0].intensity;
            if (drop >= 4) {
                alerts.push({
                    type: 'ANOMALY',
                    severity: 'HIGH',
                    message: `ANOMALY: Sudden drop of ${drop} points detected. Pattern requires attention.`
                });
            }
        }

        return alerts;
    }
}
