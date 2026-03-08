import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export interface NLPResponse {
    emotional_state: string;
    stress_level: number;
    burnout_risk: string;
    sentiment: string;
    recommendation: string;
    extracted_emotions: Record<string, number>;
}

export class NLPEngine {
    static async analyzeText(mood: string, intensity: number, note: string): Promise<NLPResponse> {
        try {
            const response = await axios.post(`${ML_SERVICE_URL}/api/v1/analyze-mood`, {
                mood,
                intensity,
                note
            });

            return response.data as NLPResponse;
        } catch (error) {
            console.error('NLP Engine error:', error);
            // Fallback
            return {
                emotional_state: `Feeling ${mood}`,
                stress_level: intensity * 10,
                burnout_risk: intensity > 7 ? 'medium' : 'low',
                sentiment: 'neutral',
                recommendation: 'Keep tracking your mood to see insights.',
                extracted_emotions: {}
            };
        }
    }
}
