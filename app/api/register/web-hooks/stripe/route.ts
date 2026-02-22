import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const { pendingId, name, email, phone, agent_type } = session.metadata!;

    // Save to agents table
    const { error } = await supabase.from("agents").insert({
      name,
      email,
      phone,
      agent_type,
      stripe_session_id: session.id,
      payment_status: "paid",
    });

    if (error) {
      console.error("Error saving agent:", error);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    // Clean up pending record
    await supabase.from("pending_agents").delete().eq("id", pendingId);
  }

  return NextResponse.json({ received: true });
}