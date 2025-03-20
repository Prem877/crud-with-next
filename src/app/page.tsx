
'use client';

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Client-side session:", session); // Debug session
      console.log("Session error (if any):", error); // Debug errors
      if (!session) {
        console.log("No session found, redirecting to login");
        router.push("/auth/login");
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "Session:", session); // Debug auth state
      if (event === "SIGNED_IN" && session) {
        setLoading(false);
      } else if (event === "SIGNED_OUT" || !session) {
        router.push("/auth/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <Button onClick={handleLogout} className="mt-4">
        Logout
      </Button>
    </div>
  );
}