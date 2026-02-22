import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { pendingId, otp } = await req.json();

  if (!pendingId || !otp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Fetch pending record
  const { data: pending, error } = await supabase
    .from("pending_agents")
    .select("*")
    .eq("id", pendingId)
    .single();

  if (error || !pending) {
    return NextResponse.json(
      { error: "Registration session not found" },
      { status: 404 }
    );
  }

  // Check OTP match
  if (pending.otp !== otp) {
    return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
  }

  // Check expiry
  if (new Date() > new Date(pending.otp_expires_at)) {
    return NextResponse.json(
      { error: "OTP has expired. Please restart." },
      { status: 400 }
    );
  }

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: pending.email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    metadata: {
      pendingId: pending.id,
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      agent_type: pending.agent_type,
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/register/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/register?cancelled=true`,
  });

  return NextResponse.json({ checkoutUrl: session.url });
}