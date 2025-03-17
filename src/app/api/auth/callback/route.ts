// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  console.log("Full Callback URL:", req.url); // Debug
  console.log("Code:", code); // Debug
  console.log("Error:", error); // Debug

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${error}`, req.url)
    );
  }

  if (code) {
    
    const { data, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) {
      console.error("Session Exchange Error:", sessionError.message);
      return NextResponse.redirect(
        new URL("/auth/login?error=session-failed", req.url)
      );
    }
    console.log("Session Data:", data); // Debug successful session
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // return NextResponse.redirect(new URL("/auth/login?error=auth-failed", req.url));
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
