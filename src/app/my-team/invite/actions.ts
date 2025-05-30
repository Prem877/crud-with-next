"use server";

import { z } from "zod";

// Schema for validating invitation acceptance
const acceptInvitationSchema = z.object({
  token: z.string().min(1, "Token is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AcceptInvitationData = z.infer<typeof acceptInvitationSchema>;

// Mock invitation data - in a real app, this would be stored in a database
const mockInvitations: Record<
  string,
  {
    email: string;
    role: string;
    teamName: string;
    inviterName: string;
    isValid: boolean;
    expiresAt: Date;
  }
> = {
  // This would normally be stored in your database when the invitation is sent
  "83lloqm4rn": {
    email: "newuser@example.com",
    role: "member",
    teamName: "Your Team",
    inviterName: "Team Admin",
    isValid: true,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
};

export async function validateInvitation(token: string) {
  try {
    // In a real app, you would query your database here
    const invitation = mockInvitations[token];

    if (!invitation) {
      return {
        success: false,
        error: "Invitation not found",
        data: null,
      };
    }

    if (!invitation.isValid) {
      return {
        success: false,
        error: "Invitation is no longer valid",
        data: null,
      };
    }

    if (new Date() > invitation.expiresAt) {
      return {
        success: false,
        error: "Invitation has expired",
        data: null,
      };
    }

    return {
      success: true,
      data: {
        email: invitation.email,
        role: invitation.role,
        teamName: invitation.teamName,
        inviterName: invitation.inviterName,
        isValid: true,
      },
    };
  } catch (error) {
    console.error("Error validating invitation:", error);
    return {
      success: false,
      error: "An error occurred while validating the invitation",
      data: null,
    };
  }
}

export async function acceptInvitation(data: AcceptInvitationData) {
  try {
    // Validate the input data
    const validatedData = acceptInvitationSchema.parse(data);

    // Validate the invitation token
    const invitationResult = await validateInvitation(validatedData.token);

    if (!invitationResult.success || !invitationResult.data) {
      return {
        success: false,
        error: invitationResult.error || "Invalid invitation",
      };
    }

    // In a real app, you would:
    // 1. Create the user account in your database
    // 2. Hash the password
    // 3. Add the user to the team
    // 4. Mark the invitation as used
    // 5. Send a welcome email
    // 6. Create a session/JWT token

    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mark invitation as used (in a real app, update the database)
    if (mockInvitations[validatedData.token]) {
      mockInvitations[validatedData.token].isValid = false;
    }

    return {
      success: true,
      message: "Account created successfully",
      data: {
        email: invitationResult.data.email,
        name: validatedData.name,
        role: invitationResult.data.role,
        teamName: invitationResult.data.teamName,
      },
    };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
