export type GameType = "tictactoe" | "connectfour" | "rps" | "memory" | "numberguess";

export interface GameRoom {
  id: string;
  gameType: GameType;
  players: string[];
  state: Record<string, unknown>;
  createdAt: number;
}

const rooms = new Map<string, GameRoom>();

// ─── Room Management ───────────────────────────────────────────────────────

export function createRoom(phone: string, gameType: GameType): GameRoom {
  const id = Math.random().toString(36).slice(2, 8).toUpperCase();
  const room: GameRoom = {
    id,
    gameType,
    players: [phone],
    state: { status: "waiting" },
    createdAt: Date.now(),
  };
  rooms.set(id, room);
  return room;
}

export function joinRoom(roomId: string, phone: string): { room: GameRoom | null; error?: string } {
  const room = rooms.get(roomId);
  if (!room) return { room: null, error: "Room not found" };
  if (room.players.includes(phone)) return { room };
  if (room.players.length >= 2) return { room: null, error: "Room is full" };
  room.players.push(phone);
  room.state = startGame(room.gameType, room.players);
  return { room };
}

export function getRoom(roomId: string): GameRoom | undefined {
  return rooms.get(roomId);
}

export function applyMove(
  roomId: string,
  phone: string,
  move: Record<string, unknown>
): { room: GameRoom | null; error?: string } {
  const room = rooms.get(roomId);
  if (!room) return { room: null, error: "Room not found" };
  if (!room.players.includes(phone)) return { room: null, error: "Not a player" };
  const newState = applyGameMove(room.gameType, room.state, phone, move);
  room.state = newState;
  return { room };
}

export function restartRoom(roomId: string, phone: string): GameRoom | undefined {
  const room = rooms.get(roomId);
  if (!room) return undefined;
  const prevScores = room.state.scores as Record<string, number> | undefined;
  room.state = startGame(room.gameType, room.players);
  if (prevScores) (room.state as Record<string, unknown>).scores = prevScores;
  return room;
}

export function deleteRoom(roomId: string) {
  rooms.delete(roomId);
}

// ─── Game Initializers ──────────────────────────────────────────────────────

function startGame(gameType: GameType, players: string[]): Record<string, unknown> {
  const scores: Record<string, number> = {};
  for (const p of players) scores[p] = 0;

  switch (gameType) {
    case "tictactoe":
      return {
        status: "playing",
        board: Array(9).fill(null),
        symbols: { [players[0]]: "❌", [players[1]]: "⭕" },
        turn: players[0],
        winner: null,
        scores,
      };

    case "connectfour":
      return {
        status: "playing",
        board: Array.from({ length: 6 }, () => Array(7).fill(null)),
        turn: players[0],
        winner: null,
        scores,
      };

    case "rps":
      return {
        status: "playing",
        choices: { [players[0]]: null, [players[1]]: null },
        round: 1,
        totalRounds: 5,
        lastResult: null,
        scores,
      };

    case "memory": {
      const EMOJIS = ["💕", "🌹", "🎵", "🌙", "⭐", "🎀", "🦋", "💎", "🌸", "🎊", "🍀", "🌈"];
      const pairs = [...EMOJIS, ...EMOJIS]
        .sort(() => Math.random() - 0.5)
        .map((emoji, i) => ({ id: i, emoji, flipped: false, matchedBy: null as string | null }));
      return {
        status: "playing",
        cards: pairs,
        turn: players[0],
        currentFlipped: [] as number[],
        scores,
        winner: null,
      };
    }

    case "numberguess":
      return {
        status: "playing",
        secret: Math.floor(Math.random() * 100) + 1,
        turn: players[0],
        guesses: [] as { phone: string; guess: number; hint: string }[],
        scores,
        winner: null,
        maxGuesses: 20,
      };

    default:
      return { status: "playing", scores };
  }
}

// ─── Move Applicators ───────────────────────────────────────────────────────

function applyGameMove(
  gameType: GameType,
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
  switch (gameType) {
    case "tictactoe": return applyTTT(state, phone, move);
    case "connectfour": return applyC4(state, phone, move);
    case "rps": return applyRPS(state, phone, move);
    case "memory": return applyMemory(state, phone, move);
    case "numberguess": return applyNumberGuess(state, phone, move);
    default: return state;
  }
}

// TicTacToe
function applyTTT(state: Record<string, unknown>, phone: string, move: Record<string, unknown>): Record<string, unknown> {
  if (state.turn !== phone || state.winner) return state;
  const board = [...(state.board as (string | null)[])];
  const index = move.index as number;
  if (board[index] !== null) return state;

  const symbols = state.symbols as Record<string, string>;
  board[index] = symbols[phone];

  const players = Object.keys(symbols);
  const other = players.find(p => p !== phone)!;

  const winner = checkTTTWinner(board);
  const scores = { ...(state.scores as Record<string, number>) };

  let winnerPhone: string | null = null;
  if (winner && winner !== "draw") {
    winnerPhone = Object.entries(symbols).find(([, s]) => s === winner)?.[0] ?? null;
    if (winnerPhone) scores[winnerPhone] = (scores[winnerPhone] || 0) + 1;
  }

  return {
    ...state,
    board,
    turn: winner ? phone : other,
    winner: winner === "draw" ? "draw" : winnerPhone,
    status: winner ? "finished" : "playing",
    scores,
  };
}

function checkTTTWinner(board: (string | null)[]) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  if (board.every(c => c !== null)) return "draw";
  return null;
}

// Connect Four
function applyC4(state: Record<string, unknown>, phone: string, move: Record<string, unknown>): Record<string, unknown> {
  if (state.turn !== phone || state.winner) return state;

  const board = (state.board as (string | null)[][]).map(r => [...r]);
  const col = move.col as number;

  let row = -1;
  for (let r = 5; r >= 0; r--) {
    if (board[r][col] === null) { row = r; break; }
  }
  if (row === -1) return state;

  const players = Object.keys(state.scores as Record<string, number>);
  board[row][col] = phone;
  const other = players.find(p => p !== phone)!;

  const winner = checkC4Winner(board, phone);
  const isDraw = !winner && board[0].every(c => c !== null);
  const scores = { ...(state.scores as Record<string, number>) };
  if (winner) scores[phone] = (scores[phone] || 0) + 1;

  return {
    ...state,
    board,
    turn: (winner || isDraw) ? phone : other,
    winner: winner ? phone : isDraw ? "draw" : null,
    status: (winner || isDraw) ? "finished" : "playing",
    scores,
  };
}

function checkC4Winner(board: (string | null)[][], phone: string): boolean {
  const rows = board.length, cols = board[0].length;
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== phone) continue;
      for (const [dr, dc] of dirs) {
        let count = 1;
        for (let k = 1; k < 4; k++) {
          const nr = r + dr * k, nc = c + dc * k;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== phone) break;
          count++;
        }
        if (count >= 4) return true;
      }
    }
  }
  return false;
}

// Rock Paper Scissors
function applyRPS(state: Record<string, unknown>, phone: string, move: Record<string, unknown>): Record<string, unknown> {
  const choices = { ...(state.choices as Record<string, string | null>) };
  choices[phone] = move.choice as string;

  const players = Object.keys(choices);
  const allChosen = players.every(p => choices[p] !== null);

  if (!allChosen) return { ...state, choices };

  const [p1, p2] = players;
  const c1 = choices[p1]!, c2 = choices[p2]!;
  const scores = { ...(state.scores as Record<string, number>) };
  let lastResult: Record<string, unknown>;

  const beats: Record<string, string> = { rock: "scissors", paper: "rock", scissors: "paper" };
  if (c1 === c2) {
    lastResult = { winner: "draw", reason: "It's a tie!" };
  } else if (beats[c1] === c2) {
    scores[p1] = (scores[p1] || 0) + 1;
    lastResult = { winner: p1, reason: `${c1} beats ${c2}!` };
  } else {
    scores[p2] = (scores[p2] || 0) + 1;
    lastResult = { winner: p2, reason: `${c2} beats ${c1}!` };
  }

  const round = (state.round as number);
  const totalRounds = state.totalRounds as number;
  const finished = round >= totalRounds;

  const overallWinner = finished
    ? scores[p1] > scores[p2] ? p1 : scores[p2] > scores[p1] ? p2 : "draw"
    : null;

  return {
    ...state,
    choices: finished ? choices : { [p1]: null, [p2]: null },
    round: finished ? round : round + 1,
    lastResult,
    scores,
    status: finished ? "finished" : "playing",
    winner: overallWinner,
  };
}

// Memory Match
function applyMemory(state: Record<string, unknown>, phone: string, move: Record<string, unknown>): Record<string, unknown> {
  if (state.turn !== phone) return state;

  const cards = (state.cards as { id: number; emoji: string; flipped: boolean; matchedBy: string | null }[]).map(c => ({ ...c }));
  const currentFlipped = [...(state.currentFlipped as number[])];
  const cardId = move.cardId as number;
  const card = cards.find(c => c.id === cardId);

  if (!card || card.flipped || card.matchedBy || currentFlipped.includes(cardId)) return state;

  card.flipped = true;
  currentFlipped.push(cardId);

  if (currentFlipped.length < 2) {
    return { ...state, cards, currentFlipped };
  }

  // Second card flipped — check match
  const [id1, id2] = currentFlipped;
  const c1 = cards.find(c => c.id === id1)!;
  const c2 = cards.find(c => c.id === id2)!;

  const players = Object.keys(state.scores as Record<string, number>);
  const other = players.find(p => p !== phone)!;
  const scores = { ...(state.scores as Record<string, number>) };

  let matched = false;
  if (c1.emoji === c2.emoji) {
    c1.matchedBy = phone;
    c2.matchedBy = phone;
    scores[phone] = (scores[phone] || 0) + 1;
    matched = true;
  } else {
    setTimeout(() => {}, 0); // frontend handles flip-back after delay
    c1.flipped = false;
    c2.flipped = false;
  }

  const allMatched = cards.every(c => c.matchedBy !== null);
  const winner = allMatched
    ? scores[players[0]] > scores[players[1]] ? players[0] : scores[players[1]] > scores[players[0]] ? players[1] : "draw"
    : null;

  return {
    ...state,
    cards,
    currentFlipped: [],
    turn: matched ? phone : other,
    scores,
    status: allMatched ? "finished" : "playing",
    winner,
    lastFlipped: currentFlipped,
    lastMatch: matched,
  };
}

// Number Guessing
function applyNumberGuess(state: Record<string, unknown>, phone: string, move: Record<string, unknown>): Record<string, unknown> {
  if (state.turn !== phone || state.winner) return state;

  const secret = state.secret as number;
  const guess = move.guess as number;
  const guesses = [...(state.guesses as { phone: string; guess: number; hint: string }[])];

  const players = Object.keys(state.scores as Record<string, number>);
  const other = players.find(p => p !== phone)!;
  const scores = { ...(state.scores as Record<string, number>) };

  let hint: string;
  let winner: string | null = null;

  if (guess === secret) {
    hint = "correct";
    winner = phone;
    scores[phone] = (scores[phone] || 0) + 1;
  } else if (guess < secret) {
    hint = "higher";
  } else {
    hint = "lower";
  }

  guesses.push({ phone, guess, hint });

  const maxGuesses = state.maxGuesses as number;
  const finished = winner !== null || guesses.length >= maxGuesses;

  return {
    ...state,
    guesses,
    turn: finished ? phone : other,
    winner: finished && !winner ? "draw" : winner,
    status: finished ? "finished" : "playing",
    scores,
  };
}
