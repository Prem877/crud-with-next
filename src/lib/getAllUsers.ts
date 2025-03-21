// lib/getAllUsers.ts
import { supabase } from "@/utils/supabase/client";

// Fetch multiple users (example)
export async function fetchUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name");
  if (error) {
    console.log("Error fetching users:", error);
    return [];
  }
  return data.map((user) => ({
    id: user.id,
    email: user.email,
    displayName: user.display_name || "N/A",
  }));
}
