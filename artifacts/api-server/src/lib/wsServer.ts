import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import type { Server } from "http";
import { db } from "@workspace/db";
import { messagesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const ALLOWED_PHONES: Record<string, string> = {
  "919944293646": "Prathish",
  "919940739865": "Sradhaa",
  "91994039865": "Sradhaa",
  "9199440398651": "Sradhaa",
};

interface ChatClient {
  ws: WebSocket;
  phone: string;
  name: string;
}

const clients = new Map<string, ChatClient>();

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/ws" });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "", "http://localhost");
    const phone = url.searchParams.get("phone")?.replace(/\s+/g, "").replace(/^\+/, "") ?? "";

    if (!ALLOWED_PHONES[phone]) {
      ws.close(4001, "Unauthorized");
      return;
    }

    const name = ALLOWED_PHONES[phone];
    clients.set(phone, { ws, phone, name });
    logger.info({ phone }, "WebSocket client connected");

    // Notify both users of online status
    broadcast({ type: "presence", phone, name, online: true });

    // Update last seen
    db.update(usersTable).set({ lastSeen: new Date() }).where(eq(usersTable.phone, phone)).catch(() => {});

    ws.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString()) as {
          type: string;
          content?: string;
          imageData?: string;
          messageType?: string;
        };

        if (data.type === "message") {
          const [msg] = await db.insert(messagesTable).values({
            senderId: phone,
            content: data.content ?? null,
            imageData: data.imageData ?? null,
            messageType: data.messageType ?? "text",
          }).returning();

          // Broadcast to all connected clients
          broadcast({ type: "message", message: msg });
        } else if (data.type === "typing") {
          broadcast({ type: "typing", phone, name, isTyping: true }, phone);
        } else if (data.type === "stop_typing") {
          broadcast({ type: "typing", phone, name, isTyping: false }, phone);
        } else if (data.type === "read") {
          broadcast({ type: "read", phone }, phone);
        }
      } catch (e) {
        logger.warn({ err: e }, "WS message parse error");
      }
    });

    ws.on("close", () => {
      clients.delete(phone);
      logger.info({ phone }, "WebSocket client disconnected");
      broadcast({ type: "presence", phone, name, online: false });
    });

    ws.on("error", (err) => {
      logger.error({ err, phone }, "WebSocket error");
    });
  });

  return wss;
}

function broadcast(payload: object, excludePhone?: string) {
  const data = JSON.stringify(payload);
  for (const [phone, client] of clients) {
    if (phone === excludePhone) continue;
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  }
  // Also send back to self for message type
  if (!excludePhone && "message" in (payload as Record<string, unknown>)) {
    return;
  }
  // Send to self for own messages too
  if ((payload as Record<string, unknown>).type === "message" && excludePhone === undefined) {
    for (const client of clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    }
  }
}
