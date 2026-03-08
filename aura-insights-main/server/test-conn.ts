import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function testConnection() {
    console.log('🧪 Testing MongoDB Connection...');
    console.log('URI:', process.env.MONGODB_URI?.replace(/:([^:@]+)@/, ':****@'));

    try {
        await mongoose.connect(process.env.MONGODB_URI || '', {
            serverSelectionTimeoutMS: 10000,
            family: 4,
            tls: true,
            // Disable buffering so we see the error immediately
            bufferCommands: false
        });
        console.log('✅ Success! Connected to MongoDB.');

        // Try a simple operation
        if (mongoose.connection.db) {
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('✅ Successfully listed collections:', collections.map(c => c.name));
        } else {
            console.log('⚠️ Connected but database object is undefined.');
        }

    } catch (err: any) {
        console.error('❌ Connection Failed!');
        console.error(err.message || err);
        if (err.message?.includes('IP address is not whitelisted')) {
            console.error('👉 TIP: Your current IP address might not be whitelisted in MongoDB Atlas.');
            console.error('👉 Action: Add your IP to the Atlas Network Access list: https://www.mongodb.com/docs/atlas/security-whitelist/');
        }
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected.');
    }
}

testConnection();
