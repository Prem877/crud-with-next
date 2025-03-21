// hooks/useUserData.ts
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { userDataType } from "@/components/dashboard/user-data";

export function useUserData(): userDataType | null {
  const [userData, setUserData] = useState<userDataType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
        return;
      }
      if (user) {
        setUserData({
          uid: user.id,
          email: user.email,
          displayName: user.user_metadata?.display_name ?? "N/A",
        });
      }
    };
    fetchUser();
  }, []);

  return userData;
}
