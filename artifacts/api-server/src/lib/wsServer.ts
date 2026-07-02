import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import type { Server } from "http";
import { db } from "@workspace/db";
import { messagesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";
import { createRoom, joinRoom, getRoom, applyMove, restartRoom, deleteRoom, type GameType } from "./gameEngine";

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
  id: string;
}

// Multiple connections per phone (game page + voice widget on different pages)
const clients = new Map<string, ChatClient[]>();

function addClient(client: ChatClient) {
  const existing = clients.get(client.phone) ?? [];
  clients.set(client.phone, [...existing, client]);
}

function removeClient(phone: string, id: string) {
  const existing = clients.get(phone) ?? [];
  const updated = existing.filter(c => c.id !== id);
  if (updated.length === 0) clients.delete(phone);
  else clients.set(phone, updated);
}

function getClients(phone: string): ChatClient[] {
  return clients.get(phone) ?? [];
}

function isOnline(phone: string): boolean {
  return (clients.get(phone) ?? []).some(c => c.ws.readyState === WebSocket.OPEN);
}

// Strip secret from number guessing state before sending to clients
function sanitizeState(gameType: string, state: Record<string, unknown>): Record<string, unknown> {
  if (gameType === "numberguess") {
    const { secret: _secret, ...rest } = state;
    return rest;
  }
  return state;
}

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
    const connId = Math.random().toString(36).slice(2);
    const client: ChatClient = { ws, phone, name, id: connId };
    addClient(client);
    logger.info({ phone, connId }, "WebSocket client connected");

    broadcast({ type: "presence", phone, name, online: true });
    db.update(usersTable).set({ lastSeen: new Date() }).where(eq(usersTable.phone, phone)).catch(() => {});

    ws.on("message", async (raw) => {
      try {
        const data = JSON.parse(raw.toString()) as Record<string, unknown>;

        // ── Chat ─────────────────────────────────────────────────────────────
        if (data.type === "message") {
          const [msg] = await db.insert(messagesTable).values({
            senderId: phone,
            content: data.content ?? null,
            imageData: data.imageData ?? null,
            messageType: data.messageType ?? "text",
          }).returning();
          broadcast({ type: "message", message: msg });

        } else if (data.type === "typing") {
          broadcast({ type: "typing", phone, name, isTyping: true }, phone);
        } else if (data.type === "stop_typing") {
          broadcast({ type: "typing", phone, name, isTyping: false }, phone);
        } else if (data.type === "read") {
          broadcast({ type: "read", phone }, phone);

        // ── Game messages ─────────────────────────────────────────────────────
        } else if (data.type === "game_create") {
          const room = createRoom(phone, data.gameType as GameType);
          sendTo(phone, { type: "game_room", action: "created", roomId: room.id, gameType: room.gameType, players: room.players, state: sanitizeState(room.gameType, room.state) });

        } else if (data.type === "game_join") {
          const roomId = (data.roomId as string)?.toUpperCase();
          const { room, error } = joinRoom(roomId, phone);
          if (error || !room) { sendTo(phone, { type: "game_room", action: "error", error: error ?? "Unknown error" }); return; }
          for (const p of room.players) {
            sendTo(p, { type: "game_room", action: room.state.status === "waiting" ? "joined_waiting" : "started", roomId: room.id, gameType: room.gameType, players: room.players, state: sanitizeState(room.gameType, room.state) });
          }

        } else if (data.type === "game_move") {
          const { room, error } = applyMove(data.roomId as string, phone, data.move as Record<string, unknown>);
          if (error || !room) { sendTo(phone, { type: "game_room", action: "error", error: error ?? "Unknown error" }); return; }
          for (const p of room.players) {
            sendTo(p, { type: "game_state", roomId: room.id, gameType: room.gameType, players: room.players, state: sanitizeState(room.gameType, room.state) });
          }

        } else if (data.type === "game_restart") {
          const room = restartRoom(data.roomId as string, phone);
          if (!room) return;
          for (const p of room.players) {
            sendTo(p, { type: "game_state", roomId: room.id, gameType: room.gameType, players: room.players, state: sanitizeState(room.gameType, room.state) });
          }

        } else if (data.type === "game_leave") {
          const room = getRoom(data.roomId as string);
          if (room) {
            deleteRoom(data.roomId as string);
            for (const p of room.players) {
              if (p !== phone) sendTo(p, { type: "game_room", action: "error", error: "Other player left the game" });
            }
          }

        // ── WebRTC Voice Signaling ────────────────────────────────────────────
        } else if (data.type === "voice_offer" || data.type === "voice_answer" || data.type === "voice_ice" || data.type === "voice_end" || data.type === "voice_request") {
          // Forward to ALL connections of the other user
          for (const [otherPhone] of clients) {
            if (otherPhone !== phone) {
              sendTo(otherPhone, { ...data, from: phone });
            }
          }
        }

      } catch (e) {
        logger.warn({ err: e }, "WS message parse error");
      }
    });

    ws.on("close", () => {
      removeClient(phone, connId);
      logger.info({ phone, connId }, "WebSocket client disconnected");
      if (!isOnline(phone)) {
        broadcast({ type: "presence", phone, name, online: false });
      }
    });

    ws.on("error", (err) => {
      logger.error({ err, phone }, "WebSocket error");
    });
  });

  return wss;
}

function sendTo(phone: string, payload: object) {
  const data = JSON.stringify(payload);
  for (const client of getClients(phone)) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  }
}

function broadcast(payload: object, excludePhone?: string) {
  const data = JSON.stringify(payload);
  for (const [phone, conns] of clients) {
    if (phone === excludePhone) continue;
    for (const client of conns) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    }
  }
}
