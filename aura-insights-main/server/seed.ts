import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from './models/User';
import MoodLog from './models/MoodLog';
import RiskScore from './models/RiskScore';
import OrgAnalytics from './models/OrgAnalytics';

dotenv.config({ path: path.join(__dirname, '../.env') });

const EMOTIONS = ['happy', 'calm', 'anxious', 'stressed', 'sad', 'energetic', 'tired', 'frustrated'];

import { Organization } from './models/Organization';

async function seed() {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || '', {
            serverSelectionTimeoutMS: 15000,
            tls: true
        });
        console.log('✅ Connected.');

        // Clear existing data
        await Organization.deleteMany({});
        await User.deleteMany({});
        await MoodLog.deleteMany({});
        await RiskScore.deleteMany({});

        console.log('📋 Creating Organizations...');
        const orgs = await Organization.insertMany([
            { name: 'Stanford University', orgCode: 'STANFORD', type: 'university', status: 'approved' },
            { name: 'Google Inc', orgCode: 'GOOGLE', type: 'corporate', status: 'approved' },
            { name: 'Mayo Clinic', orgCode: 'MAYO', type: 'healthcare', status: 'approved' },
            { name: 'City Government', orgCode: 'GOV1', type: 'government', status: 'approved' },
        ]);
        console.log(`  ✅ Created ${orgs.length} organizations`);

        console.log('📋 Creating Users...');
        const userPromises = orgs.map(async (org) => {
            const role = `${org.type}_admin`;
            const user = new User({
                email: `admin@${org.orgCode.toLowerCase()}.edu`,
                password: 'password123',
                fullName: `${org.name} Admin`,
                role: role,
                organizationId: org._id,
                orgCode: org.orgCode
            });
            return user.save();
        });

        // Add a super admin
        userPromises.push((async () => {
            const user = new User({
                email: 'superadmin@sentinex.ai',
                password: 'password123',
                fullName: 'Super Admin',
                role: 'super_admin'
            });
            return user.save();
        })());

        // Add an individual user
        userPromises.push((async () => {
            const user = new User({
                email: 'user@gmail.com',
                password: 'password123',
                fullName: 'Regular User',
                role: 'individual'
            });
            return user.save();
        })());

        const users = await Promise.all(userPromises);
        console.log(`  ✅ Created ${users.length} users`);

        for (const user of users) {
            // Generate 30 days of mood logs
            const moodLogs = [];
            for (let i = 29; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                date.setHours(Math.floor(Math.random() * 12) + 8);

                const baseScore = 5 + Math.sin(i / 5) * 2;
                const score = Math.max(1, Math.min(10, Math.round(baseScore + (Math.random() - 0.5) * 3)));
                const emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];

                moodLogs.push({
                    userId: user._id,
                    intensity: score,
                    mood: emotion,
                    aiInsights: { sentiment: score > 5 ? 'positive' : score < 5 ? 'negative' : 'neutral' },
                    createdAt: date,
                });
            }

            await MoodLog.insertMany(moodLogs);

            // Create risk score
            const avgScore = moodLogs.reduce((s, l) => s + l.intensity, 0) / moodLogs.length;
            const volatility = Math.abs(0.5 - avgScore / 10) * 2;
            const burnout = Math.max(0, Math.round((1 - avgScore / 10) * 50));
            const stressIndex = +(1 - avgScore / 10).toFixed(2);

            await RiskScore.create({
                userId: user._id,
                stressIndex,
                volatility: +volatility.toFixed(2),
                burnoutProbability: burnout,
                riskStatus: stressIndex > 0.6 ? 'HIGH' : stressIndex > 0.3 ? 'MEDIUM' : 'LOW',
            });
        }
        console.log('  ✅ Seeded data for all users');

        console.log('\n🎉 Seeding complete!');
    } catch (error: any) {
        console.error('❌ Seed error message:', error.message);
        console.error('❌ Seed error code:', error.code);
        if (error.message.includes('Authentication failed')) {
            console.error('💡 TIP: Your MongoDB credentials in .env appear to be incorrect.');
        }
    } finally {
        await mongoose.disconnect();
    }
}

seed();
