import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, messagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ALLOWED_PHONES: Record<string, string> = {
  "919944293646": "Prathish",
  "919940739865": "Sradhaa",
  "91994039865": "Sradhaa",
  "9199440398651": "Sradhaa",
};
const SHARED_PIN = "sradhaprathish";

// POST /api/chat/login
router.post("/chat/login", async (req, res): Promise<void> => {
  const { phone, pin } = req.body as { phone?: string; pin?: string };

  if (!phone || !pin) {
    res.status(400).json({ error: "Phone and PIN are required" });
    return;
  }

  const normalizedPhone = phone.replace(/\s+/g, "").replace(/^\+/, "");

  if (!ALLOWED_PHONES[normalizedPhone]) {
    res.status(403).json({ error: "This number is not authorized to access this chat." });
    return;
  }

  if (pin !== SHARED_PIN) {
    res.status(401).json({ error: "Incorrect PIN." });
    return;
  }

  const name = ALLOWED_PHONES[normalizedPhone];

  // Upsert user
  const existing = await db.select().from(usersTable).where(eq(usersTable.phone, normalizedPhone));
  if (existing.length === 0) {
    await db.insert(usersTable).values({ phone: normalizedPhone, name });
  } else {
    await db.update(usersTable).set({ lastSeen: new Date() }).where(eq(usersTable.phone, normalizedPhone));
  }

  req.log.info({ phone: normalizedPhone }, "User logged in");
  res.json({ phone: normalizedPhone, name });
});

// GET /api/chat/messages
router.get("/chat/messages", async (req, res): Promise<void> => {
  const { phone } = req.query as { phone?: string };
  if (!phone) {
    res.status(400).json({ error: "Phone required" });
    return;
  }

  const normalizedPhone = (phone as string).replace(/\s+/g, "").replace(/^\+/, "");
  if (!ALLOWED_PHONES[normalizedPhone]) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  const msgs = await db.select().from(messagesTable).orderBy(asc(messagesTable.createdAt));

  // Mark messages from other user as read
  const now = new Date();
  for (const msg of msgs) {
    if (msg.senderId !== normalizedPhone && !msg.readAt) {
      await db.update(messagesTable).set({ readAt: now }).where(eq(messagesTable.id, msg.id));
    }
  }

  res.json(msgs);
});

// POST /api/chat/messages (fallback REST for images — WS handles text)
router.post("/chat/messages", async (req, res): Promise<void> => {
  const { phone, content, imageData, messageType } = req.body as {
    phone?: string;
    content?: string;
    imageData?: string;
    messageType?: string;
  };

  if (!phone) {
    res.status(400).json({ error: "Phone required" });
    return;
  }

  const normalizedPhone = phone.replace(/\s+/g, "").replace(/^\+/, "");
  if (!ALLOWED_PHONES[normalizedPhone]) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }

  const [msg] = await db.insert(messagesTable).values({
    senderId: normalizedPhone,
    content: content ?? null,
    imageData: imageData ?? null,
    messageType: messageType ?? "text",
  }).returning();

  req.log.info({ phone: normalizedPhone, type: messageType }, "Message stored via REST");
  res.status(201).json(msg);
});

export default router;
