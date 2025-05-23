// import { NextResponse } from "next/server";
// import { supabase } from "@/utils/supabase/client"; // Adjust import if needed
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-03-31.basil",
// });

// export async function POST(request: Request) {
//   const { planId, billingInterval } = await request.json();

//   // Map plan IDs to Stripe Price IDs (set these in your Stripe Dashboard)
//   const priceMap = {
//     starter: {
//       monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
//       yearly: process.env.STRIPE_PRICE_STARTER_YEARLY!,
//     },
//     pro: {
//       monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
//       yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
//     },
//   };

//   const priceId = priceMap[planId][billingInterval];

//   if (!priceId) {
//     return NextResponse.json(
//       { error: "Invalid plan or interval" },
//       { status: 400 }
//     );
//   }

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [{ price: priceId, quantity: 1 }],
//     mode: "subscription",
//     success_url: `${request.headers.get(
//       "origin"
//     )}/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${request.headers.get("origin")}/cancel`,
//     customer_email: (await supabase.auth.getUser()).data.user?.email, // Optional: prefill email
//   });

//   return NextResponse.json({ id: session.id });
// }

// export const dynamic = "force-dynamic"; // Ensure API route is dynamic
