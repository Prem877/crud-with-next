// import { NextResponse } from "next/server";
// // import { createClient } from '@supabase/supabase-js';
// import prisma from "@/lib/prisma";
// import { cookies } from "next/headers";
// import { supabase } from "@/utils/supabase/client";

// // const supabase = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// // );

// export async function GET() {
//   const cookieStore = await cookies();

//   // Get all cookies with the prefix 'sb-fpihvzfmvivmqaxicqur-auth-token'
//   const cookiePrefix = "sb-fpihvzfmvivmqaxicqur-auth-token";
//   const tokenParts = [];
//   let i = 0;
//   while (true) {
//     const part = cookieStore.get(`${cookiePrefix}.${i}`);
//     if (!part) break;
//     tokenParts.push(part.value);
//     i++;
//   }

//   // Combine the parts into a single token string
//   const accessToken = tokenParts.join("");
//   console.log("Combined access token:", accessToken);

//   if (!accessToken) {
//     return NextResponse.json(
//       { error: "Unauthorized - No access token" },
//       { status: 401 }
//     );
//   }

//   // Decode the base64-encoded token
//   let token;
//   try {
//     const decodedToken = JSON.parse(atob(accessToken.split("base64-")[1]));
//     token = decodedToken.access_token;
//     console.log("Decoded token:", token);
//   } catch (err) {
//     console.error("Failed to decode token:", err);
//     return NextResponse.json(
//       { error: "Unauthorized - Invalid token format" },
//       { status: 401 }
//     );
//   }

//   const {
//     data: { user },
//     error,
//   } = await supabase.auth.getUser(token);

//   if (error || !user) {
//     console.log("Auth error:", error);
//     return NextResponse.json(
//       { error: "Unauthorized - Invalid token" },
//       { status: 401 }
//     );
//   }

//   console.log("Supabase user ID:", user.id);

//   try {
//     const prismaUser = await prisma.user.findUnique({
//       where: { id: user.id },
//     });

//     if (!prismaUser) {
//       console.log("No Prisma user found for ID:", user.id);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       id: prismaUser.id,
//       email: prismaUser.email,
//       name: prismaUser.name || undefined,
//       userMetadata: prismaUser.userMetadata || {},
//     });
//   } catch (err) {
//     console.error("Prisma error:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch user" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { supabase } from "@/utils/supabase/client";

export async function GET() {
  const cookieStore = await cookies();

  // Get all cookies with the prefix 'sb-fpihvzfmvivmqaxicqur-auth-token'
  const cookiePrefix = "sb-fpihvzfmvivmqaxicqur-auth-token";
  const tokenParts = [];
  let i = 0;
  while (true) {
    const part = cookieStore.get(`${cookiePrefix}.${i}`);
    if (!part) break;
    tokenParts.push(part.value);
    i++;
  }

  // Combine the parts into a single token string
  const accessToken = tokenParts.join("");
  console.log("Combined access token:", accessToken);

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized - No access token" },
      { status: 401 }
    );
  }

  // Try decoding as base64-encoded JSON, fallback to raw token
  let token;
  try {
    if (accessToken.startsWith("base64-")) {
      const decodedToken = JSON.parse(atob(accessToken.split("base64-")[1]));
      token = decodedToken.access_token;
      console.log("Decoded token (base64):", token);
    } else {
      // Assume it’s a raw JWT
      token = accessToken;
      console.log("Using raw token (JWT):", token);
    }
  } catch (err) {
    console.error("Failed to decode token:", err);
    console.log("Raw access token (fallback):", accessToken);
    token = accessToken; // Fallback to raw token
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.log("Auth error:", error);
    return NextResponse.json(
      { error: "Unauthorized - Invalid token" },
      { status: 401 }
    );
  }

  console.log("Supabase user ID:", user.id);

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!prismaUser) {
      console.log("No Prisma user found for ID:", user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name || undefined,
      userMetadata: prismaUser.userMetadata || {},
    });
  } catch (err) {
    console.error("Prisma error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
