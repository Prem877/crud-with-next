// pages/edit-user.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Github, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';
//img
import userImg from '@/assets/user.jpg';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';


export default function EditUser() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        displayName: '',
        avatarUrl: '',
        role: '',
        email: '',
        twitter: '',
        linkedin: '',
        facebook: '',
        instagram: '',
        bio: '',
        location: '',
        website: '',
    });

    useEffect(() => {
        async function fetchUser() {
            const { data: user, error } = await supabase
                .from('User')
                .select('id, email, name, userMetadata')
                .eq('id', userId)
                .single();

            if (error || !user) {
                alert('User not found');
                router.push('/');
                return;
            }

            const metadata = user.userMetadata || {};
            setUserData({
                displayName: user.name || '',
                avatarUrl: metadata.avatar_url || '',
                role: metadata.role || '',
                email: user.email || '',
                twitter: metadata.twitter || '',
                linkedin: metadata.linkedin || '',
                facebook: metadata.facebook || '',
                instagram: metadata.instagram || '',
                bio: metadata.bio || '',
                location: metadata.location || '',
                website: metadata.website || '',
            });
        }
        if (userId) fetchUser();
    }, [userId, router]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/avatar.${fileExt}`;

        try {
            // Upload the file to Supabase Storage
            const { data, error } = await supabase.storage
                .from('avatars') // Create a bucket named 'avatars' in Supabase Storage
                .upload(fileName, file, {
                    upsert: true, // Overwrite if the file already exists
                });

            if (error) {
                alert(error.message);
                setLoading(false);
                return;
            }

            // Get the public URL of the uploaded file
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            if (!urlData.publicUrl) throw new Error('Failed to get public URL');

            // Update the avatar URL in the state
            setUserData({ ...userData, avatarUrl: urlData.publicUrl });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Failed to upload avatar');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Update User table in Supabase
            const { error: tableError } = await supabase
                .from('User')
                .update({
                    name: userData.displayName,
                    email: userData.email,
                    userMetadata: {
                        avatar_url: userData.avatarUrl,
                        role: userData.role,
                        twitter: userData.twitter,
                        linkedin: userData.linkedin,
                        facebook: userData.facebook,
                        instagram: userData.instagram,
                        bio: userData.bio,
                        location: userData.location,
                        website: userData.website,
                    },
                    updatedAt: new Date(),
                })
                .eq('id', userId);

            if (tableError) throw tableError;

            // Sync with Supabase Auth
            // const { error: authError } = await supabase.auth.updateUser({
            //     email: userData.email,
            //     data: {
            //         display_name: userData.displayName,
            //         avatar_url: userData.avatarUrl,
            //         role: userData.role,
            //         twitter: userData.twitter,
            //         linkedin: userData.linkedin,
            //         facebook: userData.facebook,
            //         instagram: userData.instagram,
            //         bio: userData.bio,
            //         location: userData.location,
            //         website: userData.website,
            //     },
            // });
            // if (authError) throw authError;

            setLoading(false)
            toast.success("User updated successfully!", {
                action: {
                    label: "Okay",
                    onClick: () => router.push("/")
                }
            });
        } catch (error) {
            console.error('Error updating user:', error);
            // alert('Error updating user');
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar */}
                <Card className="w-full lg:w-1/3">
                    <CardHeader>
                        <Button variant="link" onClick={() => router.push('/')} className="text-sm">
                            ← Back to Dashboard
                        </Button>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">

                        <div className="relative">
                            {
                                !loading
                                    ?
                                    <Image
                                        src={userData.avatarUrl ? userData.avatarUrl : userImg}
                                        alt="Avatar"
                                        width={120}
                                        height={120}
                                        className="rounded-full"
                                    />
                                    :
                                    <Skeleton className="h-12 w-12 rounded-full" />
                            }
                            <div className="mt-2">
                                <Label htmlFor="avatar-upload" className="cursor-pointer">
                                    <Button variant="outline" size="sm" asChild>
                                        <span>Change Avatar</span>
                                    </Button>
                                </Label>
                                <Input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </div>
                        </div>

                        <div className="mt-6 w-full">
                            <h3 className="text-lg font-semibold">Social Profiles</h3>
                            <Separator className="my-2" />
                            <div className="space-y-3">
                                {/* <div className="flex items-center space-x-2">
                                    <Github className="h-5 w-5 text-gray-500" />
                                    <span>{userData.github || 'Not set'}</span>
                                </div> */}
                                <div className="flex items-center space-x-2">
                                    <Twitter className="h-5 w-5 text-gray-500" />
                                    <span>{userData.twitter || 'Not set'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Linkedin className="h-5 w-5 text-gray-500" />
                                    <span>{userData.linkedin || 'Not set'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Instagram className="h-5 w-5 text-gray-500" />
                                    <span>{userData.instagram || 'Not set'}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="w-full lg:w-2/3">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="personal">Personal Details</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="personal">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <p className="text-sm text-gray-500">
                                        Update your profile information and how others see you on the platform.
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="displayName">Name</Label>
                                        <Input
                                            id="displayName"
                                            value={userData.displayName}
                                            onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                                            placeholder="Your public display name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            placeholder="Your email"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role">Role</Label>
                                        <Input
                                            id="role"
                                            value={userData.role}
                                            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                                            placeholder="Your professional title or role"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input
                                            id="bio"
                                            value={userData.bio}
                                            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                            placeholder="Brief description for your profile. Max 160 characters."
                                            maxLength={160}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={userData.location}
                                                onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                                placeholder="Your location"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                value={userData.website}
                                                onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                                                placeholder="Your website"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="twitter">Twitter</Label>
                                            <Input
                                                id="twitter"
                                                value={userData.twitter}
                                                onChange={(e) => setUserData({ ...userData, twitter: e.target.value })}
                                                placeholder="@username"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="linkedin">LinkedIn</Label>
                                            <Input
                                                id="linkedin"
                                                value={userData.linkedin}
                                                onChange={(e) => setUserData({ ...userData, linkedin: e.target.value })}
                                                placeholder="linkedin.com/in/username"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="facebook">Facebook</Label>
                                            <Input
                                                id="facebook"
                                                value={userData.facebook}
                                                onChange={(e) => setUserData({ ...userData, facebook: e.target.value })}
                                                placeholder="facebook.com/username"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="instagram">Instagram</Label>
                                            <Input
                                                id="instagram"
                                                value={userData.instagram}
                                                onChange={(e) => setUserData({ ...userData, instagram: e.target.value })}
                                                placeholder="@username"
                                            />
                                        </div>
                                    </div>
                                    <Button variant="outline" onClick={handleSave} className="w-full sm:w-auto me-3" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Button variant="destructive" onClick={() => router.push("/")} className="w-full sm:w-auto" >
                                        Cancel
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <h2 className="text-lg font-semibold">Coming Soon...</h2>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}