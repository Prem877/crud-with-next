"use client"

import type React from "react"
import { toast } from 'sonner';

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Mail, MoreHorizontal, UserPlus, Users, Crown, Shield, User } from "lucide-react"

// Mock data for existing team members
const mockMembers = [
    {
        id: "1",
        name: "John Doe",
        email: "john@company.com",
        role: "owner",
        avatar: "/placeholder.svg?height=40&width=40",
        joinedAt: "2024-01-15",
        status: "active",
    },
    {
        id: "2",
        name: "Sarah Wilson",
        email: "sarah@company.com",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
        joinedAt: "2024-02-20",
        status: "active",
    },
    {
        id: "3",
        name: "Mike Johnson",
        email: "mike@company.com",
        role: "member",
        avatar: "/placeholder.svg?height=40&width=40",
        joinedAt: "2024-03-10",
        status: "pending",
    },
]

const roleIcons = {
    owner: Crown,
    admin: Shield,
    member: User,
}

const roleColors = {
    owner: "bg-yellow-100 text-yellow-800",
    admin: "bg-blue-100 text-blue-800",
    member: "bg-green-100 text-green-800",
}

export default function MyTeamPage() {
    const [members, setMembers] = useState(mockMembers)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState("member")
    const [isInviting, setIsInviting] = useState(false)

    const handleInviteMember = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!inviteEmail) {
            toast.error("Error", {
                description: "Please enter an email address",
            })
            return
        }

        setIsInviting(true)

        // Simulate API call
        setTimeout(() => {
            const newMember = {
                id: Date.now().toString(),
                name: inviteEmail.split("@")[0],
                email: inviteEmail,
                role: inviteRole as "owner" | "admin" | "member",
                avatar: "/placeholder.svg?height=40&width=40",
                joinedAt: new Date().toISOString().split("T")[0],
                status: "pending" as const,
            }

            setMembers((prev) => [...prev, newMember])
            setInviteEmail("")
            setInviteRole("member")
            setIsInviting(false)

            toast.success("Invitation sent!", {
                description: `Invitation sent to ${inviteEmail}`,
            })
        }, 1000)
    }

    const handleRoleChange = (memberId: string, newRole: string) => {
        setMembers((prev) =>
            prev.map((member) =>
                member.id === memberId ? { ...member, role: newRole as "owner" | "admin" | "member" } : member,
            ),
        )

        toast.success("Role updated", {
            description: "Member role has been updated successfully",
        })
    }

    const handleRemoveMember = (memberId: string) => {
        setMembers((prev) => prev.filter((member) => member.id !== memberId))

        toast.warning("Member removed", {
            description: "Team member has been removed successfully",
        })
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Team Members</h1>
                        <p className="text-muted-foreground">Manage your team members and their permissions</p>
                    </div>
                </div>

                {/* Invite Member Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Invite New Member
                        </CardTitle>
                        <CardDescription>Send an invitation to add a new member to your team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInviteMember} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="colleague@company.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={inviteRole} onValueChange={setInviteRole}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="owner">Owner</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" disabled={isInviting} className="w-full md:w-auto">
                                <Mail className="h-4 w-4 mr-2" />
                                {isInviting ? "Sending Invitation..." : "Send Invitation"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Members List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Members ({members.length})</CardTitle>
                        <CardDescription>Current members of your team and their roles</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {members.map((member, index) => {
                                const RoleIcon = roleIcons[member.role as "owner" | "admin" | "member"]

                                return (
                                    <div key={member.id} className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                                <AvatarFallback>
                                                    {member.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{member.name}</h3>
                                                    {member.status === "pending" && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge className={`${roleColors[member.role as "owner" | "admin" | "member"]} flex items-center gap-1`}>
                                                <RoleIcon className="h-3 w-3" />
                                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                            </Badge>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(member.id, "member")}
                                                        disabled={member.role === "member"}
                                                    >
                                                        Change to Member
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(member.id, "admin")}
                                                        disabled={member.role === "admin"}
                                                    >
                                                        Change to Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(member.id, "owner")}
                                                        disabled={member.role === "owner"}
                                                    >
                                                        Change to Owner
                                                    </DropdownMenuItem>
                                                    <Separator className="my-1" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-red-600"
                                                        disabled={member.role === "owner"}
                                                    >
                                                        Remove Member
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
