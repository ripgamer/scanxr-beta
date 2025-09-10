import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req) {
  // Step 1: Verify Clerk Webhook Signature
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing Clerk webhook secret", { status: 500 });
  }

  const svix_id = headers().get("svix-id");
  const svix_timestamp = headers().get("svix-timestamp");
  const svix_signature = headers().get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Step 2: Handle Clerk Events
  const eventType = evt.type;
  const data = evt.data;

  if (eventType === "user.created" || eventType === "user.updated") {
    const email = data.email_addresses?.[0]?.email_address || null;
    const username = data.username || data.id;
    const imageUrl = data.image_url || null;
    const fullName = data.first_name
      ? `${data.first_name} ${data.last_name || ""}`.trim()
      : null;

    // Step 3: Upsert User & Profile
    try {
      const user = await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email,
          username,
          updatedAt: new Date(),
        },
        create: {
          id: data.id,
          email,
          username,
          profile: {
            create: {
              slug: username,
              avatarUrl: imageUrl,
              bio: fullName || `Hello, I'm ${username}`,
            },
          },
        },
        include: { profile: true },
      });

      console.log("User synced:", user);
    } catch (err) {
      console.error("Error syncing user:", err);
      return new Response("DB error", { status: 500 });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
