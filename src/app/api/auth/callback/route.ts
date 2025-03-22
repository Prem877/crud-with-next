import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(`${origin}/error?message=no-code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error.message);
    return NextResponse.redirect(`${origin}/error?message=auth-failed`);
  }

  //external code for store user data in prisma db*********************************************
  const user = data.session.user;
  // Store in Prisma User table
  await prisma.user.create({
    data: {
      id: user.id, // Supabase UUID
      email: user.email || "unknown@example.com",
      name: user.user_metadata?.name || user.email, // Optional: extract from metadata
      userMetadata: user.user_metadata, // Directly from Supabase response
    },
  });
  // /external code for store user data in prisma db*********************************************

  console.log("Session established:", data.session);

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
