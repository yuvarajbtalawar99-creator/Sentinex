import MoodLog from '../models/MoodLog';
import Notification from '../models/Notification';
import { subDays, startOfDay } from 'date-fns';

export class WeeklySummaryService {
    /**
     * Generate a weekly summary for a specific user
     */
    static async generateWeeklySummary(userId: string) {
        const sevenDaysAgo = startOfDay(subDays(new Date(), 7));

        // Fetch all mood logs for the user from the last 7 days
        const logs = await MoodLog.find({
            userId,
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ createdAt: 1 });

        if (logs.length === 0) {
            return null; // No data to summarize
        }

        const avgScore = logs.reduce((acc, log) => acc + log.intensity, 0) / logs.length;
        const dominantEmotion = this.getDominantEmotion(logs);

        // Generate Insight Message
        const insight = this.generateInsightMessage(avgScore, dominantEmotion);

        // Create Notification
        const notification = new Notification({
            userId,
            type: 'SUMMARY',
            message: insight,
            readStatus: false,
            createdAt: new Date()
        });

        await notification.save();
        return notification;
    }

    private static getDominantEmotion(logs: any[]) {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            counts[log.emotionType] = (counts[log.emotionType] || 0) + 1;
        });
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    private static generateInsightMessage(avgScore: number, dominantEmotion: string) {
        let trend = avgScore > 7 ? 'positive' : avgScore > 4 ? 'stable' : 'a bit low';
        let advice = '';

        if (avgScore > 7) {
            advice = "You're doing great! Keep up the positive habits that are fueling your well-being.";
        } else if (avgScore > 4) {
            advice = "Your emotional state is stable. Consider incorporating more mindful breaks into your routine.";
        } else {
            advice = "We've noticed a dip in your mood. Remember to prioritize self-care and perhaps reach out to a friend.";
        }

        return `SENTINEX Insight: Your mood has been ${trend} this week, with ${dominantEmotion} being your most frequent emotion. ${advice}`;
    }
}
