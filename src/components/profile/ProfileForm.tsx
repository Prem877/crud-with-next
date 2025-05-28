'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { updateProfile } from './actions';
//ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '../ui/skeleton';
import { Camera } from "lucide-react"

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

interface ProfileFormProps {
    initialUser: User;
}

export default function ProfileForm({ initialUser }: ProfileFormProps) {
    const [name, setName] = useState(initialUser.name || '');
    // const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [twitter, setTwitter] = useState(initialUser.userMetadata.twitter || '');
    const [github, setGithub] = useState(initialUser.userMetadata.github || '');
    const [linkedin, setLinkedin] = useState(initialUser.userMetadata.linkedin || '');
    const [facebook, setFacebook] = useState(initialUser.userMetadata.facebook || '');
    const [instagram, setInstagram] = useState(initialUser.userMetadata.instagram || '');
    const [bio, setBio] = useState(initialUser.userMetadata.bio || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState(initialUser.userMetadata.avatarUrl);

    const router = useRouter();

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const avatarFile = event.target.files?.[0];
        if (!avatarFile) return;

        setLoading(true);
        const fileExt = avatarFile.name.split('.').pop();
        const randomName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`; // Generate a random name
        const fileName = `${initialUser.id}/${randomName}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) {
            setError(uploadError.message);
            setLoading(false);
            return;
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
        setAvatarUrl(data.publicUrl);
        console.log('image url:', data.publicUrl);

        setLoading(false);
        toast.success("Profile Picture has been uploaded successfully");

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // if (avatarFile) await handleAvatarUpload();

        const updatedMetadata: UserMetadata = {
            avatarUrl,
            twitter,
            github,
            linkedin,
            facebook,
            instagram,
            bio,
        };

        const result = await updateProfile(name, updatedMetadata);

        if (result?.error) {
            setError(result.error);
        } else {
            setError(null);
        }
        setLoading(false);
        // router.push("/");
        toast.success("Profile has been updated successfully", {
            action: {
                label: "Okay",
                onClick: () => router.push("/")
            }
        });
    };

    return (
        <>
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <Card className="max-w-lg mx-auto shadow-md">
                    <CardHeader>
                        <CardTitle className="flex justify-center items-center text-2xl font-bold">Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative flex justify-center items-center mb-6">
                            {!loading ? (
                                <div className="relative group">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <Label htmlFor="user-avatar" className="cursor-pointer">
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </Label>
                                </div>
                            ) : (
                                <Skeleton className="h-20 w-20 rounded-full" />
                            )}
                            <Input id="user-avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter</Label>
                                <Input
                                    id="twitter"
                                    type="text"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    placeholder="Twitter handle"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="github">GitHub</Label>
                                <Input
                                    id="github"
                                    type="text"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    placeholder="GitHub username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    type="url"
                                    value={linkedin}
                                    onChange={(e) => setLinkedin(e.target.value)}
                                    placeholder="LinkedIn profile URL"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook</Label>
                                <Input
                                    id="facebook"
                                    type="url"
                                    value={facebook}
                                    onChange={(e) => setFacebook(e.target.value)}
                                    placeholder="Facebook profile URL"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    type="text"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    placeholder="Instagram handle"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <Button variant="outline" type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Saving..." : "Save Profile"}
                                </Button>
                                <Button
                                    variant="destructive"
                                    type="button"
                                    onClick={() => router.push("/")}
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </div>

                            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}