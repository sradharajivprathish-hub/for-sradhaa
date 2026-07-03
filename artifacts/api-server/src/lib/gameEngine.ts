export type GameType =
  | "tictactoe"
  | "connectfour"
  | "rps"
  | "memory"
  | "numberguess"
  | "dotsboxes"
  | "hangman"
  | "wordguess"
  | "mathchallenge"
  | "quizbattle";

export interface GameRoom {
  id: string;
  gameType: GameType;
  players: string[];
  state: Record<string, unknown>;
  createdAt: number;
}

const rooms = new Map<string, GameRoom>();

// ─── Room Management ──────────────────────────────────────────────────────────

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

export function joinRoom(
  roomId: string,
  phone: string
): { room: GameRoom | null; error?: string } {
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

/** Strip secret fields before sending state to clients */
export function sanitizeState(
  gameType: GameType,
  state: Record<string, unknown>
): Record<string, unknown> {
  if (gameType === "numberguess") {
    if (state.winner) return state; // reveal on win
    const { secret: _s, ...rest } = state as Record<string, unknown> & { secret?: unknown };
    return rest;
  }
  if (gameType === "hangman" || gameType === "wordguess") {
    if (state.revealWord) return state;
    const { _secret: _s, ...rest } = state as Record<string, unknown> & { _secret?: unknown };
    return rest;
  }
  if (gameType === "mathchallenge") {
    // Strip _answer from each problem in the array
    const problems = (state.problems as Record<string, unknown>[]).map(
      ({ _answer: _a, ...p }) => p
    );
    return { ...state, problems };
  }
  if (gameType === "quizbattle") {
    if (state.roundResolved) return state;
    // Strip correctIdx from current question only
    const questions = (state.questions as Record<string, unknown>[]).map((q, i) => {
      if (i === (state.currentQ as number)) {
        const { correctIdx: _ci, ...rest } = q as Record<string, unknown> & { correctIdx?: number };
        return rest;
      }
      return q;
    });
    return { ...state, questions };
  }
  return state;
}

// ─── Game Initializers ────────────────────────────────────────────────────────

function startGame(
  gameType: GameType,
  players: string[]
): Record<string, unknown> {
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
        colors: { [players[0]]: "🔴", [players[1]]: "🟡" },
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

    case "dotsboxes": {
      return {
        status: "playing",
        // hLines[row][col]: 5 rows × 4 cols = horizontal lines between dots
        hLines: Array.from({ length: 5 }, () => Array(4).fill(false)),
        // vLines[row][col]: 4 rows × 5 cols = vertical lines between dots
        vLines: Array.from({ length: 4 }, () => Array(5).fill(false)),
        // boxes[row][col]: 4×4 = which player claimed each box
        boxes: Array.from({ length: 4 }, () => Array(4).fill(null)),
        turn: players[0],
        scores,
        winner: null,
      };
    }

    case "hangman": {
      const WORDS = [
        "LOVE", "HEART", "DREAM", "SWEET", "HONEY", "ANGEL", "FLAME",
        "SMILE", "DANCE", "BLISS", "GRACE", "MAGIC", "PEACE", "BRAVE",
        "FOREVER", "TOGETHER", "CHERISH", "DIAMOND", "PARADISE", "ROMANCE",
      ];
      const idx = Math.floor(Math.random() * WORDS.length);
      const word = WORDS[idx];
      return {
        status: "playing",
        _secret: word,
        maskedWord: "_".repeat(word.length),
        wordLength: word.length,
        guessedLetters: [] as string[],
        wrongLetters: [] as string[],
        wrongCount: 0,
        maxWrong: 6,
        turn: players[0],
        playerCorrectCount: { [players[0]]: 0, [players[1]]: 0 },
        scores,
        round: 1,
        totalRounds: 3,
        roundWinner: null as string | null,
        revealWord: null as string | null,
        winner: null as string | null,
      };
    }

    case "wordguess": {
      const WORDS = [
        "LOVER", "BLISS", "GRACE", "SWEET", "HEART", "FLAME",
        "ANGEL", "CHARM", "ADORE", "FANCY", "BLOOM", "GLOW",
      ];
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      return {
        status: "playing",
        _secret: word,
        wordLength: 5,
        guesses: { [players[0]]: [], [players[1]]: [] } as Record<string, { word: string; result: string[] }[]>,
        turn: players[0],
        maxGuessesPerPlayer: 6,
        roundWinner: null as string | null,
        revealWord: null as string | null,
        round: 1,
        totalRounds: 3,
        scores,
        winner: null as string | null,
      };
    }

    case "mathchallenge": {
      const problems = generateMathProblems(20);
      return {
        status: "playing",
        problems,
        currentProblemIdx: 0,
        turn: players[0],
        lastResult: null as { correct: boolean; answer: number; correctAnswer: number } | null,
        scores,
        winner: null as string | null,
      };
    }

    case "quizbattle": {
      const qs = shuffleArray([...QUIZ_QUESTIONS]).slice(0, 10);
      return {
        status: "playing",
        questions: qs,
        currentQ: 0,
        roundResolved: false,
        roundAnswers: {} as Record<string, number | null>,
        roundFirstCorrect: null as string | null,
        lastResult: null as { correctIdx: number; winner: string } | null,
        scores,
        winner: null as string | null,
      };
    }

    default:
      return { status: "playing", scores };
  }
}

// ─── Move Applicators ─────────────────────────────────────────────────────────

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
    case "dotsboxes": return applyDotsBoxes(state, phone, move);
    case "hangman": return applyHangman(state, phone, move);
    case "wordguess": return applyWordGuess(state, phone, move);
    case "mathchallenge": return applyMathChallenge(state, phone, move);
    case "quizbattle": return applyQuizBattle(state, phone, move);
    default: return state;
  }
}

// ─── TicTacToe ───────────────────────────────────────────────────────────────

function applyTTT(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
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

// ─── Connect Four ─────────────────────────────────────────────────────────────

function applyC4(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
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

// ─── Rock Paper Scissors ──────────────────────────────────────────────────────

function applyRPS(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
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
  const round = state.round as number;
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

// ─── Memory Match ─────────────────────────────────────────────────────────────

function applyMemory(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
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
  const [id1, id2] = currentFlipped;
  const c1 = cards.find(c => c.id === id1)!;
  const c2 = cards.find(c => c.id === id2)!;
  const players = Object.keys(state.scores as Record<string, number>);
  const other = players.find(p => p !== phone)!;
  const scores = { ...(state.scores as Record<string, number>) };
  let matched = false;
  if (c1.emoji === c2.emoji) {
    c1.matchedBy = phone; c2.matchedBy = phone;
    scores[phone] = (scores[phone] || 0) + 1;
    matched = true;
  } else {
    c1.flipped = false; c2.flipped = false;
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

// ─── Number Guessing ──────────────────────────────────────────────────────────

function applyNumberGuess(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
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
    hint = "correct"; winner = phone;
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

// ─── Dots and Boxes ───────────────────────────────────────────────────────────

function applyDotsBoxes(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
  if (state.turn !== phone || state.winner) return state;
  const { lineType, row, col } = move as { lineType: "h" | "v"; row: number; col: number };

  const hLines = (state.hLines as boolean[][]).map(r => [...r]);
  const vLines = (state.vLines as boolean[][]).map(r => [...r]);
  const boxes = (state.boxes as (string | null)[][]).map(r => [...r]);
  const scores = { ...(state.scores as Record<string, number>) };
  const players = Object.keys(scores);
  const other = players.find(p => p !== phone)!;

  // Validate and draw the line
  if (lineType === "h") {
    if (row < 0 || row > 4 || col < 0 || col > 3 || hLines[row][col]) return state;
    hLines[row][col] = true;
  } else {
    if (row < 0 || row > 3 || col < 0 || col > 4 || vLines[row][col]) return state;
    vLines[row][col] = true;
  }

  // Check if any box was completed
  let boxesCompleted = 0;
  const checkBox = (r: number, c: number) => {
    if (r < 0 || r > 3 || c < 0 || c > 3 || boxes[r][c] !== null) return;
    if (hLines[r][c] && hLines[r + 1][c] && vLines[r][c] && vLines[r][c + 1]) {
      boxes[r][c] = phone;
      scores[phone] = (scores[phone] || 0) + 1;
      boxesCompleted++;
    }
  };

  if (lineType === "h") {
    checkBox(row - 1, col); // box above
    checkBox(row, col);     // box below
  } else {
    checkBox(row, col - 1); // box to left
    checkBox(row, col);     // box to right
  }

  const totalBoxes = 16;
  const claimedBoxes = boxes.flat().filter(b => b !== null).length;
  const finished = claimedBoxes >= totalBoxes;
  let winner: string | null = null;
  if (finished) {
    const p1score = scores[players[0]], p2score = scores[players[1]];
    winner = p1score > p2score ? players[0] : p2score > p1score ? players[1] : "draw";
  }

  return {
    ...state,
    hLines,
    vLines,
    boxes,
    turn: boxesCompleted > 0 ? phone : other, // extra turn if box completed
    scores,
    status: finished ? "finished" : "playing",
    winner,
  };
}

// ─── Hangman ──────────────────────────────────────────────────────────────────

function applyHangman(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
  // Handle next round action
  if (move.action === "next_round") {
    const round = (state.round as number) + 1;
    const totalRounds = state.totalRounds as number;
    const scores = state.scores as Record<string, number>;
    if (round > totalRounds) {
      const players = Object.keys(scores);
      const winner = scores[players[0]] > scores[players[1]]
        ? players[0] : scores[players[1]] > scores[players[0]] ? players[1] : "draw";
      return { ...state, status: "finished", winner };
    }
    const WORDS = [
      "LOVE","HEART","DREAM","SWEET","HONEY","ANGEL","FLAME","SMILE","DANCE","BLISS",
      "GRACE","MAGIC","PEACE","BRAVE","FOREVER","TOGETHER","CHERISH","DIAMOND","PARADISE","ROMANCE",
    ];
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const players = Object.keys(scores);
    return {
      ...state,
      _secret: word,
      maskedWord: "_".repeat(word.length),
      wordLength: word.length,
      guessedLetters: [],
      wrongLetters: [],
      wrongCount: 0,
      turn: phone, // whoever requested next round goes first
      playerCorrectCount: { [players[0]]: 0, [players[1]]: 0 },
      round,
      roundWinner: null,
      revealWord: null,
      status: "playing",
    };
  }

  if (state.status !== "playing" || state.turn !== phone) return state;

  const letter = (move.letter as string).toUpperCase();
  const secret = state._secret as string;
  const guessedLetters = [...(state.guessedLetters as string[])];
  const wrongLetters = [...(state.wrongLetters as string[])];
  const playerCorrectCount = { ...(state.playerCorrectCount as Record<string, number>) };
  const scores = { ...(state.scores as Record<string, number>) };
  const players = Object.keys(scores);
  const other = players.find(p => p !== phone)!;

  if (guessedLetters.includes(letter)) return state; // already guessed
  guessedLetters.push(letter);

  let wrongCount = state.wrongCount as number;
  const maxWrong = state.maxWrong as number;

  if (secret.includes(letter)) {
    // Correct guess: count occurrences
    const count = secret.split("").filter(c => c === letter).length;
    playerCorrectCount[phone] = (playerCorrectCount[phone] || 0) + count;
  } else {
    // Wrong guess
    wrongLetters.push(letter);
    wrongCount++;
  }

  // Update masked word
  const maskedWord = secret
    .split("")
    .map(c => (guessedLetters.includes(c) ? c : "_"))
    .join("");

  // Check round end conditions
  const wordComplete = !maskedWord.includes("_");
  const hanged = wrongCount >= maxWrong;

  let roundWinner: string | null = null;
  let status = "playing";
  let revealWord: string | null = null;
  let nextTurn = secret.includes(letter) ? phone : other; // stay on turn if correct

  if (wordComplete || hanged) {
    status = "round_end";
    revealWord = secret;
    const p1c = playerCorrectCount[players[0]], p2c = playerCorrectCount[players[1]];
    roundWinner = p1c > p2c ? players[0] : p2c > p1c ? players[1] : "draw";
    if (roundWinner !== "draw") scores[roundWinner] = (scores[roundWinner] || 0) + 1;
  }

  return {
    ...state,
    guessedLetters,
    wrongLetters,
    wrongCount,
    maskedWord,
    playerCorrectCount,
    turn: nextTurn,
    status,
    roundWinner,
    revealWord,
    scores,
  };
}

// ─── Word Guess (Wordle) ──────────────────────────────────────────────────────

function applyWordGuess(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
  if (move.action === "next_round") {
    const round = (state.round as number) + 1;
    const scores = state.scores as Record<string, number>;
    const totalRounds = state.totalRounds as number;
    if (round > totalRounds) {
      const players = Object.keys(scores);
      const winner = scores[players[0]] > scores[players[1]]
        ? players[0] : scores[players[1]] > scores[players[0]] ? players[1] : "draw";
      return { ...state, status: "finished", winner };
    }
    const WORDS = ["LOVER","BLISS","GRACE","SWEET","HEART","FLAME","ANGEL","CHARM","ADORE","FANCY","BLOOM","GLOW"];
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const players = Object.keys(scores);
    return {
      ...state,
      _secret: word,
      guesses: { [players[0]]: [], [players[1]]: [] },
      turn: phone,
      roundWinner: null,
      revealWord: null,
      round,
      status: "playing",
    };
  }

  if (state.turn !== phone || state.status !== "playing") return state;

  const guess = (move.word as string).toUpperCase().trim();
  if (guess.length !== 5) return state;

  const secret = state._secret as string;
  const result = evaluateWordleGuess(guess, secret);

  const guesses = JSON.parse(JSON.stringify(state.guesses)) as Record<string, { word: string; result: string[] }[]>;
  guesses[phone].push({ word: guess, result });

  const players = Object.keys(state.scores as Record<string, number>);
  const other = players.find(p => p !== phone)!;
  const scores = { ...(state.scores as Record<string, number>) };
  const maxGuessesPerPlayer = state.maxGuessesPerPlayer as number;

  const wonThisGuess = result.every(r => r === "correct");
  const p1Done = guesses[players[0]].length >= maxGuessesPerPlayer;
  const p2Done = guesses[players[1]].length >= maxGuessesPerPlayer;
  const bothDone = p1Done && p2Done;

  let roundWinner: string | null = null;
  let revealWord: string | null = null;
  let status = "playing";

  if (wonThisGuess) {
    roundWinner = phone;
    revealWord = secret;
    status = "round_end";
    scores[phone] = (scores[phone] || 0) + 1;
  } else if (bothDone) {
    roundWinner = "draw";
    revealWord = secret;
    status = "round_end";
  }

  return {
    ...state,
    guesses,
    turn: status === "playing" ? other : phone,
    scores,
    roundWinner,
    revealWord,
    status,
  };
}

function evaluateWordleGuess(guess: string, secret: string): string[] {
  const result = Array(5).fill("absent");
  const secretArr = secret.split("");
  const guessArr = guess.split("");
  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = "correct";
      secretArr[i] = "";
      guessArr[i] = "";
    }
  }
  // Second pass: present
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === "") continue;
    const idx = secretArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = "present";
      secretArr[idx] = "";
    }
  }
  return result;
}

// ─── Math Challenge ───────────────────────────────────────────────────────────

function applyMathChallenge(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
  if (state.turn !== phone) return state;

  const problems = state.problems as { question: string; _answer: number }[];
  const currentProblemIdx = state.currentProblemIdx as number;
  if (currentProblemIdx >= problems.length) return state;

  const current = problems[currentProblemIdx];
  const answer = move.answer as number;
  const correct = answer === current._answer;
  const scores = { ...(state.scores as Record<string, number>) };
  if (correct) scores[phone] = (scores[phone] || 0) + 1;

  const players = Object.keys(scores);
  const other = players.find(p => p !== phone)!;
  const nextIdx = currentProblemIdx + 1;
  const finished = nextIdx >= problems.length;

  let winner: string | null = null;
  if (finished) {
    winner = scores[players[0]] > scores[players[1]]
      ? players[0] : scores[players[1]] > scores[players[0]] ? players[1] : "draw";
  }

  return {
    ...state,
    currentProblemIdx: nextIdx,
    turn: other,
    lastResult: { correct, answer, correctAnswer: current._answer },
    scores,
    status: finished ? "finished" : "playing",
    winner,
  };
}

function generateMathProblems(count: number): { question: string; _answer: number }[] {
  const problems: { question: string; _answer: number }[] = [];
  for (let i = 0; i < count; i++) {
    const type = i % 3;
    let question: string, _answer: number;
    if (type === 0) {
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 50) + 10;
      question = `${a} + ${b} = ?`; _answer = a + b;
    } else if (type === 1) {
      const a = Math.floor(Math.random() * 50) + 30;
      const b = Math.floor(Math.random() * 30) + 1;
      question = `${a} - ${b} = ?`; _answer = a - b;
    } else {
      const a = Math.floor(Math.random() * 9) + 2;
      const b = Math.floor(Math.random() * 9) + 2;
      question = `${a} × ${b} = ?`; _answer = a * b;
    }
    problems.push({ question, _answer });
  }
  return problems;
}

// ─── Quiz Battle ──────────────────────────────────────────────────────────────

function applyQuizBattle(
  state: Record<string, unknown>,
  phone: string,
  move: Record<string, unknown>
): Record<string, unknown> {
  const questions = state.questions as { question: string; options: string[]; correctIdx: number }[];
  const currentQ = state.currentQ as number;
  if (currentQ >= questions.length) return state;

  const roundAnswers = { ...(state.roundAnswers as Record<string, number | null>) };
  if (roundAnswers[phone] !== undefined && roundAnswers[phone] !== null) return state; // already answered

  const answerIdx = move.answerIdx as number;
  roundAnswers[phone] = answerIdx;

  const players = Object.keys(state.scores as Record<string, number>);
  const allAnswered = players.every(p => roundAnswers[p] !== undefined && roundAnswers[p] !== null);
  const correctIdx = questions[currentQ].correctIdx;
  const scores = { ...(state.scores as Record<string, number>) };

  const roundFirstCorrect = state.roundFirstCorrect as string | null;

  // Check if this player answered correctly and no one else has yet
  let newFirstCorrect = roundFirstCorrect;
  if (answerIdx === correctIdx && !roundFirstCorrect) {
    newFirstCorrect = phone;
    scores[phone] = (scores[phone] || 0) + 1;
  }

  const resolved = allAnswered || newFirstCorrect !== null;
  if (!resolved) {
    return { ...state, roundAnswers, roundFirstCorrect: newFirstCorrect };
  }

  // Resolve round
  let roundWinner: string;
  if (newFirstCorrect) {
    roundWinner = newFirstCorrect;
  } else {
    roundWinner = "draw";
  }

  const nextQ = currentQ + 1;
  const finished = nextQ >= questions.length;
  let winner: string | null = null;
  if (finished) {
    winner = scores[players[0]] > scores[players[1]]
      ? players[0] : scores[players[1]] > scores[players[0]] ? players[1] : "draw";
  }

  return {
    ...state,
    roundAnswers: finished ? roundAnswers : {},
    roundFirstCorrect: finished ? newFirstCorrect : null,
    roundResolved: true,
    currentQ: nextQ,
    lastResult: { correctIdx, winner: roundWinner },
    scores,
    status: finished ? "finished" : "playing",
    winner,
    roundResolved_prev: resolved,
  };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const QUIZ_QUESTIONS = [
  { question: "Which planet is the 'Red Planet'?", options: ["Venus","Mars","Jupiter","Saturn"], correctIdx: 1 },
  { question: "What does XOXO mean?", options: ["Hugs & Kisses","Big & Small","Love & Peace","Hello"], correctIdx: 0 },
  { question: "How many hearts does an octopus have?", options: ["1","2","3","4"], correctIdx: 2 },
  { question: "What color is made by mixing red + blue?", options: ["Green","Purple","Orange","Brown"], correctIdx: 1 },
  { question: "What language is spoken in Brazil?", options: ["Spanish","English","French","Portuguese"], correctIdx: 3 },
  { question: "Which is the fastest land animal?", options: ["Lion","Horse","Cheetah","Leopard"], correctIdx: 2 },
  { question: "How many sides does a hexagon have?", options: ["5","6","7","8"], correctIdx: 1 },
  { question: "Chemical symbol for water?", options: ["WO","H2O","HO","W2O"], correctIdx: 1 },
  { question: "A dog's strongest sense?", options: ["Sight","Hearing","Smell","Touch"], correctIdx: 2 },
  { question: "What is 7 × 8?", options: ["54","56","58","64"], correctIdx: 1 },
  { question: "How many continents are there?", options: ["5","6","7","8"], correctIdx: 2 },
  { question: "What is the longest river in the world?", options: ["Amazon","Yangtze","Nile","Congo"], correctIdx: 2 },
  { question: "What is 12 × 12?", options: ["124","134","144","154"], correctIdx: 2 },
  { question: "Which element has symbol 'O'?", options: ["Gold","Oxygen","Silver","Iron"], correctIdx: 1 },
  { question: "How many bones in the human body?", options: ["186","206","226","246"], correctIdx: 1 },
];
