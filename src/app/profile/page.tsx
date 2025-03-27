'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import ProfileForm from '@/components/profile/ProfileForm';

interface UserMetadata {
    avatarUrl?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    bio?: string;
}

interface User {
    id: string;
    email: string;
    name?: string;
    userMetadata: UserMetadata;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            console.log('Profile session:', session);
            console.log('Session error:', sessionError);

            if (!session) {
                console.log('No session found, redirecting to login');
                router.push('/auth/login');
                return;
            }

            // Log cookies for debugging
            console.log('Document cookies:', document.cookie);

            try {
                const response = await fetch('/api/profile', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Include cookies
                });
                const userData = await response.json();

                if (!response.ok) {
                    console.log('API response:', userData);
                    throw new Error(userData.error || 'Failed to fetch user data');
                }

                setUser(userData);
                setLoading(false);
            } catch (err) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth event:', event, 'Session:', session);
            if (event === 'SIGNED_IN' && session) {
                setLoading(false);
            } else if (event === 'SIGNED_OUT' || !session) {
                router.push('/auth/login');
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <ProfileForm initialUser={user} />
        </div>
    );
}