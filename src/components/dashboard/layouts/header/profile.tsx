'use client'
import { supabase } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Profile = () => {

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Check auth state on mount
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        // Listen for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
        // User state will update automatically via the auth listener
    }

    return (
        <div>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                                <AvatarFallback>
                                    {user.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user.user_metadata?.full_name || user.email}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="#">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild>
                    <a href="/login">Sign In</a>
                </Button>
            )}
        </div>
    );
}

export default Profile;
