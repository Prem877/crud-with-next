// app/team/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { supabase } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";

// Create a new team
export async function createTeam(name: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    const team = await prisma.team.create({
      data: {
        name,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "Owner",
            status: "accepted",
          },
        },
      },
    });
    revalidatePath("/team");
    return { data: team };
  } catch (error) {
    return { error: "Failed to create team" };
  }
}

// Invite a member to the team
export async function inviteMember(
  teamId: string,
  email: string,
  role: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { ownerId: true },
    });

    if (team?.ownerId !== user.id) {
      return { error: "Only the team owner can invite members" };
    }

    await prisma.teamMember.create({
      data: {
        teamId,
        invitedEmail: email,
        role,
        status: "pending",
      },
    });

    // Placeholder for sending email (replace with Resend/SendGrid)
    console.log(
      `Invitation sent to ${email} for team ${teamId} with role ${role}`
    );

    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    return { error: "Failed to invite member" };
  }
}

// Update member role
export async function updateMemberRole(
  teamId: string,
  memberId: string,
  role: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { ownerId: true },
    });

    if (team?.ownerId !== user.id) {
      return { error: "Only the team owner can update roles" };
    }

    await prisma.teamMember.update({
      where: { id: memberId, teamId },
      data: { role },
    });

    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update role anne" };
  }
}

// Create a new project
export async function createProject(
  teamId: string,
  name: string,
  description?: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  try {
    const member = await prisma.teamMember.findFirst({
      where: { teamId, userId: user.id },
      select: { role: true },
    });

    if (!member || !["Owner", "Admin"].includes(member.role)) {
      return { error: "Only Owners or Admins can create projects" };
    }

    await prisma.project.create({
      data: {
        teamId,
        name,
        description,
      },
    });

    revalidatePath("/team");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create project" };
  }
}
