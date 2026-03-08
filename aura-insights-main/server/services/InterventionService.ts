export interface Recommendation {
    type: 'coping' | 'professional' | 'crisis';
    title: string;
    description: string;
    actionLabel: string;
    link?: string;
}

export class InterventionService {
    static getRecommendations(interventionLevel: string): Recommendation[] {
        switch (interventionLevel) {
            case 'CRITICAL':
                return [
                    {
                        type: 'crisis',
                        title: 'Immediate Support Required',
                        description: 'Your stress levels are extremely high. Please reach out to a professional immediately.',
                        actionLabel: 'Call Crisis Hotline',
                        link: 'tel:988'
                    },
                    {
                        type: 'professional',
                        title: 'Counseling Session',
                        description: 'We strongly recommend scheduling an urgent session with a therapist.',
                        actionLabel: 'Book Appointment'
                    }
                ];
            case 'MODERATE':
                return [
                    {
                        type: 'professional',
                        title: 'Speak with a Specialist',
                        description: 'Elevated stress patterns detected. It might be helpful to talk things through.',
                        actionLabel: 'View Counselors'
                    },
                    {
                        type: 'coping',
                        title: 'Guided Resilience Training',
                        description: 'Try our 10-minute deep reset protocol to stabilize volatility.',
                        actionLabel: 'Start Exercise'
                    }
                ];
            case 'MINIMAL':
            default:
                return [
                    {
                        type: 'coping',
                        title: 'Maintain Your Balance',
                        description: 'Your emotional health is stable. Keep up your current routines!',
                        actionLabel: 'Daily Check-in'
                    }
                ];
        }
    }

    static determineInterventionLevel(riskStatus: string, stressIndex: number, burnoutProbability: number): 'MINIMAL' | 'MODERATE' | 'CRITICAL' {
        if (riskStatus === 'HIGH' || stressIndex > 0.8 || burnoutProbability > 70) {
            return 'CRITICAL';
        }
        if (stressIndex > 0.5 || burnoutProbability > 40) {
            return 'MODERATE';
        }
        return 'MINIMAL';
    }
}
