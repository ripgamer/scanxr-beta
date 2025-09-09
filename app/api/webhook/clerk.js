import { Webhook } from "svix";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const payload = req.body;
  const headers = req.headers;

  // Verify Clerk signature
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(JSON.stringify(payload), headers);
  } catch (err) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const eventType = evt.type;
  const data = evt.data;

  if (eventType === "user.created") {
    const { id, email_addresses, username } = data;
    const email = email_addresses[0]?.email_address || "";

    await prisma.user.create({
      data: {
        id, // use Clerk userId as primary key for easy sync
        email,
        username,
      },
    });
  }

  res.status(200).json({ message: "OK" });
}
