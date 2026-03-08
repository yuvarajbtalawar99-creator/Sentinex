import axios from 'axios';
import MoodLog from '../models/MoodLog';
import { subDays } from 'date-fns';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export interface ForecastDay {
    day: string;
    predicted: number;
    confidence: number;
}

export class ForecastingEngine {
    static async getForecast(userId: string): Promise<ForecastDay[]> {
        try {
            // 1. Fetch user mood history (last 60 days for better Prophet fitting)
            const sixtyDaysAgo = subDays(new Date(), 60);
            const logs = await MoodLog.find({
                userId,
                createdAt: { $gte: sixtyDaysAgo }
            }).sort({ createdAt: 1 });

            if (logs.length < 5) {
                // Not enough data for real forecasting, return empty to trigger fallback
                return [];
            }

            // 2. Format history for ML service
            const history = logs.map(log => ({
                ds: log.createdAt.toISOString(),
                y: log.intensity
            }));

            // 3. Call ML service
            const response = await axios.post(`${ML_SERVICE_URL}/api/v1/predict`, {
                userId,
                history
            });

            return response.data as ForecastDay[];
        } catch (error) {
            console.error('Forecasting Engine error:', error);
            return [];
        }
    }
}
