import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['individual', 'university_admin', 'corporate_admin', 'healthcare_admin', 'government_admin', 'super_admin'],
        default: 'individual'
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        default: null
    },
    orgCode: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: 'General'
    },
    monitoringEnabled: {
        type: Boolean,
        default: true
    },
    isOptedIn: {
        type: Boolean,
        default: true
    },
    privacySettings: {
        counselorAccess: { type: Boolean, default: false },
        aggregateAnalytics: { type: Boolean, default: true },
        aiTraining: { type: Boolean, default: false }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function (this: any) {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to check password
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', UserSchema);
