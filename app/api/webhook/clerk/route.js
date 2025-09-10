import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

// Ensure this route runs in the Node.js runtime (Svix uses Node crypto APIs)
export const runtime = "nodejs";
// Avoid caching; webhooks should always be processed fresh
export const dynamic = "force-dynamic";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return new Response("Server not configured for Clerk webhooks", { status: 500 });
  }

  // Read raw payload and headers
  const payload = await req.text();
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers", { svix_id, svix_timestamp, svix_signature });
    return new Response("Missing Svix headers", { status: 400 });
  }

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
    console.error("Webhook verification failed:", err?.message || err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Event data from Clerk
  const eventType = evt.type;
  const data = evt.data;

  // Handle events
  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = data?.email_addresses?.[0]?.email_address;
      await prisma.user.upsert({
        where: { id: data.id },
        update: {
          // Avoid inserting empty string into unique email
          ...(email ? { email } : {}),
          username: data.username || data.id,
        },
        create: {
          id: data.id,
          // If email is missing, set a unique placeholder to satisfy schema uniqueness
          email: email || `${data.id}@placeholder.local`,
          username: data.username || data.id,
        },
      });
    } else if (eventType === "user.deleted") {
      await prisma.user.delete({ where: { id: data.id } });
    }
  } catch (err) {
    console.error("Database operation failed:", err?.message || err);
    return new Response("Database error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
