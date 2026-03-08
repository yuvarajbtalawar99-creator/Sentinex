import MoodLog from '../models/MoodLog';
import RiskScore from '../models/RiskScore';

export class InsightEngine {
    static async getInsights(userId: string): Promise<string[]> {
        const insights: string[] = [];

        // 1. Fetch data
        const logs = await MoodLog.find({ userId }).sort({ createdAt: -1 }).limit(10);
        const risk = await RiskScore.findOne({ userId });

        if (logs.length < 3) {
            return ["Collecting more data to generate personalized neural insights..."];
        }

        // Rule: Stress increasing
        const recentAvg = logs.slice(0, 3).reduce((s, l) => s + l.intensity, 0) / 3;
        const previousAvg = logs.slice(3, 6).reduce((s, l) => s + l.intensity, 0) / 3;

        if (recentAvg < previousAvg - 1) {
            insights.push("Stress trend increasing over the last 3 days.");
        } else if (recentAvg > previousAvg + 1) {
            insights.push("Emotional stability showing positive recovery patterns.");
        }

        // Rule: Volatility
        if (risk && risk.volatility > 0.6) {
            insights.push("High emotional volatility detected. Consider deep-work isolation.");
        }

        // Rule: Consistency
        const today = new Date().toDateString();
        const loggedToday = logs.some(l => l.createdAt.toDateString() === today);
        if (!loggedToday) {
            insights.push("Your baseline sync is incomplete for today. Log your mood for better accuracy.");
        }

        // Rule: ESI
        if (risk && risk.emotionalStabilityIndex > 80) {
            insights.push("Optimal emotional resilience detected. High-focus tasks recommended.");
        }

        // Add AI generated specific insights from the most recent log
        if (logs.length > 0 && logs[0].aiInsights) {
            const ai = logs[0].aiInsights;
            if (ai.emotional_state && ai.recommendation) {
                insights.unshift(`AI Insight: ${ai.emotional_state} ${ai.recommendation}`);
            } else if (ai.emotional_state) {
                insights.unshift(`AI Insight: ${ai.emotional_state}`);
            } else if (ai.recommendation) {
                insights.unshift(`AI Suggestion: ${ai.recommendation}`);
            }
        }

        return insights.length > 0 ? insights : ["Emotional baseline is currently stable."];
    }
}
