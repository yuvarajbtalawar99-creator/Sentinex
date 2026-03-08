import { useState, useEffect } from 'react';
import { auth } from '@/lib/api';

export type Role = 'individual' | 'university_admin' | 'corporate_admin' | 'healthcare_admin' | 'government_admin' | 'super_admin';
export type UserRole = Role;

export const useRole = () => {
    const [role, setRole] = useState<Role | null>(() => {
        const savedUser = localStorage.getItem('sentinex_user');
        try {
            return savedUser ? JSON.parse(savedUser).role : null;
        } catch {
            return null;
        }
    });

    const [orgCode, setOrgCode] = useState<string | null>(() => {
        const savedUser = localStorage.getItem('sentinex_user');
        try {
            return savedUser ? JSON.parse(savedUser).orgCode : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(() => {
        const token = localStorage.getItem('sentinex_token');
        const savedUser = localStorage.getItem('sentinex_user');
        return !(token && savedUser);
    });

    useEffect(() => {
        const fetchRole = async () => {
            const token = localStorage.getItem('sentinex_token');
            if (!token) {
                setRole(null);
                setOrgCode(null);
                setLoading(false);
                return;
            }

            try {
                const response = await auth.getMe();
                const user = response.data;

                // Update state if different from cache
                setRole(user.role);
                setOrgCode(user.orgCode);
                localStorage.setItem('sentinex_user', JSON.stringify(user));
            } catch (error: any) {
                console.error('[useRole] Session verification failed:', error.message);
                // Only clear session if it's a 401/403/404 (unauthorized or missing)
                if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
                    localStorage.removeItem('sentinex_token');
                    localStorage.removeItem('sentinex_user');
                    setRole(null);
                    setOrgCode(null);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, []);

    const updateRole = async (newRole: Role) => {
        setRole(newRole);
        const savedUser = localStorage.getItem('sentinex_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                user.role = newRole;
                localStorage.setItem('sentinex_user', JSON.stringify(user));
            } catch (e) {
                console.error('Error updating local role:', e);
            }
        }
    };

    const getOrgType = (r: Role | null): string | null => {
        if (!r) return null;
        if (r.includes('university')) return 'university';
        if (r.includes('corporate')) return 'corporate';
        if (r.includes('healthcare')) return 'healthcare';
        if (r.includes('government')) return 'government';
        return null;
    };

    const orgType = getOrgType(role);

    return { role, orgCode, orgType, loading, updateRole };
};

// Internal toast helper
export const toastRole = (title: string, description: string) => {
    console.log(`[Role System] ${title}: ${description}`);
};
