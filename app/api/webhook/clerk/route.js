import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Server not configured", { status: 500 });
  }

  // Use raw body for Svix verification
  const payload = await req.text();
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

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

  const eventType = evt.type;
  const data = evt.data;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = data?.email_addresses?.[0]?.email_address;
      const user = await prisma.user.upsert({
        where: { id: data.id },
        update: {
          ...(email ? { email } : {}),
          username: data.username || data.id,
        },
        create: {
          id: data.id,
          email: email || `${data.id}@placeholder.local`,
          username: data.username || data.id,
        },
      });

      const slug = (data.username || user.username || `user-${data.id.slice(-8)}`).toLowerCase();
      await prisma.profile.upsert({
        where: { userId: data.id },
        update: {
          slug,
          avatarUrl: data?.profile_image_url || data?.image_url || undefined,
          bio: data?.public_metadata?.bio || undefined,
        },
        create: {
          userId: data.id,
          slug,
          avatarUrl: data?.profile_image_url || data?.image_url || undefined,
          bio: data?.public_metadata?.bio || undefined,
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
