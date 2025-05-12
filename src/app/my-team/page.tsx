"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
    isYou?: boolean;
}

interface PendingInvite {
    id: string;
    email: string;
    role: string;
    invitedAt: string;
    expiresAt: string;
    status: string;
}

export default function MyTeamPage() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

    useEffect(() => {
        // Mock data (replace with API call in a real app)
        const mockTeamMembers: TeamMember[] = [
            {
                id: "1",
                name: "premsahu",
                email: "premsahu@hencework.com",
                role: "Primary Owner",
                joinedAt: "14/04/2025",
                isYou: true,
            },
        ];

        const mockPendingInvites: PendingInvite[] = [
            {
                id: "2",
                email: "premsukh7691@gmail.com",
                role: "Member",
                invitedAt: "14/04/2025",
                expiresAt: "21/04/2025",
                status: "Active",
            },
        ];

        setTeamMembers(mockTeamMembers);
        setPendingInvites(mockPendingInvites);
    }, []);

    return (
        <>
            {/* <div className="container mx-auto p-4 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Team Members</h1>
                <Button variant="outline">Invite Members</Button>
            </div>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search members"
                    className="w-full p-2 border rounded mb-4"
                />
                <Table>
                    <TableCaption>Here you can manage the members of your team.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined at</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            P
                                        </span>
                                        <span>{member.name}</span>
                                        {member.isYou && <span className="text-sm text-gray-500">(You)</span>}
                                    </div>
                                </TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-yellow-300 text-yellow-800 rounded">
                                        {member.role}
                                    </span>
                                </TableCell>
                                <TableCell>{member.joinedAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div>
                <h1 className="text-2xl font-bold mb-4">Pending Invites</h1>
                <input
                    type="text"
                    placeholder="Search invitations"
                    className="w-full p-2 border rounded mb-4"
                />
                <Table>
                    <TableCaption>Here you can manage the pending invitations to your team.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Invited at</TableHead>
                            <TableHead>Expires at</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingInvites.map((invite) => (
                            <TableRow key={invite.id}>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                            P
                                        </span>
                                        <span>{invite.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{invite.role}</TableCell>
                                <TableCell>{invite.invitedAt}</TableCell>
                                <TableCell>{invite.expiresAt}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-green-500 text-white rounded">
                                        {invite.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div> */}
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">My Team</h1>
                    <Button variant="outline">Invite Members</Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Team Members Card */}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="text"
                                placeholder="Search members"
                                className="w-full p-2 border rounded mb-4"
                            />
                            <Table>
                                <TableCaption>Here you can manage the members of your team.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined at</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamMembers.map((member) => (
                                        <TableRow
                                            key={member.id}
                                            className="md:table-row flex flex-col mb-2 border-b md:border-none"
                                        >
                                            <TableCell className="font-medium md:table-cell flex items-center space-x-2">
                                                <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    P
                                                </span>
                                                <span>{member.name}</span>
                                                {member.isYou && (
                                                    <span className="text-sm text-gray-500">(You)</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="md:table-cell">{member.email}</TableCell>
                                            <TableCell className="md:table-cell">
                                                <span className="px-2 py-1 bg-yellow-300 text-yellow-800 rounded">
                                                    {member.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="md:table-cell">{member.joinedAt}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Pending Invites Card */}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Pending Invites</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="text"
                                placeholder="Search invitations"
                                className="w-full p-2 border rounded mb-4"
                            />
                            <Table>
                                <TableCaption>Here you can manage the pending invitations to your team.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Invited at</TableHead>
                                        <TableHead>Expires at</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingInvites.map((invite) => (
                                        <TableRow
                                            key={invite.id}
                                            className="md:table-row flex flex-col mb-2 border-b md:border-none"
                                        >
                                            <TableCell className="md:table-cell flex items-center space-x-2">
                                                <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    P
                                                </span>
                                                <span>{invite.email}</span>
                                            </TableCell>
                                            <TableCell className="md:table-cell">{invite.role}</TableCell>
                                            <TableCell className="md:table-cell">{invite.invitedAt}</TableCell>
                                            <TableCell className="md:table-cell">{invite.expiresAt}</TableCell>
                                            <TableCell className="md:table-cell">
                                                <span className="px-2 py-1 bg-green-500 text-white rounded">
                                                    {invite.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}