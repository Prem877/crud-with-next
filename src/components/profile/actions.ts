
"use server";

import prisma from "@/lib/prisma";
import { supabase } from "@/utils/supabase/client";
import { cookies } from "next/headers";

interface UserMetadata {
  avatarUrl?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  bio?: string;
  [key: string]: any; // Allow additional fields from previous metadata
}

export async function updateProfile(name: string, newMetadata: UserMetadata) {
  const cookieStore = await cookies();
  const cookiePrefix = "sb-fpihvzfmvivmqaxicqur-auth-token";
  const tokenParts = [];
  let i = 0;
  while (true) {
    const part = cookieStore.get(`${cookiePrefix}.${i}`);
    if (!part) break;
    tokenParts.push(part.value);
    i++;
  }

  const accessToken = tokenParts.join("");
  console.log("UpdateProfile - Combined access token:", accessToken);

  if (!accessToken) {
    return { error: "Unauthorized - No access token" };
  }

  let token;
  try {
    const decodedToken = JSON.parse(atob(accessToken.split("base64-")[1]));
    token = decodedToken.access_token;
    console.log("UpdateProfile - Decoded token:", token);
  } catch (err) {
    console.error("UpdateProfile - Failed to decode token:", err);
    return { error: "Unauthorized - Invalid token format" };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    console.log("UpdateProfile - Auth error:", authError);
    return { error: "Unauthorized - Invalid token" };
  }

  console.log("UpdateProfile - User ID:", user.id);

  try {
    // Fetch the existing user data
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { userMetadata: true },
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    // Merge existing metadata with new metadata
    const currentMetadata = (existingUser.userMetadata as UserMetadata) || {};
    const updatedMetadata = {
      ...currentMetadata, // Preserve previous fields
      ...newMetadata, // Add/overwrite new fields
    };

    // Update the user with merged metadata
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || undefined,
        userMetadata: updatedMetadata,
      },
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || undefined,
      userMetadata: updatedUser.userMetadata as UserMetadata,
    };
  } catch (err) {
    console.error("UpdateProfile - Prisma error:", err);
    return { error: "Failed to update profile" };
  }
}
