import express from 'express';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { AuditLog } from '../models/AuditLog';
import MoodLog from '../models/MoodLog';
import RiskScore from '../models/RiskScore';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, orgCode, role: requestedRole } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let organizationId = null;
        let role = requestedRole || 'individual';

        if (orgCode) {
            const org = await Organization.findOne({ orgCode: orgCode.toUpperCase() });
            if (!org) {
                return res.status(404).json({ message: 'Invalid Organization Code' });
            }
            if (org.status !== 'approved') {
                return res.status(403).json({ message: 'Organization access is currently restricted' });
            }
            organizationId = org._id;

            // If a specific role wasn't requested, default to org admin
            if (!requestedRole || requestedRole === 'individual') {
                role = `${org.type}_admin`;
            }
        }

        // Create user
        const user = new User({
            email,
            password,
            fullName,
            role,
            organizationId,
            orgCode: orgCode?.toUpperCase() || null
        });

        await user.save();

        // Log action
        await AuditLog.create({
            userId: user._id,
            userEmail: user.email,
            action: 'REGISTER',
            resource: 'AUTH',
            details: `User registered with role: ${role}${orgCode ? ` for org: ${orgCode}` : ''}`
        });

        // Generate Token
        const token = jwt.sign(
            { userId: user._id, role: user.role, orgId: organizationId },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                orgCode: user.orgCode
            }
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, orgCode } = req.body;

        // Find User
        const user: any = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If orgCode is provided in login, verify it matches the user's org
        if (orgCode && user.orgCode && orgCode.toUpperCase() !== user.orgCode.toUpperCase()) {
            return res.status(401).json({ message: 'Organization code mismatch' });
        }

        // Check Password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        // Log action
        await AuditLog.create({
            userId: user._id,
            userEmail: user.email,
            action: 'LOGIN',
            resource: 'AUTH',
            details: `User logged in successfully`
        });

        // Generate Token
        const token = jwt.sign(
            { userId: user._id, role: user.role, orgId: user.organizationId },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                orgCode: user.orgCode
            }
        });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// Get Current User (Profile)
router.get('/me', async (req: any, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token' });

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Update Privacy Settings
router.patch('/privacy', async (req: any, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token' });
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);

        const { privacySettings, isOptedIn } = req.body;
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { privacySettings, isOptedIn },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update privacy settings' });
    }
});

// Delete Account (Cascading)
router.delete('/me', async (req: any, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'No token' });
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);

        const userId = decoded.userId;

        // Perform cascading deletion
        await Promise.all([
            User.findByIdAndDelete(userId),
            MoodLog.deleteMany({ userId }),
            RiskScore.deleteMany({ userId }),
            AuditLog.create({
                userId,
                action: 'ACCOUNT_DELETION',
                resource: 'USER',
                details: 'User deleted their account and all associated data.'
            })
        ]);

        res.json({ message: 'Account and all associated data deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

export default router;
