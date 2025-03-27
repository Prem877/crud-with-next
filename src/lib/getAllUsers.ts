// lib/getAllUsers.ts
import { supabase } from "@/utils/supabase/client";

// Fetch multiple users (example)
export async function fetchUsers() {
  const { data, error } = await supabase.from("User").select("id, email, name, userMetadata");
  if (error) {
    console.log("Error fetching users:", error);
    return [];
  }
  return data.map((user) => ({
    id: user.id,
    email: user.email,
    displayName: user.name || "N/A",
    avatarUrl: user.userMetadata?.avatar_url || '',
    role: user.userMetadata?.role || 'N/A', // From user_metadata
  }));
}
