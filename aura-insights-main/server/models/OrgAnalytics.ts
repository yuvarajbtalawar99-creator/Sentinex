import mongoose, { Schema, Document } from 'mongoose';

export interface IOrgAnalytics extends Document {
    orgId: string;
    avgStress: number;
    volatilityIndex: number;
    burnoutRate: number;
    dataPointsCount: number;
    weekStart: Date;
    createdAt: Date;
}

const OrgAnalyticsSchema: Schema = new Schema({
    orgId: { type: String, required: true },
    avgStress: { type: Number, required: true },
    volatilityIndex: { type: Number, required: true },
    burnoutRate: { type: Number, required: true },
    dataPointsCount: { type: Number, required: true },
    weekStart: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Compound index for uniqueness like in SQL
OrgAnalyticsSchema.index({ orgId: 1, weekStart: 1 }, { unique: true });

export default mongoose.model<IOrgAnalytics>('OrgAnalytics', OrgAnalyticsSchema);
