import mongoose, { Schema, Document } from 'mongoose';

export interface IRiskScore extends Document {
    userId: mongoose.Types.ObjectId;
    stressIndex: number;
    volatility: number;
    burnoutProbability: number;
    riskStatus: 'LOW' | 'MEDIUM' | 'HIGH';
    interventionLevel: 'MINIMAL' | 'MODERATE' | 'CRITICAL';
    resilienceScore: number;
    emotionalStabilityIndex: number;
    emotionalAcceleration: number;
    updatedAt: Date;
}

const RiskScoreSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    stressIndex: { type: Number, default: 0 },
    volatility: { type: Number, default: 0 },
    burnoutProbability: { type: Number, default: 0 },
    riskStatus: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    interventionLevel: { type: String, enum: ['MINIMAL', 'MODERATE', 'CRITICAL'], default: 'MINIMAL' },
    resilienceScore: { type: Number, default: 70 },
    emotionalStabilityIndex: { type: Number, default: 75 },
    emotionalAcceleration: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRiskScore>('RiskScore', RiskScoreSchema);
