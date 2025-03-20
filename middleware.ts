// import { type NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// export async function middleware(request: NextRequest) {
//   const token =
//     request.headers.get("Authorization")?.replace("Bearer ", "") || "";

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser(token);

//   const { pathname } = request.nextUrl;

//   if (user && pathname === "/auth/login") {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (!user && pathname !== "/auth/login" && pathname !== "/auth/signup") {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };
