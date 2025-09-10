import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Missing Clerk Webhook Secret", { status: 500 });
  }

  // Read payload and headers
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const svix_id = headers["svix-id"];
  const svix_timestamp = headers["svix-timestamp"];
  const svix_signature = headers["svix-signature"];

  // Verify webhook signature
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  // Event data from Clerk
  const eventType = evt.type;
  const data = evt.data;

  // Handle events
  if (eventType === "user.created" || eventType === "user.updated") {
    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email: data.email_addresses?.[0]?.email_address || "",
        username: data.username || data.id,
      },
      create: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        username: data.username || data.id,
      },
    });
  }

  if (eventType === "user.deleted") {
    await prisma.user.delete({
      where: { id: data.id },
    });
  }

  return new Response("Webhook received", { status: 200 });
}
