
'use client';

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
import { SectionCards } from "@/components/dashboard/section-card";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import data from "@/components/dashboard/data.json"

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
        <>
            {/* <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <Button onClick={handleLogout} className="mt-4">
          Logout
        </Button>
      </div> */}
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                </div>
            </div>
        </>
    );
}