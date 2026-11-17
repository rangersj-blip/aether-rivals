const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 8000);
const dataDirectory = path.resolve(process.env.AETHER_DATA_DIR || path.join(__dirname, 'data'));
const dataFile = path.join(dataDirectory, 'players.json');
const onlineWindowMs = 45_000;
const players = loadPlayers();
const onlinePlayers = new Map();
const eventTickets = new Map();
const eventStreams = new Set();
const friendAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function loadPlayers() {
  if (!fs.existsSync(dataFile)) return [];
  const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error('data/players.json must contain a player array.');
  return parsed;
}

function savePlayers() {
  fs.mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  const temporaryFile = path.join(dataDirectory, `.players-${process.pid}.tmp`);
  fs.writeFileSync(temporaryFile, JSON.stringify(players, null, 2), { mode: 0o600 });
  fs.renameSync(temporaryFile, dataFile);
}

function respondJson(response, status, value) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(value === null ? '' : JSON.stringify(value));
}

async function readJson(request) {
  let raw = '';
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 16_384) throw new HttpError(413, 'Request body is too large.');
  }
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.');
  }
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function hashesMatch(storedHash, suppliedHash) {
  if (typeof storedHash !== 'string' || typeof suppliedHash !== 'string') return false;
  const stored = Buffer.from(storedHash, 'hex');
  const supplied = Buffer.from(suppliedHash, 'hex');
  return stored.length === supplied.length && stored.length > 0 && crypto.timingSafeEqual(stored, supplied);
}

function requirePlayer(request) {
  const match = /^Bearer ([a-f0-9]{64})$/i.exec(request.headers.authorization || '');
  if (!match) throw new HttpError(401, 'Connect with your pilot profile first.');
  const suppliedHash = hashToken(match[1]);
  const player = players.find((candidate) => hashesMatch(candidate.tokenHash, suppliedHash));
  if (!player) throw new HttpError(401, 'This pilot session is no longer valid. Reconnect your profile.');
  return player;
}

function isOnline(playerId, now = Date.now()) {
  const lastSeen = onlinePlayers.get(playerId);
  return Boolean(lastSeen && now - lastSeen < onlineWindowMs);
}

function safePlayer(player, now = Date.now()) {
  return {
    id: player.id,
    username: player.username,
    friendCode: player.friendCode,
    bestScore: player.bestScore,
    online: isOnline(player.id, now)
  };
}

function makeSnapshot(playerId) {
  const player = players.find((candidate) => candidate.id === playerId);
  if (!player) throw new HttpError(401, 'Pilot profile not found.');
  const now = Date.now();
  const friends = player.friends
    .map((friendId) => players.find((candidate) => candidate.id === friendId))
    .filter(Boolean)
    .map((friend) => safePlayer(friend, now))
    .sort((a, b) => Number(b.online) - Number(a.online) || a.username.localeCompare(b.username));
  const leaderboard = [...players]
    .sort((a, b) => b.bestScore - a.bestScore || a.username.localeCompare(b.username))
    .slice(0, 10)
    .map((entry) => safePlayer(entry, now));
  return { player: safePlayer(player, now), friends, leaderboard };
}

function sendSnapshot(stream) {
  if (stream.response.destroyed) {
    eventStreams.delete(stream);
    return;
  }
  stream.response.write(`event: snapshot\ndata: ${JSON.stringify(makeSnapshot(stream.playerId))}\n\n`);
}

function broadcastSnapshots() {
  for (const stream of eventStreams) {
    try {
      sendSnapshot(stream);
    } catch (error) {
      console.error('Unable to update a live game stream:', error.message);
      stream.response.destroy();
      eventStreams.delete(stream);
    }
  }
}

function newFriendCode() {
  let code;
  do {
    code = Array.from(crypto.randomBytes(8), (byte) => friendAlphabet[byte % friendAlphabet.length]).join('');
  } while (players.some((player) => player.friendCode === code));
  return code;
}

function requireUsername(value) {
  if (typeof value !== 'string') throw new HttpError(400, 'Enter a pilot name.');
  const username = value.trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,15}$/.test(username)) {
    throw new HttpError(400, 'Pilot names must be 3–16 letters, numbers, underscores, or hyphens.');
  }
  return username;
}

async function handleApi(request, response, url) {
  if (request.method === 'POST' && url.pathname === '/api/session') {
    const body = await readJson(request);
    const username = requireUsername(body.username);
    const usernameKey = username.toLowerCase();
    let player;
    let token = body.token;

    if (token !== undefined && token !== null && token !== '') {
      if (typeof token !== 'string' || !/^[a-f0-9]{64}$/i.test(token)) {
        throw new HttpError(401, 'Saved pilot session is invalid.');
      }
      const tokenHash = hashToken(token);
      player = players.find((candidate) => hashesMatch(candidate.tokenHash, tokenHash));
      if (!player) throw new HttpError(401, 'Saved pilot session was not recognized.');
      if (player.username.toLowerCase() !== usernameKey) {
        throw new HttpError(409, 'This browser is already linked to a different pilot name.');
      }
    } else {
      if (players.some((candidate) => candidate.username.toLowerCase() === usernameKey)) {
        throw new HttpError(409, 'That pilot name is already in use. Reconnect from the browser that created it.');
      }
      token = crypto.randomBytes(32).toString('hex');
      player = {
        id: crypto.randomUUID(),
        username,
        friendCode: newFriendCode(),
        tokenHash: hashToken(token),
        friends: [],
        bestScore: 0,
        createdAt: Date.now()
      };
      players.push(player);
      savePlayers();
    }
    onlinePlayers.set(player.id, Date.now());
    broadcastSnapshots();
    respondJson(response, 200, { token, ...makeSnapshot(player.id) });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/health') {
    respondJson(response, 200, { status: 'ok' });
    return;
  }

  const player = requirePlayer(request);

  if (request.method === 'GET' && url.pathname === '/api/state') {
    onlinePlayers.set(player.id, Date.now());
    respondJson(response, 200, makeSnapshot(player.id));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/heartbeat') {
    onlinePlayers.set(player.id, Date.now());
    response.writeHead(204, { 'Cache-Control': 'no-store' });
    response.end();
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/events-ticket') {
    const ticket = crypto.randomBytes(24).toString('hex');
    eventTickets.set(ticket, { playerId: player.id, expiresAt: Date.now() + 60_000 });
    respondJson(response, 200, { ticket });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/score') {
    const body = await readJson(request);
    if (!Number.isSafeInteger(body.score) || body.score < 0 || body.score > 1_000_000) {
      throw new HttpError(400, 'Score must be a whole number between 0 and 1,000,000.');
    }
    if (body.score > player.bestScore) {
      player.bestScore = body.score;
      savePlayers();
      broadcastSnapshots();
    }
    respondJson(response, 200, makeSnapshot(player.id));
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/friends') {
    const body = await readJson(request);
    if (typeof body.friendCode !== 'string') throw new HttpError(400, 'Enter a friend code.');
    const friendCode = body.friendCode.trim().toUpperCase();
    const friend = players.find((candidate) => candidate.friendCode === friendCode);
    if (!friend) throw new HttpError(404, 'No pilot has that friend code.');
    if (friend.id === player.id) throw new HttpError(400, 'You cannot add your own friend code.');
    if (!player.friends.includes(friend.id) && player.friends.length >= 100) {
      throw new HttpError(400, 'This pilot has reached the 100-friend limit.');
    }
    if (!player.friends.includes(friend.id)) {
      player.friends.push(friend.id);
      friend.friends.push(player.id);
      savePlayers();
      broadcastSnapshots();
    }
    respondJson(response, 200, makeSnapshot(player.id));
    return;
  }

  const removeFriend = /^\/api\/friends\/([a-f0-9-]{36})$/i.exec(url.pathname);
  if (request.method === 'DELETE' && removeFriend) {
    const friend = players.find((candidate) => candidate.id === removeFriend[1]);
    player.friends = player.friends.filter((friendId) => friendId !== removeFriend[1]);
    if (friend) friend.friends = friend.friends.filter((friendId) => friendId !== player.id);
    savePlayers();
    broadcastSnapshots();
    respondJson(response, 200, makeSnapshot(player.id));
    return;
  }

  throw new HttpError(404, 'Game API route not found.');
}

function handleEventStream(request, response, url) {
  const ticket = url.searchParams.get('ticket');
  const session = ticket && eventTickets.get(ticket);
  if (!session || session.expiresAt < Date.now()) {
    if (ticket) eventTickets.delete(ticket);
    throw new HttpError(401, 'Live connection ticket expired. Reconnect to the game server.');
  }
  eventTickets.delete(ticket);
  onlinePlayers.set(session.playerId, Date.now());
  const stream = { response, playerId: session.playerId };
  response.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  response.flushHeaders();
  eventStreams.add(stream);
  sendSnapshot(stream);
  response.on('close', () => eventStreams.delete(stream));
}

function handleStatic(request, response, pathname) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    throw new HttpError(405, 'Method not allowed.');
  }
  const files = {
    '/': ['index.html', 'text/html; charset=utf-8'],
    '/index.html': ['index.html', 'text/html; charset=utf-8'],
    '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
    '/script.js': ['script.js', 'text/javascript; charset=utf-8']
  };
  const entry = files[pathname];
  if (!entry) throw new HttpError(404, 'File not found.');
  const body = fs.readFileSync(path.join(__dirname, entry[0]));
  response.writeHead(200, {
    'Content-Type': entry[1],
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/api/events' && request.method === 'GET') {
      handleEventStream(request, response, url);
    } else if (url.pathname.startsWith('/api/')) {
      await handleApi(request, response, url);
    } else {
      handleStatic(request, response, url.pathname);
    }
  } catch (error) {
    if (response.headersSent) {
      response.destroy(error);
      return;
    }
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error('Game server request failed:', error);
    respondJson(response, status, { error: error.message || 'Internal server error.' });
  }
});

const presenceInterval = setInterval(broadcastSnapshots, 15_000);
const streamHeartbeat = setInterval(() => {
  for (const stream of eventStreams) {
    if (!stream.response.destroyed) stream.response.write(': keepalive\n\n');
  }
}, 20_000);
presenceInterval.unref();
streamHeartbeat.unref();

server.listen(port, host, () => {
  console.log(`Aether Rivals server ready at http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error('Unable to start the game server:', error.message);
  process.exitCode = 1;
});

function shutdown() {
  clearInterval(presenceInterval);
  clearInterval(streamHeartbeat);
  for (const stream of eventStreams) stream.response.end();
  savePlayers();
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
