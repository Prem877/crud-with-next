"use client"

import type React from "react"
import { toast } from 'sonner';

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserPlus, Loader2 } from "lucide-react"
import { acceptInvitation, validateInvitation } from "./actions"

export default function InvitePage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isValidating, setIsValidating] = useState(true)
    const [isAccepting, setIsAccepting] = useState(false)
    const [invitationData, setInvitationData] = useState<{
        email: string
        role: string
        teamName: string
        inviterName: string
        isValid: boolean
    } | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        confirmPassword: "",
    })

    useEffect(() => {
        if (token) {
            validateToken()
        } else {
            setIsValidating(false)
        }
    }, [token])

    const validateToken = async () => {
        if (!token) return

        try {
            const result = await validateInvitation(token)
            if (result.success && result.data) {
                setInvitationData(result.data)
            } else {
                setInvitationData({
                    email: "",
                    role: "",
                    teamName: "",
                    inviterName: "",
                    isValid: false,
                })
            }
        } catch (error) {
            console.error("Error validating token:", error)
            setInvitationData({
                email: "",
                role: "",
                teamName: "",
                inviterName: "",
                isValid: false,
            })
        } finally {
            setIsValidating(false)
        }
    }

    const handleAcceptInvitation = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token || !invitationData) return

        if (formData.password !== formData.confirmPassword) {
            toast.error("Error")
            return
        }

        if (formData.password.length < 8) {
            toast.error("Error", {
                description: "Password must be at least 8 characters long",
            })
            return
        }

        setIsAccepting(true)

        try {
            const result = await acceptInvitation({
                token,
                name: formData.name,
                password: formData.password,
            })

            if (result.success) {
                toast.success("Welcome to the team!", {
                    description: "Your account has been created successfully",
                })

                // Redirect to dashboard or login page
                window.location.href = "/my-team"
            } else {
                toast.error("Error", {
                    description: result.error || "Failed to accept invitation",
                })
            }
        } catch (error) {
            toast.error("Error", {
                description: "An unexpected error occurred",
            })
            console.error("Accept invitation error:", error)
        } finally {
            setIsAccepting(false)
        }
    }

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Validating invitation...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <CardTitle>Invalid Invitation</CardTitle>
                        <CardDescription>No invitation token was provided</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => (window.location.href = "/")} className="w-full">
                            Go to Homepage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!invitationData?.isValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <CardTitle>Invalid or Expired Invitation</CardTitle>
                        <CardDescription>
                            This invitation link is invalid or has expired. Please contact your team administrator for a new
                            invitation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => (window.location.href = "/")} className="w-full">
                            Go to Homepage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Join {invitationData.teamName}</CardTitle>
                    <CardDescription>
                        {invitationData.inviterName} has invited you to join as a{" "}
                        <span className="font-semibold">{invitationData.role}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-6">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            You're being invited to: <strong>{invitationData.email}</strong>
                        </AlertDescription>
                    </Alert>

                    <form onSubmit={handleAcceptInvitation} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Create a password (min. 8 characters)"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                required
                                minLength={8}
                            />
                        </div>

                        <Button type="submit" disabled={isAccepting} className="w-full">
                            {isAccepting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Accept Invitation & Create Account"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <a href="/login" className="text-primary hover:underline">
                                Sign in instead
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
