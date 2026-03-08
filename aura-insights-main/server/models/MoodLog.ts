import mongoose, { Schema, Document } from 'mongoose';
import { RiskEngine } from '../services/RiskEngine';

export interface IMoodLog extends Document {
    userId: mongoose.Types.ObjectId;
    mood: string;
    intensity: number;
    note: string;
    aiInsights: {
        emotional_state: string;
        stress_level: number;
        burnout_risk: string;
        sentiment: string;
        recommendation: string;
        extracted_emotions: Record<string, number>;
    };
    timestamp: Date;
    createdAt: Date;
}

const MoodLogSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true },
    intensity: { type: Number, required: true, min: 1, max: 10 },
    note: { type: String }, // AES-256 encrypted string
    aiInsights: {
        emotional_state: { type: String },
        stress_level: { type: Number },
        burnout_risk: { type: String },
        sentiment: { type: String },
        recommendation: { type: String },
        extracted_emotions: { type: Schema.Types.Mixed },
    },
    timestamp: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

MoodLogSchema.post('save', function (doc: any) {
    // Asynchronously update the risk score based on the new log
    RiskEngine.recalculateUserRisk(doc.userId.toString()).catch(err => {
        console.error('Error triggering RiskEngine recalculation:', err);
    });
});

export default mongoose.model<IMoodLog>('MoodLog', MoodLogSchema);
