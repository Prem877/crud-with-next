"use server"

import { Resend } from "resend"
import { z } from "zod"

// Mock invitation storage - in a real app, this would be your database
const mockInvitations: Record<
  string,
  {
    email: string
    role: string
    teamName: string
    inviterName: string
    isValid: boolean
    expiresAt: Date
  }
> = {}

// Initialize Resend with the API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Schema for validating invitation data
const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["owner", "admin", "member"]),
  teamName: z.string().default("Your Team"),
  inviterName: z.string().default("A team administrator"),
})

export type InviteFormData = z.infer<typeof inviteSchema>

export async function sendInvitation(data: InviteFormData) {
  try {
    // Validate the input data
    const validatedData = inviteSchema.parse(data)

    // Generate a unique invitation token (in a real app, you'd store this in a database)
    const invitationToken = Math.random().toString(36).substring(2, 15)

    // Store the invitation data (in a real app, save to database)
    mockInvitations[invitationToken] = {
      email: validatedData.email,
      role: validatedData.role,
      teamName: validatedData.teamName,
      inviterName: validatedData.inviterName,
      isValid: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    }

    // Create the invitation URL (in a real app, this would link to your signup/accept page)
    const invitationUrl = `${process.env.NEXT_PUBLIC_TEAM_APP_URL || "http://localhost:3000"}/my-team/invite?token=${invitationToken}`

    // Send the email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: "Team Invitations <onboarding@resend.dev>",
      to: validatedData.email,
      subject: `You've been invited to join ${validatedData.teamName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've been invited!</h2>
          <p>${validatedData.inviterName} has invited you to join ${validatedData.teamName} as a ${validatedData.role}.</p>
          <p>Click the button below to accept the invitation:</p>
          <a href="${invitationUrl}" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Accept Invitation
          </a>
          <p>Or copy and paste this URL into your browser:</p>
          <p>${invitationUrl}</p>
          <p>This invitation will expire in 7 days.</p>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      message: `Invitation sent to ${validatedData.email}`,
      data: emailData,
    }
  } catch (error) {
    console.error("Error in sendInvitation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
