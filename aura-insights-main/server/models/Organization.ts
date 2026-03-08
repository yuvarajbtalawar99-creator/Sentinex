import mongoose, { Schema, Document } from 'mongoose';

export type OrgType = 'university' | 'corporate' | 'healthcare' | 'government';

export interface IOrganization extends Document {
    name: string;
    orgCode: string; // Unique code for login
    type: OrgType;
    domain?: string;
    status: 'pending' | 'approved' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema({
    name: { type: String, required: true },
    orgCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: {
        type: String,
        required: true,
        enum: ['university', 'corporate', 'healthcare', 'government']
    },
    domain: { type: String, lowercase: true, trim: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'suspended'],
        default: 'approved' // Defaulting to approved for now to simplify demo
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
