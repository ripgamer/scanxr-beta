import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure you have prisma client setup

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  const payload = await req.json();
  const heads = headers();

  const svix_id = heads.get("svix-id");
  const svix_timestamp = heads.get("svix-timestamp");
  const svix_signature = heads.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const wh = new Webhook(webhookSecret);

  let evt;
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  // Handle user.created event
  if (eventType === "user.created") {
    const userData = evt.data;

    try {
      // 1. Create user in the database
      const user = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email_addresses[0].email_address,
          username: userData.username || userData.id,
        },
      });

      // 2. Create profile linked to user
      await prisma.profile.create({
        data: {
          userId: user.id,
          slug: userData.username || userData.id,
          bio: userData.public_metadata?.bio || null,
          avatarUrl: userData.profile_image_url || null,
        },
      });

      console.log("User + Profile created successfully!");
    } catch (err) {
      console.error("Database error:", err);
    }
  }

  return NextResponse.json({ status: "success" });
}
